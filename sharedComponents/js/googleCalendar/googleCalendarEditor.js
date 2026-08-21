// -------------------------------
// googleCalendarEditor.js - Edit Google Calendar events
// Same layout as Edit -> Dates, but driven by cmd_google_cal feed.
// No delete. Edit button sits where Delete sits on the Dates list.
// Title / Date / Once|Annual are read-only. OK patches description on Google.
// -------------------------------

let gcalEditingIndex = -1;
let gcalEditBuffer = null;
let gcalTitleSearch = "";
let gcalEditingEventId = null;

function openGoogleEventsEditor() {
  document.getElementById("countdownContainer").classList.add("d-none");
  document.getElementById("datesEditor").classList.add("d-none");
  document.getElementById("categoriesEditor").classList.add("d-none");
  document.getElementById("imagesEditor").classList.add("d-none");
  document.getElementById("settingsPage").classList.add("d-none");
  const el = document.getElementById("googleEventsEditor");
  if (el) el.classList.remove("d-none");
  gcalEditingIndex = -1;
  gcalEditBuffer = null;
  gcalEditingEventId = null;
  gcalTitleSearch = "";
  renderGoogleEventsEditor();
}

function closeGoogleEventsEditor() {
  const el = document.getElementById("googleEventsEditor");
  if (el) el.classList.add("d-none");
  document.getElementById("countdownContainer").classList.remove("d-none");
  gcalEditingIndex = -1;
  gcalEditBuffer = null;
  gcalEditingEventId = null;
  gcalTitleSearch = "";
  renderCountdowns();
}

function getGoogleEventEntries() {
  const feed = loadGoogleCalFeed();
  if (!feed || !Array.isArray(feed.items)) return [];
  return feed.items
    .map((evt, index) => {
      const d = gcalEventToDate(evt);
      if (!d) return null;
      return { d, index, evt };
    })
    .filter(Boolean)
    .sort((a, b) => targetDate(a.d) - targetDate(b.d));
}

