const addSummaryBtn = document.getElementById("addSummary");
const addClientBtn = document.getElementById("addClientBtn");
const summaryOutput = document.getElementById("summaryOutput");
const copyWrapper = document.getElementById("copyWrapper");
const copyBtn = document.getElementById("copySummary");
const clearBtn = document.getElementById("clearSummary");
const clientFieldsContainer = document.getElementById("clientFieldsContainer");

// Utility: Get today's formatted date
function getFormattedDate() {
  const today = new Date();
  const options = { day: "2-digit", month: "long", year: "numeric" };
  return today.toLocaleDateString("en-GB", options);
}

// Show tooltip
function showTooltip(container, duration = 1500) {
  container.classList.add("show-tooltip");
  setTimeout(() => container.classList.remove("show-tooltip"), duration);
}

// Enable/Disable Add Summary
function validateInputs() {
  const clientNames = document.querySelectorAll(".clientName");
  const notes = document.querySelectorAll(".note");
  const websites = document.querySelectorAll(".website");

  let isValid = false;
  clientNames.forEach((input, i) => {
    if (
      input.value.trim() &&
      websites[i].value.trim() &&
      notes[i].value.trim()
    ) {
      isValid = true;
    }
  });

  addSummaryBtn.disabled = !isValid;
}

// Add a new client field group
function createClientFieldGroup() {
  const clone = document.querySelector(".client-group").cloneNode(true);
  clone.querySelectorAll("input").forEach((input) => (input.value = ""));
  clone.querySelector(".removeBtn").style.display = "block";
  clientFieldsContainer.appendChild(clone);
  attachInputListeners(clone);
  validateInputs();
}

// Remove client field group
clientFieldsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("removeBtn")) {
    e.target.closest(".client-group").remove();
    validateInputs();
  }
});

// Attach listeners to all inputs
function attachInputListeners(container = document) {
  container.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", validateInputs);
  });
}

attachInputListeners();

// Add another client group
addClientBtn.addEventListener("click", createClientFieldGroup);

// Add summary lines
addSummaryBtn.addEventListener("click", () => {
  const clientNames = document.querySelectorAll(".clientName");
  const notes = document.querySelectorAll(".note");
  const websites = document.querySelectorAll(".website");

  let lines = [];
  clientNames.forEach((client, i) => {
    const name = client.value.trim();
    let website = websites[i].value.trim();
    const note = notes[i].value.trim();

    if (!name || !website || !note) return;

    website = website.replace(/^https?:\/\//, "");
    const line = `${name} - ${website} ( ${note} )`;
    lines.push(line);
  });

  if (lines.length === 0) return;

  const dateHeader = `Md. Sujon  → Daily Summary ${getFormattedDate()}\n—--------------------------------------`;
  const fullText = `${dateHeader}\n${lines.join("\n")}`;

  summaryOutput.textContent = fullText;
  localStorage.setItem("dailySummary", fullText);
  copyWrapper.style.display = "flex";

  // Reset all but the first field group
  clientFieldsContainer
    .querySelectorAll(".client-group")
    .forEach((group, i) => {
      if (i === 0) {
        group.querySelectorAll("input").forEach((input) => (input.value = ""));
        group.querySelector(".removeBtn").style.display = "none";
      } else {
        group.remove();
      }
    });

  addSummaryBtn.disabled = true;
});

// Copy summary
copyBtn.addEventListener("click", () => {
  const text = summaryOutput.textContent.trim();
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    showTooltip(copyBtn.parentElement);
  });
});

// Clear summary
clearBtn.addEventListener("click", () => {
  summaryOutput.textContent = "";
  copyWrapper.style.display = "none";
  localStorage.removeItem("dailySummary");
  showTooltip(clearBtn.parentElement);
});

// Load from localStorage
window.addEventListener("DOMContentLoaded", () => {
  const savedSummary = localStorage.getItem("dailySummary");
  if (savedSummary) {
    summaryOutput.textContent = savedSummary;
    copyWrapper.style.display = "flex";
  }
});
