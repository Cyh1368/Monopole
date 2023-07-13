function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function neatDateFormat(utc){
    let d = new Date(utc);
    var options = {weekday: 'short', year: 'numeric', month: 'numeric', day: 'numeric', hour: "2-digit", minute: "2-digit"};

    return d.toLocaleDateString("en-US", options);
}

async function fetchRecentQuestions() {
    // console.log("inside fetchrecentquestions.")
    const response = await fetch("/getRecentQuestions");
    const recentQuestions = await response.json();
    // console.log(recentQuestions["0"]);
    return recentQuestions;
}

// console.log("Questions.js speaking, ");
serverUsername = getCookie("clientUsername");
if (serverUsername=="undefined"){
    document.getElementById("userStatus").innerHTML = "<i>Logged Out</i>";
} else {
    document.getElementById("userStatus").innerHTML = serverUsername;
}

(async () => {
    fetchResult = await fetchRecentQuestions();
    quesTable = document.getElementById("questions");
    quesTable.innerHTML = `
        <tr>
            <th>Question</th>
            <th>Ask Time</th>
            <th>Asked By</th>
        </tr>
    `;

    for (let i=0; i<10; i++){
        item = fetchResult[i];
        console.log(item);
        quesTable.innerHTML+= `
        <tr>
            <td><a href="` + `/viewQuestion?quesid=` + item.QuestionID + `">` +  item.Title + `</a></td>
            <td>` + neatDateFormat(item.AskTime) + `</td>
            <td>` + item.Username + `</td>
        </tr>
    `
    }
})()


