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

function getSelectedResults(userResult) {
  let selectedResults = {};

  if ($("#result-cash").hasClass("selected-result")) {
    selectedResults.cash = {
      totalAssets: userResult.money.cashTotalAssets,
      totalZakat: userResult.money.cash,
    };
  }

  if ($("#result-gold").hasClass("selected-result")) {
    selectedResults.gold = {
      totalAssets: userResult.money.goldTotalAssets,
      totalZakat: userResult.money.gold,
    };
  }

  if ($("#result-silver").hasClass("selected-result")) {
    selectedResults.silver = {
      totalAssets: userResult.money.silverTotalAssets,
      totalZakat: userResult.money.silver,
    };
  }

  if ($("#result-livestock").hasClass("selected-result")) {
    selectedResults.livestock = userResult.livestock;
  }

  if ($("#result-crops").hasClass("selected-result")) {
    selectedResults.crops = userResult.crops;
  }

  if ($("#result-trade").hasClass("selected-result")) {
    selectedResults.goods = userResult.goods;
  }

  return selectedResults;
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

function fillTotalResultBox(userInput, userResult, moneyTextFormat) {
  const tableBody = $("#result-total-assets-zakat");
  const selectedResults = getSelectedResults(userResult);
  const isMoneySelected =
    selectedResults.cash ||
    selectedResults.gold ||
    selectedResults.silver ||
    selectedResults.goods;

  tableBody.empty();

  // Display totalAssets and totalZakat of money (cash, gold, silver, goods)
  if (isMoneySelected) {
    const moneyTotalAssetsPlaceholder = $("#result-money-total-assets");
    const moneyTotalZakatPlaceholder = $("#result-money-total-zakat");
    let totalAssets = 0;
    let totalZakat = 0;

    moneyTotalAssetsPlaceholder.empty();
    moneyTotalZakatPlaceholder.empty();

    function handleMoneyResult(money) {
      totalAssets += money.totalAssets;
      totalZakat += money.totalZakat;
    }

    // Add up totalAssets and totalZakat from money results
    selectedResults.cash ? handleMoneyResult(selectedResults.cash) : null;
    selectedResults.gold ? handleMoneyResult(selectedResults.gold) : null;
    selectedResults.silver ? handleMoneyResult(selectedResults.silver) : null;
    selectedResults.goods ? handleMoneyResult(selectedResults.goods) : null;

    tableBody.append(
      `<tr>
        <td class="p-0 text-body-secondary py-3">${moneyTextFormat.format(
          totalAssets
        )}</td>
        <td class="p-0 text-body-secondary py-3">${moneyTextFormat.format(
          totalZakat
        )}</td>
      </tr>`
    );
  }

  // Display totalAssets and totalZakat of livestock
  if (selectedResults.livestock) {
    tableBody.append(
      `<tr>
        <td class="p-0 text-body-secondary py-3">${userInput.camel} camel</td>
        <td class="p-0 text-body-secondary py-3 result-livestock-total-zakat" id="result-camel-total-zakat"></td>
      </tr>`
    );

    tableBody.append(
      `<tr>
        <td class="p-0 text-body-secondary py-3">${userInput.cattle} cattle</td>
        <td class="p-0 text-body-secondary py-3 result-livestock-total-zakat" id="result-cattle-total-zakat"></td>
      </tr>`
    );

    tableBody.append(
      `<tr>
        <td class="p-0 text-body-secondary py-3">${userInput.sheep} sheep</td>
        <td class="p-0 text-body-secondary py-3 result-livestock-total-zakat" id="result-sheep-total-zakat"></td>
      </tr>`
    );

    processLivestockZakat(
      $("#result-camel-total-zakat"),
      selectedResults.livestock.camel,
      false
    );
    processLivestockZakat(
      $("#result-cattle-total-zakat"),
      selectedResults.livestock.cattle,
      false
    );
    processLivestockZakat(
      $("#result-sheep-total-zakat"),
      selectedResults.livestock.sheep,
      false
    );

    // Replaces the <li> tag with <p> for all livestock table data
    $(".result-livestock-total-zakat")
      .find("li")
      .replaceWith(function () {
        return $(`<p class="m-0" />`).append($(this).contents());
      });
  }

  // Display totalAssets and totalZakat of crops
  if (selectedResults.crops) {
    tableBody.append(
      `<tr>
        <td class="p-0 text-body-secondary py-3">${userInput.wheat} ${userInput.wheatUnit} wheat</td>
        <td class="p-0 text-body-secondary py-3">${selectedResults.crops.wheat.count} ${selectedResults.crops.wheat.unit} wheat</td>
      </tr>`
    );

    tableBody.append(
      `<tr>
        <td class="p-0 text-body-secondary py-3">${userInput.barley} ${userInput.barleyUnit} barley</td>
        <td class="p-0 text-body-secondary py-3">${selectedResults.crops.barley.count} ${selectedResults.crops.barley.unit} barley</td>
      </tr>`
    );

    tableBody.append(
      `<tr>
        <td class="p-0 text-body-secondary py-3">${userInput.dates} ${userInput.datesUnit} dates</td>
        <td class="p-0 text-body-secondary py-3">${selectedResults.crops.dates.count} ${selectedResults.crops.dates.unit} dates</td>
      </tr>`
    );

    tableBody.append(
      `<tr>
        <td class="p-0 text-body-secondary py-3">${userInput.raisins} ${userInput.raisinsUnit} raisins</td>
        <td class="p-0 text-body-secondary py-3">${selectedResults.crops.raisins.count} ${selectedResults.crops.raisins.unit} raisins</td>
      </tr>`
    );
  }
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

function processLivestockZakat(
  resultPlaceholder,
  livestockZakat,
  emptyPlaceholder
) {
  if (emptyPlaceholder) {
    resultPlaceholder.empty();
  }
  let count = 0;
  let listItem;
  for (const [key, value] of Object.entries(livestockZakat)) {
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

function fillLivestockResultBox(camelZakat, cattleZakat, sheepZakat) {
  processLivestockZakat($("#result-camel"), camelZakat, true);
  processLivestockZakat($("#result-cattle"), cattleZakat, true);
  processLivestockZakat($("#result-sheep"), sheepZakat, true);
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

function resetCollapseSummary() {
  // Result summary expanded by default
  $("#result-summary-chevron-down").hide();
  $("#result-summary-chevron-up").show();
  $("#result-summary-title").prop("aria-expanded", "true");
  $("#result-summary-entries").addClass("show");

  // Result details collapsed by default
  $("#result-details-chevron-down").show();
  $("#result-details-chevron-up").hide();
  $("#result-details-title").prop("aria-expanded", "false");
  $("#result-details").removeClass("show");
}

function fixCollapseArrows() {
  resetCollapseSummary();

  // Handle icon toggle based on collapse state
  $(".collapse-btn").on("click", function () {
    // Check if it's currently expanded
    const isExpanded = $(this).attr("aria-expanded") === "true";

    // Toggle icons immediately
    if (isExpanded) {
      $(this).find(".bi-chevron-down").hide();
      $(this).find(".bi-chevron-up").show();
    } else {
      $(this).find(".bi-chevron-down").show();
      $(this).find(".bi-chevron-up").hide();
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

  fixCollapseArrows();

  fillUserSummary(userInput, userSummaryPlaceholder);

  fillTotalResultBox(userInput, zakatPayable, moneyTextFormat);

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
