import { getNisabValue } from "./nisab-fetch.js";

export function handleFormSubmit(e) {
  const form = e.target; // Get form

  form.classList.add("was-validated");

  e.preventDefault();

  if (!form.checkValidity()) {
    e.stopPropagation();
  } else {
    // Get form data and convert to JS object
    let formData = new FormData(form);

    formData = Object.fromEntries(formData.entries());
    getNisabValue(formData.nisab).then((data) => console.log(data));
    // if (getNisabValue(formData.nisab))
    Object.keys(formData).forEach((key) => {
      const value = formData[key];

      if (value.trim().length === 0) {
        formData[key] = "0"; // Update the value to "0" if it's an empty string after trimming
      }
    });

    return formData;
  }
  return null;
}
