import { handleZakatFormSubmit } from "./zakat-form-validator.js";
import { calculateZakat } from "./api-fetch.js";
import { displayResults } from "./result-display.js";
import { importCurrencyList } from "./currencies-fetch.js";
import {
  initializeMultipleStepForm,
  resetMultiStepForm,
} from "./multiple-step-form.js";
import { handleWealthFormSubmit } from "./wealth-form-handler.js";

const loadingPage = $("#loader-page");

function loadNewCalculation() {
  const wealthForm = $("#wealth-form");
  const zakatForm = $("#zakat-form");

  wealthForm[0].reset();
  zakatForm[0].reset();

  resetMultiStepForm();

  syncCurrency();

  $("#wealth-form-alert-placeholder").empty();
  $("#result-section").hide();

  $("#wealth-form").show();
}

async function initializePage() {
  // Load instructions set when user enters webpage
  $("#instruction-btn").trigger("click");

  // Enable Bootstrap popovers (e.g. the additional information beside each input field)
  const popoverTriggerList = document.querySelectorAll(
    '[data-bs-toggle="popover"]'
  );
  const popoverList = [...popoverTriggerList].map(
    (popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl)
  );

  initializeMultipleStepForm();

  $("#zakat-form").hide();

  // Import currency list into appropraite select inputs
  await importCurrencyList();

  // Sync the cash and goods currency with main currency
  syncCurrency();

  // Hide result section
  $("#result-section").hide();

  $("#reset-btn").on("click", loadNewCalculation);

  // Hide loading screen
  loadingPage.hide();
}

function syncCurrency() {
  var selectedText = $("#input-main-currency option:selected").text(); // Get the text of the selected option

  // Empty input-goods-currency and input-cash-currency and add the selected option from input-main-currency
  $("#input-goods-currency").empty().append(new Option(selectedText));
  $("#input-cash-currency").empty().append(new Option(selectedText));
}

// On document ready
$(() => {
  initializePage();

  $("#input-main-currency").on("change", () => {
    syncCurrency();
  });

  $("#wealth-form").on("submit", (e) => {
    handleWealthFormSubmit(e);
  });

  $("#zakat-form").on("submit", async (e) => {
    const formData = handleZakatFormSubmit(e);
    if (formData) {
      try {
        // Show loading screen
        loadingPage.show();
        const zakatPayable = await calculateZakat(formData); // Await the result of calculateZakat
        // Hide loading screen
        loadingPage.hide();
        if (zakatPayable) {
          $("#zakat-form").hide();
          displayResults(
            formData,
            zakatPayable,
            $("#result-section"),
            $("#result-user-summary")
          );
        } else {
          console.error("Error calculating zakat");
        }
      } catch (error) {
        console.error("Error calculating zakat:", error);
      }
    }
  });
});
