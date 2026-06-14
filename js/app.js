// -------------------------------
// QR EXPORT
// -------------------------------

function exportToQR() {
  const modal = document.getElementById("qrExportModal");
  const list = document.getElementById("qrList");
  list.innerHTML = "";

  const data = {
    dates: loadDates(),
    categories: loadCategories(),
    images: loadImages()
  };

  const json = JSON.stringify(data);
  const compressed = LZString.compressToEncodedURIComponent(json);

  // Smaller chunks = less dense QR = easier scanning
  const chunkSize = 400;
  const chunks = [];
  for (let i = 0; i < compressed.length; i += chunkSize) {
    chunks.push(compressed.substring(i, i + chunkSize));
  }

  chunks.forEach((chunk, index) => {
    const wrapper = document.createElement("div");
    wrapper.className = "mb-4 text-center";

    // White border container
    const qrBox = document.createElement("div");
    qrBox.style.background = "white";
    qrBox.style.padding = "20px";
    qrBox.style.display = "inline-block";
    qrBox.style.borderRadius = "10px";

    const qrDiv = document.createElement("div");
    qrBox.appendChild(qrDiv);

    wrapper.appendChild(qrBox);

    new QRCode(qrDiv, {
      text: JSON.stringify({ index, total: chunks.length, chunk }),
      width: 220,
      height: 220,
      margin: 16
    });

    const label = document.createElement("div");
    label.className = "mt-2 text-secondary";
    label.innerText = `QR ${index + 1} of ${chunks.length}`;
    wrapper.appendChild(label);

    list.appendChild(wrapper);
  });

  modal.classList.remove("d-none");
}

function closeQRExportModal() {
  document.getElementById("qrExportModal").classList.add("d-none");
}



// -------------------------------
// QR IMPORT
// -------------------------------

let qrImportState = {
  total: null,
  chunks: {},
  reader: null
};

function startQRImport() {
  const modal = document.getElementById("qrImportModal");
  const status = document.getElementById("qrImportStatus");
  modal.classList.remove("d-none");

  qrImportState = { total: null, chunks: {}, reader: null };

  const reader = new Html5Qrcode("qrReader");
  qrImportState.reader = reader;

  reader.start(
    { facingMode: "environment", width: { min: 640 }, height: { min: 480 } },
    {
      fps: 10,
      qrbox: 250,
      formatsToSupport: [ Html5QrcodeSupportedFormats.QR_CODE ],
      experimentalFeatures: { useBarCodeDetectorIfSupported: false }
    },
    decoded => {
      try {
        const obj = JSON.parse(decoded);
        const { index, total, chunk } = obj;

        if (qrImportState.total === null) {
          qrImportState.total = total;
        }

        qrImportState.chunks[index] = chunk;

        status.innerText = `Scanned ${Object.keys(qrImportState.chunks).length} of ${total}`;

        if (Object.keys(qrImportState.chunks).length === total) {
          reader.stop();
          finishQRImport();
        }
      } catch (e) {
        console.warn("Invalid QR scan");
      }
    }
  );
}

function finishQRImport() {
  const modal = document.getElementById("qrImportModal");
  modal.classList.add("d-none");

  const ordered = [];
  for (let i = 0; i < qrImportState.total; i++) {
    ordered.push(qrImportState.chunks[i]);
  }

  const compressed = ordered.join("");
  const json = LZString.decompressFromEncodedURIComponent(compressed);

  try {
    const data = JSON.parse(json);

    saveDates(data.dates);
    saveCategories(data.categories);
    saveImages(data.images);

    alert("QR import complete!");
    renderCountdowns();
  } catch (err) {
    alert("Failed to import QR data.");
  }
}

function cancelQRImport() {
  const modal = document.getElementById("qrImportModal");
  modal.classList.add("d-none");

  if (qrImportState.reader) {
    qrImportState.reader.stop();
  }
}
