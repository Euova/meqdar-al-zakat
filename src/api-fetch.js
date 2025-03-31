export function calculateZakat(data) {
  data = JSON.stringify(data);
  $.ajax({
    url:
      "http://localhost:8080" || import.meta.env.VITE_ZAKAT_CALCULATOR_ENDPOINT,
    type: "POST",
    contentType: "application/json",
    data: data,
    dataType: "json", // Expecting JSON in the response
    success: function (responseData) {
      console.log(responseData);
    },
    error: function (error) {
      console.error(error);
    },
  });
}
