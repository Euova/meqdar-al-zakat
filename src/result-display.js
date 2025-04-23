function getUsedInputs(userInput) {
  let selectedInputs = {
    nisab: userInput.nisabUnit,
  };

  if ($("#result-money").hasClass("selected-result")) {
    Object.assign(selectedInputs, {
      cash: `${userInput.currency} ${userInput.cash}`,
    });

    Object.entries(userInput).forEach(([key, value]) => {
      const goldMatch = key.match(/^gold(\d{2})$/); // Extracts the karat number
      const silverMatch = key === "silver";

      if (goldMatch) {
        const karat = goldMatch[1];
        const amount = value;
        const unit = userInput[`gold${karat}Unit`] || "";
        const label = `Gold ${karat} Karat`;
        selectedInputs[label] = `${amount}${unit}`;
      }

      if (silverMatch) {
        const amount = value;
        const unit = userInput["silverUnit"] || "";
        const label = "Silver";
        selectedInputs[label] = `${amount}${unit}`;
      }
    });
  }

  if ($("#result-livestock").hasClass("selected-result")) {
    Object.assign(selectedInputs, { camel: userInput.camel });
    Object.assign(selectedInputs, { cattle: userInput.cattle });
    Object.assign(selectedInputs, { sheep: userInput.sheep });
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
        }`.trim(); // Trim in case irrigation is empty
      }
    });
  }

  if ($("#result-trade").hasClass("selected-result")) {
    Object.assign(selectedInputs, {
      "Trade Goods": `${userInput.currency} ${userInput.goods}`,
    });
  }

  Object.entries(selectedInputs).forEach(([key, value]) => {
    // if (value === "0" || value === "0g") {
    // delete selectedInputs[key];
    // }
  });

  return selectedInputs;
}

function fillUserSummary(userInput, userSummaryPlaceholder) {
  userSummaryPlaceholder.empty();

  const selectedInputs = getUsedInputs(userInput);

  Object.entries(selectedInputs).forEach(([key, value]) => {
    userSummaryPlaceholder.append(
      $(`<li class="list-group-item result-summary-entry">
          <div class="result-summary-key">${key}</div>
          <div class="result-summary-value">${value}</div>
        </li>`)
    );
  });
}

function fillMoneyResultBox(
  moneyTotalAssets,
  cashZakat,
  goldZakat,
  silverZakat,
  moneyTotalZakat,
  moneyTextFormat
) {
  $("#result-money-total").text(moneyTextFormat.format(moneyTotalAssets));
  $("#result-cash").text(moneyTextFormat.format(cashZakat));
  $("#result-gold").text(moneyTextFormat.format(goldZakat));
  $("#result-silver").text(moneyTextFormat.format(silverZakat));
  $("#result-money-zakat").text(moneyTextFormat.format(moneyTotalZakat));
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
    currency: zakatPayable.money.currency.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  resultSection.show();
  scrollToResults(resultSection);

  fixCollapseArrows($("#result-summary-title"));

  fillUserSummary(userInput, userSummaryPlaceholder);

  // Money Result Box
  fillMoneyResultBox(
    zakatPayable.money.totalAssets,
    zakatPayable.money.cash,
    zakatPayable.money.gold,
    zakatPayable.money.silver,
    zakatPayable.money.totalZakat,
    moneyTextFormat
  );

  fillLivestockResultBox(
    zakatPayable.livestock.camel,
    zakatPayable.livestock.cattle,
    zakatPayable.livestock.sheep
  );

  fillCropsResultBox(
    zakatPayable.crops.wheat,
    zakatPayable.crops.barley,
    zakatPayable.crops.dates,
    zakatPayable.crops.raisins
  );

  fillGoodsResultBox(
    zakatPayable.goods.totalAssets,
    zakatPayable.goods.totalZakat,
    moneyTextFormat
  );
}
