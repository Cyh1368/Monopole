function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

serverUsername = getCookie("clientUsername");
if (serverUsername=="undefined"){
    document.getElementById("userStatus").innerHTML = "<i>Logged Out</i>";
} else {
    document.getElementById("userStatus").innerHTML = serverUsername;
}

// Get references to the textarea, display div, and the append button
const textarea = document.getElementById("latexEditor");
const displayDiv = document.getElementById("latexDisplay");
const initButton = document.getElementById("initButton");
const clearButton = document.getElementById("clearButton");

function init(){
    textarea.value = "$$$$";
    textarea.dispatchEvent(new Event("input"));
}

function clear(){
    textarea.value = "";
    textarea.dispatchEvent(new Event("input"));
}

document.addEventListener("DOMContentLoaded", function() {
    // Function to render MathJax in a specific element
    function renderMath(element) {
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, element]);
    }

    // Initial rendering of MathJax on page load for existing content
    renderMath(document.getElementById("latexDisplay"));

    // Function to update the result when the textarea changes
    function updateResult() {
        const latexCode = textarea.value;

        // Update the content of the display div with the rendered LaTeX
        displayDiv.innerHTML = "$$"+latexCode+"$$";

        // Trigger MathJax rendering for the updated content
        renderMath(displayDiv);
    }

    // Add an event listener to the textarea's input event
    textarea.addEventListener("input", updateResult);

    // Add an event listener to the append button
    initButton.addEventListener("click", function() {init()});
    clearButton.addEventListener("click", function() {clear()});
});

const renderedLatex = document.getElementById('latexDisplay');
const latexCodeTextarea = document.getElementById('latexEditor');

// Add event listeners to LaTeX blocks for dragging
const latexBlocks = document.querySelectorAll('.latex-block');
latexBlocks.forEach(block => {
  block.addEventListener('dragstart', e => {
    isDragging = true; // Set flag when dragging starts
    blockData = block.getAttribute("data-value")
    e.dataTransfer.setData('text/plain', blockData);
  });
  let isDragging = false; // Flag to track if dragging is happening

  block.addEventListener('click', () => {
    if (!isDragging) {
      const latexValue = block.getAttribute('data-value');
      latexCodeTextarea.value += `${latexValue}`;
      const inputEvent = new Event('input', { bubbles: true });
      latexCodeTextarea.dispatchEvent(inputEvent); // Simulate input event
    }
  });

  block.addEventListener('dragend', () => {
    isDragging = false; // Reset flag when dragging ends
  });
    
});

// // Add event listener to LaTeX display for dropping
// renderedLatex.addEventListener('dragover', e => {
//   e.preventDefault();
// });

// renderedLatex.addEventListener('drop', e => {
//   e.preventDefault();
//   const latexText = e.dataTransfer.getData('text/plain');
//   renderedLatex.innerHTML = `$$ ${latexText} $$`;
//   latexCodeTextarea.value = latexText;
// });
