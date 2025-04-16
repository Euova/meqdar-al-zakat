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

  fillGoodsResultBox(
    zakatPayable.goods.totalAssets,
    zakatPayable.goods.totalZakat,
    moneyTextFormat
  );
}
