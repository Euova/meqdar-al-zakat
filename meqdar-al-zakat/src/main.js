import $ from "jquery";
import { handleFormSubmit } from "./form-validator";
import { calculateZakat } from "./api-fetch";

// $("#nisab-input").on("change", setNisabValue);

$("form").on("submit", (e) => {
  const formData = handleFormSubmit(e);

  if (formData) {
    calculateZakat(formData);
  }
});
