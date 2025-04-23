function getSelectedInputs(userInput) {
  let selectedInputs = {};

  if ($("#tab-nisab").hasClass("selected-tab")) {
    selectedInputs.nisab = userInput.nisabUnit;
  }

  if ($("#result-cash").hasClass("selected-result")) {
    selectedInputs.cash = `${userInput.currency} ${userInput.cash}`;
  }

  if ($("#result-gold").hasClass("selected-result")) {
    Object.entries(userInput).forEach(([key, value]) => {
      const goldMatch = key.match(/^gold(\d{2})$/); // Extracts the karat number

      if (goldMatch) {
        const karat = goldMatch[1];
        const amount = value;
        const unit = userInput[`gold${karat}Unit`] || "";
        const label = `Gold ${karat} Karat`;
        selectedInputs[label] = `${amount}${unit}`;
      }
    });
  }

  if ($("#result-silver").hasClass("selected-result")) {
    const amount = userInput.silver;
    const unit = userInput.silverUnit || "";
    selectedInputs.silver = `${amount}${unit}`;
  }

  if ($("#result-livestock").hasClass("selected-result")) {
    selectedInputs.camel = userInput.camel;
    selectedInputs.cattle = userInput.cattle;
    selectedInputs.sheep = userInput.sheep;
  }

  if ($("#result-crops").hasClass("selected-result")) {
    const cropTypes = ["wheat", "barley", "raisins", "dates"];
    const irrigationTypes = [
      "Not sure of irrigation",
      "Irrigated without costs",
      "Irrigated with costs",
      "Irrigated with and without costs equally",
      "Irrigation with costs is more benefecial than without costs",
      "Irrigation without costs is more benefecial than with costs",
    ];

    cropTypes.forEach((crop) => {
      const amount = userInput[crop];
      const unit = userInput[`${crop}Unit`] || "";
      const irrigation = userInput[`${crop}Irrigation`] || "";

      if (amount) {
        const label = crop.charAt(0).toUpperCase() + crop.slice(1); // Capitalize first letter
        selectedInputs[label] = `${amount} ${unit} | ${
          irrigationTypes[irrigation - 1]
        }`.trim();
      }
    });
  }

  if ($("#result-trade").hasClass("selected-result")) {
    selectedInputs["Trade Goods"] = `${userInput.currency} ${userInput.goods}`;
  }

  return selectedInputs;
}

function fillUserSummary(userInput, userSummaryPlaceholder) {
  userSummaryPlaceholder.empty();

  const selectedInputs = getSelectedInputs(userInput);

  Object.entries(selectedInputs).forEach(([key, value]) => {
    userSummaryPlaceholder.append(
      $(`<li class="list-group-item result-summary-entry">
          <div class="result-summary-key">${key}</div>
          <div class="result-summary-value">${value}</div>
        </li>`)
    );
  });
}

function fillCashResultBox(cashTotalAssets, cashZakat, moneyTextFormat) {
  $("#result-cash-total").text(moneyTextFormat.format(cashTotalAssets));
  $("#result-cash-zakat").text(moneyTextFormat.format(cashZakat));
}

function fillGoldResultBox(goldTotalAssets, goldZakat, moneyTextFormat) {
  $("#result-gold-total").text(moneyTextFormat.format(goldTotalAssets));
  $("#result-gold-zakat").text(moneyTextFormat.format(goldZakat));
}

function fillSilverResultBox(silverTotalAssets, silverZakat, moneyTextFormat) {
  $("#result-silver-total").text(moneyTextFormat.format(silverTotalAssets));
  $("#result-silver-zakat").text(moneyTextFormat.format(silverZakat));
}

