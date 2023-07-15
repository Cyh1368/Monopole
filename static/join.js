function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}


// console.log("Questions.js speaking, ");
serverUsername = getCookie("clientUsername");
if (serverUsername=="undefined"){
    document.getElementById("userStatus").innerHTML = "<i>Logged Out</i>";
} else {
    document.getElementById("userStatus").innerHTML = serverUsername;
}
