import { handleFormSubmit } from "./form-validator.js";
import { calculateZakat } from "./api-fetch.js";

// $("#nisab-input").on("change", setNisabValue);

$("form").on("submit", (e) => {
  const formData = handleFormSubmit(e);

  if (formData) {
    calculateZakat(formData);
  }
});
