export function calculateZakat(data) {
  return new Promise((resolve, reject) => {
    data = JSON.stringify(data);
    $.ajax({
      url: "https://meqdar-al-zakat-api-h2e5e4c4gqeafcax.uaenorth-01.azurewebsites.net/",
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
