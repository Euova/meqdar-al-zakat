function filterCurrencies(currencies) {
  const unsupportedCurrencies = new Set([
    "CUC",
    "XAG",
    "SLL",
    "CLF",
    "XPT",
    "KPW",
    "XPD",
    "BTC",
    "VEF",
    "SVC",
    "XAU",
    "STD",
    "CNH",
  ]);

  const filteredCurrencies = Object.fromEntries(
    Object.entries(currencies).filter(([key]) => {
      if (unsupportedCurrencies.has(key)) {
        return false; // Exclude this key-value pair
      }
      return true; // Keep this key-value pair
    })
  );

  return filteredCurrencies;
}

export function fetchCurrencies() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "https://openexchangerates.org/api/currencies.json",
      type: "GET",
      dataType: "json", // Expecting JSON in the response
      success: function (responseData) {
        resolve(filterCurrencies(responseData)); // Resolve the promise with the response
      },
      error: function (error) {
        reject(error); // Reject the promise with the error
      },
    });
  });
}

export async function importCurrencyList(selectElement) {
  const currencies = await fetchCurrencies();
  $(".input-currency").empty();
  // Fill input-main-currency with all supported currencies
  Object.keys(currencies).forEach((key) => {
    $("#input-main-currency").append(
      $(`<option value=${key.toLowerCase()}>${key}</option>`)
    );
  });
}
