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
const CMD_USER_KEY = "keith";

function getGCalClientId() {
  return localStorage.getItem("cmd_gcal_client_id") || "";
}

function getGCalCalendarId() {
  return localStorage.getItem("cmd_gcal_calendar_id") || "primary";
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

// Match trailing {count_my_days{...}} blocks (including nested braces).
function stripCmdPayloadFromDescription(description) {
  let text = String(description || "");
  const marker = "{count_my_days";
  const idx = text.lastIndexOf(marker);
  if (idx === -1) return text.trimEnd();
  return text.slice(0, idx).trimEnd();
}

// User-requested shape: {count_my_days{'keith': {category: "...", image: "..."}}}
function buildDescriptionWithCmdPayload(existingDescription, category, image) {
  const base = stripCmdPayloadFromDescription(existingDescription);
  const cat = String(category || "").replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  const img = String(image || "").replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  const payloadText = "{count_my_days{'" + CMD_USER_KEY + "': {category: \"" + cat + "\", image: \"" + img + "\"}}}";
  if (!base) return payloadText;
  return base + "\n" + payloadText;
}

function parseCmdPayloadFromDescription(description) {
  const text = String(description || "");
  const marker = "{count_my_days";
  const idx = text.lastIndexOf(marker);
  if (idx === -1) return null;
  const block = text.slice(idx);
  const userRe = new RegExp("['\"]" + CMD_USER_KEY + "['\"]\\s*:\\s*\\{([^}]*)\\}");
  const userMatch = block.match(userRe);
  if (!userMatch) return null;
  const body = userMatch[1];
  const catMatch = body.match(/category\s*:\s*"((?:\\.|[^"\\])*)"/);
  const imgMatch = body.match(/image\s*:\s*"((?:\\.|[^"\\])*)"/);
  const unescape = s => String(s || "").replace(/\\"/g, '"').replace(/\\\\/g, "\\");
  return {
    category: catMatch ? unescape(catMatch[1]) : "",
    image: imgMatch ? unescape(imgMatch[1]) : ""
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