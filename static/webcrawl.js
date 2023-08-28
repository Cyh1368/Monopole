function truncateString(str) {
  if (str.length > 50) {
      return str.substring(0, 50) + "...";
  } else {
      return str;
  }
}
document.addEventListener('DOMContentLoaded', () => {
  const queryInput = document.getElementById('queryInput');
  const searchButton = document.getElementById('searchButton');
  const resultDisplay = document.getElementById('resultDisplay');

  searchButton.addEventListener('click', () => {
    const query = queryInput.value;
    resultDisplay.innerHTML = "<h2>Loading content...</h2>"
    if (query) {
      fetch('/webcrawl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `query=${encodeURIComponent(query)}`,
      })
        .then(response => response.text())
        .then(result => {
          var jsonResult = JSON.parse(result);
          console.log(jsonResult);
          for (var key in jsonResult) {
              if (jsonResult.hasOwnProperty(key)) {
                  var element = jsonResult[key];

                  var link = document.createElement("a");
                  link.href = element.url;
                  link.textContent = truncateString(key);
                  
                  resultDisplay.appendChild(link);
              }
          }
          // resultDisplay.innerHTML = result;
          // console.log(JSON.parse(result));
        })
        .catch(error => {
          console.error('Error:', error);
          resultDisplay.innerHTML = '<h2>An error occurred.</h2>';
        });
    }
  });
});