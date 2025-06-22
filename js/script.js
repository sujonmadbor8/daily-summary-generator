const addSummaryBtn = document.getElementById("addSummary");
const summaryOutput = document.getElementById("summaryOutput");
const copyWrapper = document.getElementById("copyWrapper");
const copyBtn = document.getElementById("copySummary");
const clearBtn = document.getElementById("clearSummary");

const clientInput = document.getElementById("clientName");
const websiteInput = document.getElementById("website");
const noteInput = document.getElementById("note");

// Load from localStorage on page load
window.addEventListener("DOMContentLoaded", () => {
  const savedSummary = localStorage.getItem("dailySummary");
  if (savedSummary) {
    summaryOutput.textContent = savedSummary;
    copyWrapper.style.display = "inline-block";
  }
  checkFormValidity();
});

// Enable/disable Add button based on inputs
function checkFormValidity() {
  const isValid =
    clientInput.value.trim() !== "" &&
    websiteInput.value.trim() !== "" &&
    noteInput.value.trim() !== "";

  addSummaryBtn.disabled = !isValid;
}

clientInput.addEventListener("input", checkFormValidity);
websiteInput.addEventListener("input", checkFormValidity);
noteInput.addEventListener("input", checkFormValidity);

// Format date
function getFormattedDate() {
  const today = new Date();
  const options = { day: "2-digit", month: "long", year: "numeric" };
  return today.toLocaleDateString("en-GB", options);
}

// Utility function to show tooltip on button container
function showTooltip(buttonContainer, timeout = 1500) {
  buttonContainer.classList.add("show-tooltip");
  setTimeout(() => {
    buttonContainer.classList.remove("show-tooltip");
  }, timeout);
}

// Add summary
addSummaryBtn.addEventListener("click", () => {
  const client = clientInput.value.trim();
  let website = websiteInput.value.trim();
  const note = noteInput.value.trim();

  if (!client || !website || !note) return;

  website = website.replace(/^https?:\/\//, "");
  const formattedNote = `( ${note} )`;
  const line = `${client} - ${website} ${formattedNote}`.trim();

  if (summaryOutput.textContent.trim() === "") {
    const dateLine = `Md. Sujon  → Daily Summary ${getFormattedDate()}\n—--------------------------------------`;
    summaryOutput.textContent = `${dateLine}\n${line}`;
  } else {
    summaryOutput.textContent += `\n${line}`;
  }

  // Save to localStorage
  localStorage.setItem("dailySummary", summaryOutput.textContent);

  // Show copy/clear buttons
  copyWrapper.style.display = "inline-block";

  // Clear inputs & disable add button
  clientInput.value = "";
  websiteInput.value = "";
  noteInput.value = "";
  addSummaryBtn.disabled = true;
});

// Copy to clipboard
copyBtn.addEventListener("click", () => {
  const text = summaryOutput.textContent.trim();
  if (!text) {
    // Show tooltip on Copy button for "Nothing to copy"
    showTooltip(copyBtn.parentElement, 2000);
    return;
  }

  navigator.clipboard
    .writeText(text)
    .then(() => {
      showTooltip(copyBtn.parentElement);
    })
    .catch(() => {
      showTooltip(copyBtn.parentElement);
    });
});

// Clear Summary with tooltip instead of confirm alert
clearBtn.addEventListener("click", () => {
  if (summaryOutput.textContent.trim() === "") {
    // Show tooltip if summary already empty
    showTooltip(clearBtn.parentElement, 2000);
    return;
  }
  localStorage.removeItem("dailySummary");
  summaryOutput.textContent = "";
  copyWrapper.style.display = "none";
  showTooltip(clearBtn.parentElement);
});
