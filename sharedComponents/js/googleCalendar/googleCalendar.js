// -------------------------------
// googleCalendar.js - Google Calendar OAuth + event feed
// Shared component. Loads Google Identity Services (GSI) on demand,
// exchanges an OAuth token, and fetches the calendar event feed.
// Settings are stored by the settings page under cmd_gcal_* keys.
// The event feed is cached by app.js under the key: cmd_google_cal
// -------------------------------

const GSI_SCRIPT_URL = "https://accounts.google.com/gsi/client";
const GOOGLE_CAL_SCOPE = "https://www.googleapis.com/auth/calendar.events";
const GOOGLE_CAL_CACHE_KEY = "cmd_google_cal";
const GOOGLE_CAL_TOKEN_KEY = "cmd_gcal_access_token";
const GOOGLE_CAL_TOKEN_EXP_KEY = "cmd_gcal_access_token_exp";
const CMD_PAYLOAD_MARKER = "count_my_days";

function getGCalClientId() {
  return localStorage.getItem("cmd_gcal_client_id") || "";
}

function getGCalCalendarId() {
  return localStorage.getItem("cmd_gcal_calendar_id") || "primary";
}

function getGCalUserName() {
  return (localStorage.getItem("cmd_gcal_name") || "").trim();
}

function getCachedGoogleAccessToken() {
  const token = localStorage.getItem(GOOGLE_CAL_TOKEN_KEY);
  const exp = parseInt(localStorage.getItem(GOOGLE_CAL_TOKEN_EXP_KEY) || "0", 10);
  // Refresh 60s before expiry
  if (token && exp > Date.now() + 60000) return token;
  return null;
}

function storeGoogleAccessToken(tokenResponse) {
  if (!tokenResponse || !tokenResponse.access_token) return;
  localStorage.setItem(GOOGLE_CAL_TOKEN_KEY, tokenResponse.access_token);
  const expiresInSec = parseInt(tokenResponse.expires_in, 10) || 3600;
  localStorage.setItem(GOOGLE_CAL_TOKEN_EXP_KEY, String(Date.now() + expiresInSec * 1000));
}

function clearGoogleAccessToken() {
  localStorage.removeItem(GOOGLE_CAL_TOKEN_KEY);
  localStorage.removeItem(GOOGLE_CAL_TOKEN_EXP_KEY);
}

function loadGoogleIdentityScript() {
  return new Promise((resolve, reject) => {
    if (window.google && google.accounts && google.accounts.oauth2) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = GSI_SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Identity Services."));
    document.head.appendChild(script);
  });
}

function requestGoogleAccessToken(forcePrompt) {
  if (localStorage.getItem("cmd_gcal_enabled") !== "true") {
    return Promise.reject(new Error("Google Calendar is not enabled. Turn it on in Settings -> G Cal."));
  }

  const clientId = getGCalClientId();
  if (!clientId) {
    return Promise.reject(new Error("Google Calendar is not configured. Add your OAuth Client ID in Settings -> G Cal."));
  }

  if (!forcePrompt) {
    const cached = getCachedGoogleAccessToken();
    if (cached) return Promise.resolve(cached);
  }

  return loadGoogleIdentityScript().then(() => {
    return new Promise((resolve, reject) => {
      let triedSilent = !forcePrompt;

      function handleTokenResponse(tokenResponse) {
        if (tokenResponse.error) {
          // Silent re-auth failed — fall back to interactive once
          if (triedSilent) {
            triedSilent = false;
            tokenClient.requestAccessToken({ prompt: "consent" });
            return;
          }
          reject(new Error("OAuth failed: " + (tokenResponse.error_description || tokenResponse.error)));
          return;
        }
        storeGoogleAccessToken(tokenResponse);
        resolve(tokenResponse.access_token);
      }

      const tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: GOOGLE_CAL_SCOPE,
        callback: handleTokenResponse
      });

      // prompt: "" tries to reuse prior consent without UI
      tokenClient.requestAccessToken(forcePrompt ? { prompt: "consent" } : { prompt: "" });
    });
  });
}

