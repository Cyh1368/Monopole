document.addEventListener('DOMContentLoaded', () => {
  const queryInput = document.getElementById('queryInput');
  const searchButton = document.getElementById('searchButton');
  const resultDisplay = document.getElementById('resultDisplay');

  searchButton.addEventListener('click', () => {
    const query = queryInput.value;
    resultDisplay.innerHTML = "Loading content..."
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
                  
                  var h1 = document.createElement("h1");
                  h1.textContent = key;
                  
                  var link = document.createElement("a");
                  link.href = element.url;
                  link.textContent = element.url;
                  
                  resultDisplay.appendChild(h1);
                  resultDisplay.appendChild(link);
              }
          }
          // resultDisplay.innerHTML = result;
          // console.log(JSON.parse(result));
        })
        .catch(error => {
          console.error('Error:', error);
          resultDisplay.innerHTML = 'An error occurred.';
        });
    }
  });
});