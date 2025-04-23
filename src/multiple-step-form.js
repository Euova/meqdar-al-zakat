let currentTabIndex = 0;

export function resetMultiStepForm() {
  $(".selected-tab").removeClass("selected-tab");
  $(".selected-result").removeClass("selected-result");

  $(".is-valid").removeClass("is-valid");
  $(".is-invalid").removeClass("is-invalid");
  $(".was-validated").removeClass("was-validated");

  $(".step").remove();

  currentTabIndex = 0;
}

export function initializeMultipleStepForm() {
  $("#prevBtn").on("click", () => {
    nextPrev(-1);
  });
  $("#nextBtn").on("click", () => {
    nextPrev(1);
  });
}

export function showTab(n) {
  const selectedTabs = $(".selected-tab");

  // Fix the Previous/Next buttons:
  selectedTabs[n].style.display = "block"; // Displays the tab passed as a parameter

  // Checks if current tab is the first tab
  if (n == 0) {
    $("#prevBtn").css("display", "none");
  } else {
    $("#prevBtn").css("display", "inline");
  }

  // Checks if current tab is the last tab
  if (n == selectedTabs.length - 1) {
    $("#nextBtn").text("Calculate Zakat");
  } else {
    $("#nextBtn").text("Next");
  }

  // Run a function that displays the correct step indicator
  fixStepIndicator(n);
}

function nextPrev(n) {
  // This function will figure out which tab to display
  const selectedTabs = $(".selected-tab");

  // Exit the function if user tries to go next and any field in the current tab is invalid:
  if (n == 1 && !validateForm()) return false;

  // Hide the current tab
  selectedTabs[currentTabIndex].style.display = "none";

  // Increase or decrease the current tab by 1
  currentTabIndex = currentTabIndex + n;

  // If you have reached the end of the form
  if (currentTabIndex >= selectedTabs.length) {
    // The form gets submitted
    $("#zakat-form").trigger("submit");
    return false;
  }

  // Otherwise, display the correct tab
  showTab(currentTabIndex);
}

function validateForm() {
  // This function deals with validation of the form fields
  let valid = true;
  const selectedTabs = $(".selected-tab");
  const currentTabInputs =
    selectedTabs[currentTabIndex].getElementsByTagName("input");
  // A loop that checks every input field in the current tab:
  for (let i = 0; i < currentTabInputs.length; i++) {
    if (!currentTabInputs[i].checkValidity()) {
      currentTabInputs[i].classList.remove("is-valid");
      currentTabInputs[i].classList.add("is-invalid");
      valid = false;
    } else {
      currentTabInputs[i].classList.remove("is-invalid");
      currentTabInputs[i].classList.add("is-valid");
    }
  }
  // If the valid status is true, mark the step as finished and valid:
  if (valid) {
    $(".step")[currentTabIndex].classList.add("finish");
  }
  return valid; // return the valid status
}

function fixStepIndicator(n) {
  // This function removes the "active" class of all steps
  let steps = $(".step");
  for (let i = 0; i < steps.length; i++) {
    steps[i].classList.remove("active");
  }
  // Adds the "active" class to the current step
  steps[n].classList.add("active");
}