function fillLivestockResultBox(camelZakat, cattleZakat, sheepZakat) {
  function processLivestockZakat(resultPlaceholder, zakat) {
    resultPlaceholder.empty();
    let count = 0;
    let listItem;
    for (const [key, value] of Object.entries(zakat)) {
      if (!(value === 0 || value === "")) {
        if (key.includes("type")) {
          listItem.append(` ${value}`);
        } else if (key.includes("count")) {
          listItem = $(`<li>${value}</li>`);
          resultPlaceholder.append(listItem);
        } else if (key.includes("operation")) {
          resultPlaceholder.append($(`<li>${value}</li>`));
        }
        count++;
      }
    }

    if (count === 0) {
      // No items returned => No zakat to be paid
      resultPlaceholder.append($("<li>0</li>"));
    }
  }

  processLivestockZakat($("#result-camel"), camelZakat);
  processLivestockZakat($("#result-cattle"), cattleZakat);
  processLivestockZakat($("#result-sheep"), sheepZakat);
}

function fillCropsResultBox(wheatZakat, barleyZakat, datesZakat, raisinsZakat) {
  $("#result-wheat").text(wheatZakat.count + " " + wheatZakat.unit);
  $("#result-barley").text(barleyZakat.count + " " + barleyZakat.unit);
  $("#result-dates").text(datesZakat.count + " " + datesZakat.unit);
  $("#result-raisins").text(raisinsZakat.count + " " + raisinsZakat.unit);
}

function fillGoodsResultBox(
  goodsTotalAssets,
  goodsTotalZakat,
  moneyTextFormat
) {
  $("#result-goods-total").text(moneyTextFormat.format(goodsTotalAssets));
  $("#result-goods-zakat").text(moneyTextFormat.format(goodsTotalZakat));
}

function scrollToResults(resultSection, offset = 40) {
  $("html, body").scrollTop(resultSection.offset().top - offset);
}

function resetCollapseSummary(collapseButton) {
  $(".bi-chevron-down").hide();
  $(".bi-chevron-up").show();

  collapseButton.prop("aria-expanded", "true");
  $("#result-summary-entries").addClass("collapse show");
}

function fixCollapseArrows(collapseButton) {
  resetCollapseSummary(collapseButton);

  // Handle icon toggle based on collapse state
  collapseButton.on("click", function () {
    // Check if it's currently expanded (before Bootstrap toggles it)
    const isExpanded = $(this).attr("aria-expanded") === "true";

    // Toggle icons immediately
    if (isExpanded) {
      $(".bi-chevron-down").hide();
      $(".bi-chevron-up").show();
    } else {
      $(".bi-chevron-down").show();
      $(".bi-chevron-up").hide();
    }
  });
}

export function displayResults(
  userInput,
  zakatPayable,
  resultSection,
  userSummaryPlaceholder
) {
  const moneyTextFormat = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: userInput.currency.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  fixCollapseArrows($("#result-summary-title"));

  fillUserSummary(userInput, userSummaryPlaceholder);

  // Cash Result Box
  fillCashResultBox(
    zakatPayable.money.cashTotalAssets,
    zakatPayable.money.cash,
    moneyTextFormat
  );

  // Gold Result Box
  fillGoldResultBox(
    zakatPayable.money.goldTotalAssets,
    zakatPayable.money.gold,
    moneyTextFormat
  );

  // Silver Result Box
  fillSilverResultBox(
    zakatPayable.money.silverTotalAssets,
    zakatPayable.money.silver,
    moneyTextFormat
  );

  // Livestock Result Box
  fillLivestockResultBox(
    zakatPayable.livestock.camel,
    zakatPayable.livestock.cattle,
    zakatPayable.livestock.sheep
  );

  // Crops Result Box
  fillCropsResultBox(
    zakatPayable.crops.wheat,
    zakatPayable.crops.barley,
    zakatPayable.crops.dates,
    zakatPayable.crops.raisins
  );

  // Trade Goods Result Box
  fillGoodsResultBox(
    zakatPayable.goods.totalAssets,
    zakatPayable.goods.totalZakat,
    moneyTextFormat
  );

  resultSection.show();

  scrollToResults(resultSection);
}
