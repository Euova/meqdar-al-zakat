import $ from "jquery";

$("#input-nisab").on("change", () => {
  let nisabValue = 0;
  if ($("#input-nisab").val() == "gold") {
    $.get("https://api.gold-api.com/price/XAU", function (data) {
      nisabValue = data;
      console.log(nisabValue);
      $("#nisab-value").text(nisabValue.price);
    });
  } else if ($("#input-nisab").val() == "silver") {
    $.get("https://api.gold-api.com/price/XAG", function (data) {
      nisabValue = data;
      $("#nisab-value").text(nisabValue.price);
    });
  }
});
