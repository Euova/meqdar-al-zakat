function fillMoneyResultBox(cashZakat, goldZakat, silverZakat) {
  const totalZakat = cashZakat + goldZakat + silverZakat;
  $("#result-money-total").text();
  $("#result-cash").text(cashZakat.toFixed(2));
  $("#result-gold").text(goldZakat.toFixed(2));
  $("#result-silver").text(silverZakat.toFixed(2));
  $("#result-money-zakat").text(totalZakat.toFixed(2));
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

export function displayResults(zakatPayable) {
  // Money Result Box
  fillMoneyResultBox(
    zakatPayable.money.cash,
    zakatPayable.money.gold,
    zakatPayable.money.silver
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
