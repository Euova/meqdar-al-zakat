import { handleFormSubmit } from "./form-validator.js";
import { calculateZakat } from "./api-fetch.js";
import { displayResults } from "./result-display.js";

$("form").on("submit", async (e) => {
  const formData = handleFormSubmit(e);
  console.log(formData);
  if (formData) {
    try {
      const zakatPayable = await calculateZakat(formData); // Await the result of calculateZakat
      console.log(zakatPayable);
      if (zakatPayable) {
        displayResults(zakatPayable);
      } else {
        console.error("Error calculating zakat");
      }
    } catch (error) {
      console.error("Error calculating zakat:", error);
    }
  }
});
