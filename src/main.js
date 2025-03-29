import { handleFormSubmit } from "./form-validator.js";
import { calculateZakat } from "./api-fetch.js";

$("form").on("submit", (e) => {
  const formData = handleFormSubmit(e);
  if (formData) {
    calculateZakat(formData);
  }
});
