function fillMoneyResultBox(
  totalAssets,
  cashZakat,
  goldZakat,
  silverZakat,
  totalZakat,
  moneyTextFormat
) {
  $("#result-money-total").text(moneyTextFormat.format(totalAssets));
  $("#result-cash").text(moneyTextFormat.format(cashZakat));
  $("#result-gold").text(moneyTextFormat.format(goldZakat));
  $("#result-silver").text(moneyTextFormat.format(silverZakat));
  $("#result-money-zakat").text(moneyTextFormat.format(totalZakat));
}

function fillLivestockResultBox(camelZakat, cattleZakat, sheepZakat) {
  function processLivestockZakat(resultPlaceholder, zakat) {
    resultPlaceholder.empty();
    let listItem;
    for (const [key, value] of Object.entries(zakat)) {
      if (!(value === 0 || value === "")) {
        if (key.includes("type")) {
          listItem = $(`<li>${value}</li>`);
        } else if (key.includes("count")) {
          listItem.append(`: ${value}`);
          resultPlaceholder.append(listItem);
        } else if (key.includes("operation")) {
          resultPlaceholder.append($(`<li>${key}: ${value}</li>`));
        }
      }
    }
  }

  processLivestockZakat($("#result-camel"), camelZakat);
  processLivestockZakat($("#result-cattle"), cattleZakat);
  processLivestockZakat($("#result-sheep"), sheepZakat);
}

function fillCropsResultBox(wheatZakat, barleyZakat, datesZakat, raisinsZakat) {
  $("#result-wheat").text(wheatZakat);
  $("#result-barley").text(barleyZakat);
  $("#result-dates").text(datesZakat);
  $("#result-raisins").text(raisinsZakat);
}

function scrollToResults(resultSection, offset = 40) {
  $("html, body").scrollTop(resultSection.offset().top - offset);
}

export function displayResults(zakatPayable, resultSection) {
  const moneyTextFormat = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: zakatPayable.money.currency.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  resultSection.show();
  scrollToResults(resultSection);

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
}
