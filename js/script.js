const addSummaryBtn = document.getElementById("addSummary");
const summaryOutput = document.getElementById("summaryOutput");
const copyWrapper = document.getElementById("copyWrapper");
const copyBtn = document.getElementById("copySummary");
const clientInput = document.getElementById("clientName");

// Enable "Add to Summary" only when client name is entered
const websiteInput = document.getElementById("website");
const noteInput = document.getElementById("note");

// Function to check if all fields are filled
function checkFormValidity() {
  const isValid =
    clientInput.value.trim() !== "" &&
    websiteInput.value.trim() !== "" &&
    noteInput.value.trim() !== "";

  addSummaryBtn.disabled = !isValid;
}

// Listen to input changes on all fields
clientInput.addEventListener("input", checkFormValidity);
websiteInput.addEventListener("input", checkFormValidity);
noteInput.addEventListener("input", checkFormValidity);

function getFormattedDate() {
  const today = new Date();
  const options = { day: "2-digit", month: "long", year: "numeric" };
  return today.toLocaleDateString("en-GB", options);
}

addSummaryBtn.addEventListener("click", () => {
  const client = clientInput.value.trim();
  let website = document.getElementById("website").value.trim();
  const note = document.getElementById("note").value.trim();

  if (!client) return;

  website = website.replace(/^https?:\/\//, "");
  const formattedNote = note ? `( ${note} )` : "";
  const line = `${client} - ${website} ${formattedNote}`.trim();

  if (summaryOutput.textContent.trim() === "") {
    const dateLine = `Md. Sujon  → Daily Summary ${getFormattedDate()}\n—--------------------------------------`;
    summaryOutput.textContent = `${dateLine}\n${line}`;
  } else {
    summaryOutput.textContent += `\n${line}`;
  }

  // Show copy button
  copyWrapper.style.display = "inline-block";

  // Clear inputs
  clientInput.value = "";
  document.getElementById("website").value = "";
  document.getElementById("note").value = "";
  addSummaryBtn.disabled = true;
});

copyBtn.addEventListener("click", () => {
  const text = summaryOutput.textContent.trim();
  if (!text) return alert("Nothing to copy!");

  navigator.clipboard
    .writeText(text)
    .then(() => {
      copyWrapper.classList.add("show-tooltip");
      setTimeout(() => {
        copyWrapper.classList.remove("show-tooltip");
      }, 1500);
    })
    .catch(() => {
      alert("Copy failed");
    });
});
