// In grams
const GOLD_NISAB_VALUE = 85;
const SILVER_NISAB_VALUE = 595;

// Gram to Troy Ounce
function convertGramToOunce(gram) {
  const RATE = 31.1034768;
  return gram / RATE;
}

export function getNisabValue(nisabInput) {
  return new Promise((resolve, reject) => {
    if (nisabInput === "gold") {
      // API returns price of 1 oz of gold in USD currency
      $.get(import.meta.env.VITE_GOLD_PRICE_ENDPOINT, function (data) {
        if (data && data.price) {
          const goldNisabOz = convertGramToOunce(GOLD_NISAB_VALUE);
          resolve(goldNisabOz * data.price);
        } else {
          reject("Gold price not found");
        }
      }).fail(function () {
        reject("Error fetching gold price");
      });
    } else if (nisabInput === "silver") {
      // API returns price of 1 oz of silver in USD currency
      $.get(import.meta.env.VITE_SILVER_PRICE_ENDPOINT, function (data) {
        if (data && data.price) {
          const silverNisabOz = convertGramToOunce(SILVER_NISAB_VALUE);
          resolve(silverNisabOz * data.price);
        } else {
          reject("Silver price not found");
        }
      }).fail(function () {
        reject("Error fetching silver price");
      });
    } else {
      reject("Invalid nisab input");
    }
  });
}