function googleApiFetch(url, options) {
  options = options || {};
  return requestGoogleAccessToken(false)
    .then(accessToken => {
      const headers = Object.assign({}, options.headers || {}, {
        Authorization: "Bearer " + accessToken
      });
      return fetch(url, Object.assign({}, options, { headers: headers }));
    })
    .then(res => {
      if (res.status !== 401) return res;
      // Token rejected — clear and retry once with interactive auth
      clearGoogleAccessToken();
      return requestGoogleAccessToken(true).then(accessToken => {
        const headers = Object.assign({}, options.headers || {}, {
          Authorization: "Bearer " + accessToken
        });
        return fetch(url, Object.assign({}, options, { headers: headers }));
      });
    });
}

// -------------------------------
// Fetch the Google Calendar event feed (JSON) with the OAuth exchange
// -------------------------------

function fetchEvents() {
  const calendarId = getGCalCalendarId();
  const url = "https://www.googleapis.com/calendar/v3/calendars/" +
    encodeURIComponent(calendarId) +
    "/events?maxResults=250&orderBy=startTime&singleEvents=true&timeMin=" +
    encodeURIComponent(new Date().toISOString());

  return googleApiFetch(url)
    .then(res => {
      if (!res.ok) throw new Error("Calendar API " + res.status + " " + res.statusText);
      return res.json();
    });
}

function refreshMainDisplay() {
  if (typeof renderCountdowns === "function") renderCountdowns();
}

// Extract trailing {count_my_days{...}} block (brace-balanced).
// Shape: {count_my_days{'name': {category: "...", image: "..."}, ...}}
function extractCmdPayloadBlock(description) {
  const text = String(description || "");
  const marker = "{count_my_days";
  const idx = text.lastIndexOf(marker);
  if (idx === -1) return { base: text.trimEnd(), block: null, users: {} };

  // Brace-balance from the opening '{' of the marker
  let depth = 0;
  let endIdx = -1;
  for (let i = idx; i < text.length; i++) {
    if (text[i] === "{") depth++;
    else if (text[i] === "}") {
      depth--;
      if (depth === 0) {
        endIdx = i + 1;
        break;
      }
    }
  }
  if (endIdx === -1) endIdx = text.length;

  const block = text.slice(idx, endIdx);
  // Inner users object starts at first '{' after marker text
  const afterMarker = idx + marker.length;
  let usersOpen = afterMarker;
  while (usersOpen < endIdx && text[usersOpen] !== "{") usersOpen++;
  let usersInner = "";
  if (text[usersOpen] === "{") {
    let d = 0;
    let start = -1;
    for (let i = usersOpen; i < endIdx; i++) {
      if (text[i] === "{") {
        d++;
        if (d === 1) start = i + 1;
      } else if (text[i] === "}") {
        d--;
        if (d === 0 && start !== -1) {
          usersInner = text.slice(start, i);
          break;
        }
      }
    }
  }

  return {
    base: text.slice(0, idx).trimEnd(),
    block: block,
    users: parseCmdUsersObject(usersInner)
  };
}

function parseCmdUsersObject(body) {
  const users = {};
  const unescape = s => String(s || "").replace(/\\"/g, '"').replace(/\\\\/g, "\\");
  // Match 'name': { ... } or "name": { ... }
  const entryRe = /['"]([^'"]+)['"]\s*:\s*\{([^}]*)\}/g;
  let m;
  while ((m = entryRe.exec(body)) !== null) {
    const name = m[1];
    const inner = m[2];
    const catMatch = inner.match(/category\s*:\s*"((?:\\.|[^"\\])*)"/);
    const imgMatch = inner.match(/image\s*:\s*"((?:\\.|[^"\\])*)"/);
    const showMatch = inner.match(/show\s*:\s*(true|false)/i);
    users[name] = {
      category: catMatch ? unescape(catMatch[1]) : "",
      image: imgMatch ? unescape(imgMatch[1]) : "",
      show: showMatch ? showMatch[1].toLowerCase() === "true" : true
    };
  }
  return users;
}

