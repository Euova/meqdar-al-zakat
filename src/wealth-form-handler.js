import { showTab } from "./multiple-step-form.js";

export function handleWealthFormSubmit(e) {
  e.preventDefault();

  let formData = new FormData(e.target);
  formData = Object.fromEntries(formData.entries());

  // Get all wealth types selected by user
  let wealthSelected = ["nisab"];
  Object.keys(formData).forEach((key) => {
    wealthSelected.push(key);
  });

  // Format them to match html tab class names
  let moneyHandled = false;

  wealthSelected.forEach((type, index) => {
    $(`#tab-${type}`).addClass("selected-tab");

    // Skips nisab for results
    if (index === 0) return;

    if (
      !moneyHandled &&
      (wealthSelected.includes("cash") ||
        wealthSelected.includes("gold") ||
        wealthSelected.includes("silver"))
    ) {
      $("#result-money").addClass("selected-result");
      moneyHandled = true;
    } else {
      $(`#result-${type}`).addClass("selected-result");
    }
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
