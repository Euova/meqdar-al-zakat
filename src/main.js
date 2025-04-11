import { handleFormSubmit } from "./form-validator.js";
import { calculateZakat } from "./api-fetch.js";
import { displayResults } from "./result-display.js";
import { importCurrencyList } from "./currencies-fetch.js";

async function initializePage() {
  // Enable Bootstrap popovers
  const popoverTriggerList = document.querySelectorAll(
    '[data-bs-toggle="popover"]'
  );
  const popoverList = [...popoverTriggerList].map(
    (popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl)
  );

  // Import currency list into appropraite select inputs
  await importCurrencyList();

  // Sync the cash currency with goods currency
  syncTradeGoodsCurrency();

  // Hide result section
  $("#result-section").hide();
}

function syncTradeGoodsCurrency() {
  var selectedText = $("#input-cash-currency option:selected").text(); // Get the text of the selected option

  // Empty input-goods-currency and add the selected option from input-cash-currency
  $("#input-goods-currency").empty().append(new Option(selectedText));
}

// On document ready
$(() => {
  initializePage();

  $("#input-cash-currency").on("change", () => {
    syncTradeGoodsCurrency();
  });

  $("form").on("submit", async (e) => {
    const formData = handleFormSubmit(e);
    console.log(formData);
    if (formData) {
      try {
        const zakatPayable = await calculateZakat(formData); // Await the result of calculateZakat
        console.log(zakatPayable);
        if (zakatPayable) {
          displayResults(zakatPayable, $("#result-section"));
        } else {
          console.error("Error calculating zakat");
        }
      } catch (error) {
        console.error("Error calculating zakat:", error);
      }
    }
  });
});