function renderGoogleEventsEditor() {
  const list = document.getElementById("gcalEditorList");
  const topTile = document.getElementById("gcalAddTileTop");
  const filterEl = document.getElementById("gcalEditorFilters");
  const singleEditor = document.getElementById("singleGcalEditor");
  if (!list || !topTile || !filterEl || !singleEditor) return;

  list.innerHTML = "";
  topTile.innerHTML = "";
  filterEl.innerHTML = "";
  singleEditor.innerHTML = "";

  const categories = loadCategories();
  const images = loadImages();
  const now = new Date();
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const entries = getGoogleEventEntries();

  if (gcalEditingIndex >= 0) {
    list.classList.add("d-none");
    topTile.classList.add("d-none");
    filterEl.classList.add("d-none");
    singleEditor.classList.remove("d-none");

    const entry = entries.find(e => e.index === gcalEditingIndex);
    const dateData = gcalEditBuffer || (entry ? entry.d : null);
    if (!dateData) {
      gcalEditingIndex = -1;
      gcalEditBuffer = null;
      renderGoogleEventsEditor();
      return;
    }

    const category = dateData.category ? categories.find(c => c.name === dateData.category) : null;
    const imgSrc = (() => {
      if (!category) return "";
      const imageName = category.image || category.name;
      const image = images.find(i => i.name === imageName);
      return image ? image.data : "";
    })();
    const dateImgSrc = dateData.image ? (images.find(i => i.name === dateData.image)?.data || "") : "";

    const day = dateData.day || 1;
    const month = dateData.month || 1;
    const year = dateData.year || now.getFullYear();
    const dateStr = `${day} ${months[month - 1]} ${year}`;
    const isRecurring = !!(entry && entry.evt && (entry.evt.recurringEventId || (entry.evt.recurrence && entry.evt.recurrence.length)));
    const typeStr = isRecurring ? "Recurring" : "Once";
    const showChecked = dateData.show !== false;

    const catImgMap = {};
    categories.forEach(c => {
      const imageName = c.image || c.name;
      const img = images.find(i => i.name === imageName);
      catImgMap[c.name] = img ? img.data : "";
    });
    const allImgMap = {};
    images.forEach(img => { allImgMap[img.name] = img.data; });

    singleEditor.innerHTML = `
      <div class="d-flex align-items-center mb-3">
        <h3 class="mb-0">Edit Google Event</h3>
        <button class="btn btn-outline-secondary ms-auto" onclick="cancelGcalEditing()">Back</button>
      </div>
      <div class="card p-3 card-edited">
        <div class="d-flex gap-1">
          <div class="flex-shrink-0 text-center me-3 d-flex gap-2">
            <div>
              ${imgSrc ? `<img src="${imgSrc}" class="date-img">` : `<div class="text-secondary date-img d-flex align-items-center justify-content-center">No image</div>`}
              <div class="dropdown mt-1">
                <button class="btn btn-outline-secondary btn-sm dropdown-toggle w-100" type="button" data-bs-toggle="dropdown">
                  ${dateData.category || "No Category"}
                </button>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="#" onclick="gcalEditBufferField('category', ''); return false;"><span style="display:inline-block;width:16px;height:16px;margin-right:6px"></span>No Category</a></li>
                  ${categories.slice().sort((a, b) => a.name.localeCompare(b.name)).map(c => `
                    <li><a class="dropdown-item" href="#" onclick="gcalEditBufferField('category', '${escapeHtml(c.name)}'); return false;">
                      ${catImgMap[c.name] ? `<img src="${catImgMap[c.name]}" style="width:16px;height:16px;object-fit:contain;margin-right:6px">` : `<span style="display:inline-block;width:16px;height:16px;margin-right:6px"></span>`}
                      ${escapeHtml(c.name)}
                    </a></li>
                  `).join("")}
                </ul>
              </div>
            </div>
            <div>
              ${dateImgSrc ? `<img src="${dateImgSrc}" class="date-img">` : `<div class="text-secondary date-img d-flex align-items-center justify-content-center">No image</div>`}
              <div class="dropdown mt-1">
                <button class="btn btn-outline-secondary btn-sm dropdown-toggle w-100" type="button" data-bs-toggle="dropdown">
                  ${dateData.image || "None"}
                </button>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="#" onclick="gcalEditBufferField('image', '');renderGoogleEventsEditor(); return false;"><span style="display:inline-block;width:16px;height:16px;margin-right:6px"></span>None</a></li>
                  ${images.slice().sort((a, b) => a.name.localeCompare(b.name)).map(img => `
                    <li><a class="dropdown-item" href="#" onclick="gcalEditBufferField('image', '${escapeHtml(img.name)}');renderGoogleEventsEditor(); return false;">
                      ${allImgMap[img.name] ? `<img src="${allImgMap[img.name]}" style="width:16px;height:16px;object-fit:contain;margin-right:6px">` : `<span style="display:inline-block;width:16px;height:16px;margin-right:6px"></span>`}
                      ${escapeHtml(img.name)}
                    </a></li>
                  `).join("")}
                </ul>
              </div>
            </div>
          </div>
          <div class="flex-fill" style="min-width:0">
            <div class="mb-2">
              <input class="form-control" value="${escapeHtml(dateData.name || "")}" readonly>
            </div>
            <div class="mb-2">
              <input class="form-control" value="${escapeHtml(dateStr)}" readonly>
            </div>
            <div class="mb-2">
              <input class="form-control" value="${escapeHtml(typeStr)}" readonly>
            </div>
            <div class="mb-3 form-check">
              <input class="form-check-input" type="checkbox" id="gcalShowCheck" ${showChecked ? "checked" : ""} onchange="gcalEditBufferField('show', this.checked)">
              <label class="form-check-label" for="gcalShowCheck">Show</label>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-secondary editor-btn" onclick="cancelGcalEditing()">Cancel</button>
              <button class="btn btn-success editor-btn ms-auto" onclick="doneGcalEditing()">OK</button>
            </div>
          </div>
        </div>
      </div>
    `;

    updateNavState();
    return;
  }

  list.classList.remove("d-none");
  topTile.classList.remove("d-none");
  filterEl.classList.remove("d-none");
  singleEditor.classList.add("d-none");

  const filtered = entries.filter(({ d }) => {
    if (gcalTitleSearch && !d.name.toLowerCase().includes(gcalTitleSearch.toLowerCase())) return false;
    return true;
  });

  if (filtered.length === 0) {
    const empty = document.createElement("div");
    empty.className = "text-secondary mb-3";
    empty.textContent = entries.length === 0
      ? "No Google Calendar events cached. Use Google → Refresh or Load sample data."
      : "No events match the search.";
    list.appendChild(empty);
  }

  filtered.forEach(({ d, index }) => {
    const category = d.category ? categories.find(c => c.name === d.category) : null;
    const imgSrc = (() => {
      if (!category) return "";
      const imageName = category.image || category.name;
      const image = images.find(i => i.name === imageName);
      return image ? image.data : "";
    })();
    const dateImgSrc = d.image ? (images.find(i => i.name === d.image)?.data || "") : "";

    const showYear = d.type === "once";
    const day = d.day || 1;
    const month = d.month || 1;
    const year = d.year || now.getFullYear();
    const dateStr = showYear ? `${day} ${months[month-1]} ${year}` : `${day} ${months[month-1]}`;

    const card = document.createElement("div");
    card.className = "card p-3 mb-3";
    card.innerHTML = `
      <div class="d-flex gap-1">
        <div class="flex-shrink-0 text-center me-3 d-flex gap-2">
          <div>
            ${imgSrc ? `<img src="${imgSrc}" class="date-img">` : `<div class="text-secondary date-img d-flex align-items-center justify-content-center">No image</div>`}
            ${d.category ? `<div class="mt-1">${escapeHtml(d.category)}</div>` : ""}
          </div>
          <div>
            ${dateImgSrc ? `<img src="${dateImgSrc}" class="date-img">` : `<div class="text-secondary date-img d-flex align-items-center justify-content-center">No image</div>`}
          </div>
        </div>
        <div class="flex-fill" style="min-width:0">
          <div class="fw-bold editor-title mb-2">${escapeHtml(d.name)}</div>
          <div class="d-flex mb-1">
            <span>${dateStr}</span>
            <span class="ms-3">${d.type === "annual" ? "Annual" : "Once"}</span>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-primary editor-btn ms-auto" onclick="editGoogleEvent(${index})">Edit</button>
          </div>
        </div>
      </div>
    `;
    list.appendChild(card);
  });

  filterEl.innerHTML = `
    <div class="d-flex gap-2 align-items-center">
      <input class="form-control" type="search" placeholder="Search titles..." value="${escapeHtml(gcalTitleSearch)}" oninput="setGcalTitleSearch(this.value)">
      <button class="btn btn-outline-secondary btn-sm" onclick="gcalTitleSearch='';renderGoogleEventsEditor()">Clear</button>
    </div>
  `;

  topTile.innerHTML = `
    <div class="d-flex gap-2">
      <button class="btn btn-success editor-btn btn-wide ms-auto" onclick="closeGoogleEventsEditor()">Done</button>
    </div>
  `;

  updateNavState();
}

