document.addEventListener('DOMContentLoaded', () => {
  const queryInput = document.getElementById('queryInput');
  const searchButton = document.getElementById('searchButton');
  const resultDisplay = document.getElementById('resultDisplay');

  searchButton.addEventListener('click', () => {
    const query = queryInput.value;
    console.log("click:", encodeURIComponent(query))
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
          resultDisplay.innerHTML = result;
        })
        .catch(error => {
          console.error('Error:', error);
          resultDisplay.innerHTML = 'An error occurred.';
        });
    }
  });
});