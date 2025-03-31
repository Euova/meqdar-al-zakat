export function calculateZakat(data) {
  return new Promise((resolve, reject) => {
    data = JSON.stringify(data);
    $.ajax({
      url:
        "http://localhost:8080" ||
        import.meta.env.VITE_ZAKAT_CALCULATOR_ENDPOINT,
      type: "POST",
      contentType: "application/json",
      data: data,
      dataType: "json", // Expecting JSON in the response
      success: function (responseData) {
        resolve(responseData); // Resolve the promise with the response
      },
      error: function (error) {
        reject(error); // Reject the promise with the error
      },
    });
  });
}
