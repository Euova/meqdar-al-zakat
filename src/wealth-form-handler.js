import { showTab } from "./multiple-step-form.js";

function triggerAlert(message, type) {
  const alertPlaceholder = $("#wealth-form-alert-placeholder");
  alertPlaceholder.empty();
  const wrapper = $("<div></div>");
  wrapper.html(
    [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      "</div>",
    ].join("")
  );

  alertPlaceholder.append(wrapper);
}

export function handleWealthFormSubmit(e) {
  e.preventDefault();

  let formData = new FormData(e.target);
  formData = Object.fromEntries(formData.entries());

  // Get all wealth types selected by user
  let wealthSelected = [];
  const nisabDependants = ["cash", "trade"];
  const currencyDependants = ["cash", "trade", "gold", "silver"];

  Object.keys(formData).forEach((key) => {
    wealthSelected.push(key);

    // Add nisab tab if needed
    if (!wealthSelected.includes("nisab") && nisabDependants.includes(key)) {
      wealthSelected.push("nisab");
    }

    // Add currency tab if needed
    if (
      !wealthSelected.includes("currency") &&
      currencyDependants.includes(key)
    ) {
      wealthSelected.push("currency");
    }
  });

  // If user does not select any wealth type
  if (wealthSelected.length < 1) {
    triggerAlert("Please select atleast one wealth type.", "danger");
    e.stopPropagation();
    return null;
  }

  wealthSelected.forEach((type, index) => {
    $(`#tab-${type}`).addClass("selected-tab");

    // Skips nisab and currency tabs for results
    if (["nisab", "currency"].includes(type)) return;

    $(`#result-${type}`).addClass("selected-result");
  });

  // Create steps circles based on the number of wealth types the user selects
  const stepsPlaceholder = $("#steps-placeholder");
  for (let i = 0; i < wealthSelected.length; i++) {
    stepsPlaceholder.append($('<span class="step"></span>'));
  }

  // Hide wealth form, show zakat form, display first tab in zakat form
  e.target.style.display = "none";
  $("#zakat-form").show();
  showTab(0);
}