function serializeCmdUsersObject(users) {
  const escape = s => String(s || "").replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  const parts = Object.keys(users).map(name => {
    const u = users[name] || {};
    const safeName = String(name).replace(/'/g, "");
    const showVal = u.show === false ? "false" : "true";
    return "'" + safeName + "': {category: \"" + escape(u.category) + "\", image: \"" + escape(u.image) + "\", show: " + showVal + "}";
  });
  return parts.join(", ");
}

// Shape: {count_my_days{'keith': {category: "...", image: "...", show: true}, ...}}
// Amends the named user entry; leaves other names intact.
function buildDescriptionWithCmdPayload(existingDescription, category, image, show) {
  const userName = getGCalUserName();
  if (!userName) {
    throw new Error("Set your Name in Settings -> G Cal before saving event icons.");
  }

  const extracted = extractCmdPayloadBlock(existingDescription);
  const users = Object.assign({}, extracted.users);
  users[userName] = {
    category: category || "",
    image: image || "",
    show: show !== false
  };

  const payloadText = "{count_my_days{" + serializeCmdUsersObject(users) + "}}";
  if (!extracted.base) return payloadText;
  return extracted.base + "\n" + payloadText;
}

// Returns category/image/show for the configured Name only.
function parseCmdPayloadFromDescription(description) {
  const userName = getGCalUserName();
  if (!userName) return null;
  const extracted = extractCmdPayloadBlock(description);
  if (!extracted.users || !extracted.users[userName]) return null;
  const u = extracted.users[userName];
  return {
    category: u.category || "",
    image: u.image || "",
    show: u.show !== false
  };
}

function isGcalSequenceEvent(evt) {
  if (!evt) return false;
  if (evt.recurringEventId) return true;
  if (evt.recurrence && evt.recurrence.length) return true;
  return false;
}

// PATCH event description on Google Calendar (single event or series master id).
function updateGoogleEventDescription(eventId, description) {
  const calendarId = getGCalCalendarId();
  const url = "https://www.googleapis.com/calendar/v3/calendars/" +
    encodeURIComponent(calendarId) +
    "/events/" + encodeURIComponent(eventId);

  return googleApiFetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description: description })
  })
    .then(res => {
      if (!res.ok) throw new Error("Calendar API " + res.status + " " + res.statusText);
      return res.json();
    });
}

// -------------------------------
// Menu handler: Google -> Refresh. Fetch, store via app.js, report
// -------------------------------

// -------------------------------
// App info modal (replaces system alert dialogs)
// -------------------------------

function showAppInfoModal(title, message) {
  const modal = document.getElementById("appInfoModal");
  if (!modal) {
    alert(message);
    return;
  }
  document.getElementById("appInfoTitle").textContent = title;
  document.getElementById("appInfoMessage").textContent = message;
  modal.classList.remove("d-none");
}

function closeAppInfoModal() {
  const modal = document.getElementById("appInfoModal");
  if (modal) modal.classList.add("d-none");
}

function refreshGoogleCalendar() {
  showSpinner();
  fetchEvents()
    .then(json => {
      storeGoogleCalFeed(json);
      hideSpinner();
      refreshMainDisplay();
      const count = (json.items && json.items.length) || 0;
      showAppInfoModal("Google Calendar", "Refreshed: " + count + " events cached.");
    })
    .catch(err => {
      hideSpinner();
      showAppInfoModal("Google Calendar", "Failed to refresh: " + err.message);
    });
}

function clearGoogleCalCache() {
  localStorage.removeItem(GOOGLE_CAL_CACHE_KEY);
  refreshMainDisplay();
  showAppInfoModal("Google Calendar", "Cached feed cleared.");
}

// -------------------------------
// Load sample data from test/google_calendar.json
// -------------------------------

function loadGCalSampleData() {
  const cacheBuster = typeof BUILD_NUMBER !== "undefined" ? BUILD_NUMBER : Date.now();

  showSpinner();
  fetch("test/google_calendar.json?v=" + cacheBuster)
    .then(res => {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    })
    .then(json => {
      hideSpinner();
      if (!json.items) {
        showAppInfoModal("Sample Data", "Sample Google Calendar data is invalid.");
        return;
      }
      storeGoogleCalFeed(json);
      refreshMainDisplay();
      showAppInfoModal("Sample Data", json.items.length + " events cached under cmd_google_cal.");
    })
    .catch(err => {
      hideSpinner();
      showAppInfoModal("Sample Data", "Failed to load: " + err.message);
    });
}