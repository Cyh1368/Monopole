function neatDateFormat(utc){
    let d = new Date(utc);
    var options = {year: 'numeric', month: 'numeric', day: 'numeric', hour: "2-digit", minute: "2-digit"};

    return d.toLocaleDateString("en-US", options);
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    // console.log(parts);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

serverUsername = getCookie("clientUsername");
if (serverUsername=="undefined"){
    document.getElementById("userStatus").innerHTML = "<i>Logged Out</i>";
} else {
    document.getElementById("userStatus").innerHTML = serverUsername;
}

async function fetchQuestionByID(id) {
    // console.log("inside fetchrecentquestions.")
    const response = await fetch("/getQuestionByID?quesid="+id);
    const questionData = await response.json();
    // console.log(questionData);
    return questionData;
}
// console.log("Questions.js speaking, ");

async function fetchQuestionComments(id) {
    // console.log("inside fetchrecentquestions.")
    const response = await fetch("/getQuestionComments?quesid="+id);
    const commentsData = await response.json();
    // console.log(commentsData);
    return commentsData;
}
// console.log("Questions.js speaking, ");

function sendCommentToServer(){
    var questionID = getCookie("viewQuestionID");
    var comment = document.getElementById("commentText").value;
    let now = new Date();
	let time = now.getTime();
    // console.log("comment messege: ", comment);
    let headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": "secret"
    }
    let body = { // Let the server authenticate who the user is
        "QuestionID": questionID,
        "Comment": comment,
        "CommentTime": time
    }
    fetch("/sendComment", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body)
    }).then(response => response.json()).then(function(json){
        if (json.status==0){
            alert("You need to log in before making comments.");
            location.replace("/monopellogin")
        } else if (json.status==1) location.reload();
        else alert("An unexpected error occurred. Consider contacting staff.")
    }
    );
}

// CHATGPT
// // Add your OpenAI API key here
// const apiKey = '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';

// // Get references to DOM elements
// const responseTextDiv = document.getElementById('GPTResponseText');
// const userInputDiv = document.getElementById('main');

// // Function to display the response in the specified div
// function displayResponse(response) {
//     responseTextDiv.textContent = response;
// }

// // Function to get the user input from the main div and generate a response
// async function generateResponse() {
//     console.log("Generate Response");
//     const userMessage = userInputDiv.textContent;
    
//     // Send user message to GPT-3 and get the response
//     const response = await fetch('https://api.openai.com/v1/chat/completions', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${apiKey}`
//         },
//         body: JSON.stringify({
//             messages: [{ role: 'user', content: userMessage }],
//             model: 'gpt-3.5-turbo-16k' // Specify the model you want to use
//         })
//     });

//     const responseBody = await response.json();
//     console.log(responseBody);
//     const botMessage = responseBody.choices[0].message.content;
    
//     // Display the response in the designated div
//     displayResponse(botMessage);
// }


(async () => {
    var questionID = getCookie("viewQuestionID");
    fetchQuestionResult = await fetchQuestionByID(questionID);
    titleHTML = document.getElementById("title");
    mainBody = document.getElementById("main");

    titleHTML.innerHTML = fetchQuestionResult.Title;
    mainBody.innerHTML = fetchQuestionResult.Main;

    fetchCommentsResult = await fetchQuestionComments(questionID);
    cmntTable = document.getElementById("commentsTable");
    cmntTable.innerHTML = `
        <tr>
            <th></th>
            <th></th>
            <th></th>
        </tr>
    `;

    // console.log("HI");
    // try {
    //     await generateResponse(); // Wait for generateResponse to finish
    // } catch (error) {
    //     console.error("ChatGPT generateResponse: an error occurred:", error);
    // }
    for (let i=0; i<Math.min(10, fetchCommentsResult.length); i++){
        item = fetchCommentsResult[i];
        //console.log(item);
        cmntTable.innerHTML+= `
        <tr>
            <td>` + item.Messege + `</td>
            <td>` + neatDateFormat(item.PostTime) + `</td>
            <td>` + item.Username + `</td>
        </tr>
    `
    }
})()