function setGcalTitleSearch(val) {
  gcalTitleSearch = val;
  renderGoogleEventsEditor();
  const input = document.querySelector('#gcalEditorFilters input[type="search"]');
  if (input) {
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  }
}

function editGoogleEvent(index) {
  const entries = getGoogleEventEntries();
  const entry = entries.find(e => e.index === index);
  if (!entry) return;
  gcalEditBuffer = JSON.parse(JSON.stringify(entry.d));
  if (typeof gcalEditBuffer.show === "undefined") gcalEditBuffer.show = true;
  gcalEditingIndex = index;
  gcalEditingEventId = entry.evt && entry.evt.id ? entry.evt.id : null;
  renderGoogleEventsEditor();
}

function cancelGcalEditing() {
  gcalEditingIndex = -1;
  gcalEditBuffer = null;
  gcalEditingEventId = null;
  renderGoogleEventsEditor();
}

function gcalEditBufferField(field, value) {
  if (!gcalEditBuffer) return;
  if (field !== "category" && field !== "image" && field !== "show") return;
  gcalEditBuffer[field] = value;
  if (field === "category" || field === "image") {
    renderGoogleEventsEditor();
  }
}

function doneGcalEditing() {
  if (gcalEditingIndex < 0 || !gcalEditBuffer) {
    cancelGcalEditing();
    return;
  }

  if (!getGCalUserName()) {
    showAppInfoModal("Google Calendar", "Set your Name in Settings → G Cal before saving event icons.");
    return;
  }

  const feed = loadGoogleCalFeed();
  if (!feed || !Array.isArray(feed.items)) {
    showAppInfoModal("Google Calendar", "No cached Google Calendar feed.");
    return;
  }

  const evt = feed.items[gcalEditingIndex];
  if (!evt) {
    showAppInfoModal("Google Calendar", "Event not found in cache.");
    return;
  }

  const category = gcalEditBuffer.category || "";
  const image = gcalEditBuffer.image || "";
  const show = gcalEditBuffer.show !== false;
  const cmd = { category: category, image: image, show: show };

  // Recurring instance: patch the master series event; apply settings to all local siblings.
  if (evt.recurringEventId) {
    const masterId = evt.recurringEventId;
    const seriesItems = feed.items.filter(item =>
      item && (item.recurringEventId === masterId || item.id === masterId)
    );
    const masterInCache = feed.items.find(item => item && item.id === masterId);
    const baseDescription = (masterInCache && masterInCache.description != null)
      ? masterInCache.description
      : evt.description;
    const newDescription = buildDescriptionWithCmdPayload(baseDescription, category, image, show);

    showSpinner();
    updateGoogleEventDescription(masterId, newDescription)
      .then(updated => {
        const desc = updated.description != null ? updated.description : newDescription;
        feed.items.forEach((item, i) => {
          if (!item) return;
          if (item.recurringEventId === masterId || item.id === masterId) {
            feed.items[i] = Object.assign({}, item, {
              description: item.id === masterId ? desc : item.description,
              _cmd: Object.assign({}, cmd)
            });
            if (item.id === masterId && updated && updated.etag) {
              feed.items[i].etag = updated.etag;
            }
          }
        });
        feed.items[gcalEditingIndex] = Object.assign({}, feed.items[gcalEditingIndex], {
          _cmd: Object.assign({}, cmd)
        });
        storeGoogleCalFeed(feed);
        hideSpinner();
        gcalEditingIndex = -1;
        gcalEditBuffer = null;
        gcalEditingEventId = null;
        renderGoogleEventsEditor();
        const n = seriesItems.length || 1;
        showAppInfoModal("Google Calendar", "Series description updated. Applied settings to " + n + " local event(s).");
      })
      .catch(err => {
        hideSpinner();
        showAppInfoModal("Google Calendar", "Failed to update series: " + err.message);
      });
    return;
  }

  if (!evt.id) {
    showAppInfoModal("Google Calendar", "Event has no Google event id.");
    return;
  }

  const newDescription = buildDescriptionWithCmdPayload(evt.description, category, image, show);

  showSpinner();
  updateGoogleEventDescription(evt.id, newDescription)
    .then(updated => {
      feed.items[gcalEditingIndex] = Object.assign({}, evt, updated, {
        description: updated.description != null ? updated.description : newDescription,
        _cmd: Object.assign({}, cmd)
      });
      storeGoogleCalFeed(feed);
      hideSpinner();
      gcalEditingIndex = -1;
      gcalEditBuffer = null;
      gcalEditingEventId = null;
      renderGoogleEventsEditor();
      showAppInfoModal("Google Calendar", "Event description updated.");
    })
    .catch(err => {
      hideSpinner();
      showAppInfoModal("Google Calendar", "Failed to update event: " + err.message);
    });
}
