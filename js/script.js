const addSummaryBtn = document.getElementById("addSummary");
const addClientBtn = document.getElementById("addClientBtn");
const summaryOutput = document.getElementById("summaryOutput");
const copyWrapper = document.getElementById("copyWrapper");
const copyBtn = document.getElementById("copySummary");
const clearBtn = document.getElementById("clearSummary");
const clientFieldsContainer = document.getElementById("clientFieldsContainer");

function getFormattedDate() {
  const today = new Date();
  const options = { day: "2-digit", month: "long", year: "numeric" };
  return today.toLocaleDateString("en-GB", options);
}

function showTooltip(container, duration = 1500) {
  container.classList.add("show-tooltip");
  setTimeout(() => container.classList.remove("show-tooltip"), duration);
}

function validateInputs() {
  const clientNames = document.querySelectorAll(".clientName");
  const notes = document.querySelectorAll(".note");
  const websites = document.querySelectorAll(".website");
  const mainUsername = document.getElementById("mainUsername").value.trim();

  let isValid = !!mainUsername;

  clientNames.forEach((input, i) => {
    if (
      input.value.trim() &&
      websites[i].value.trim() &&
      notes[i].value.trim()
    ) {
      // valid
    } else {
      isValid = false;
    }
  });

  addSummaryBtn.disabled = !isValid;
}

function createClientFieldGroup() {
  const clone = document.querySelector(".client-group").cloneNode(true);
  clone.querySelectorAll("input").forEach((input) => (input.value = ""));
  clone.querySelector(".removeBtn").style.display = "block";
  clientFieldsContainer.appendChild(clone);
  attachInputListeners(clone);
  validateInputs();
}

clientFieldsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("removeBtn")) {
    e.target.closest(".client-group").remove();
    validateInputs();
  }
});

function attachInputListeners(container = document) {
  container.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", validateInputs);
  });
}
attachInputListeners();

addClientBtn.addEventListener("click", createClientFieldGroup);

addSummaryBtn.addEventListener("click", () => {
  const clientNames = document.querySelectorAll(".clientName");
  const notes = document.querySelectorAll(".note");
  const websites = document.querySelectorAll(".website");
  const mainUsername = document.getElementById("mainUsername").value.trim();

  let lines = [];

  clientNames.forEach((client, i) => {
    const name = client.value.trim();
    let website = websites[i].value.trim();
    const note = notes[i].value.trim();

    if (!name || !website || !note) return;

    website = website.replace(/^https?:\/\//, "");
    const line = `${lines.length + 1}. ${name} - ${website} ( ${note} )`;
    lines.push(line);
  });

  if (lines.length === 0 || !mainUsername) return;

  const dateHeader = `<div class="summary-header">${mainUsername} → Daily Summary ${getFormattedDate()}<br>----------------------------------------</div>`;
  const fullText = `${dateHeader}\n\n${lines.join("\n")}`;

  summaryOutput.innerHTML = fullText;

  localStorage.setItem("dailySummary", fullText);
  copyWrapper.style.display = "flex";

  // Reset form
  document.getElementById("mainUsername").value = "";
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

copyBtn.addEventListener("click", () => {
  const text = summaryOutput.textContent.trim();
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    showTooltip(copyBtn.parentElement);
  });
});

clearBtn.addEventListener("click", () => {
  summaryOutput.textContent = "";
  copyWrapper.style.display = "none";
  localStorage.removeItem("dailySummary");
  showTooltip(clearBtn.parentElement);
});

window.addEventListener("DOMContentLoaded", () => {
  const savedSummary = localStorage.getItem("dailySummary");
  if (savedSummary) {
    summaryOutput.innerHTML = savedSummary;
    copyWrapper.style.display = "flex";
  }
});
