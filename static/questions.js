async function fetchRecentQuestions() {
    // console.log("inside fetchrecentquestions.")
    const response = await fetch("/getRecentQuestions");
    const recentQuestions = await response.json();
    // console.log(recentQuestions["0"]);
    return recentQuestions;
}
// console.log("Questions.js speaking, ");

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
            <td>` + item.AskTime + `</td>
            <td>` + item.Username + `</td>
        </tr>
    `
    }
})()


