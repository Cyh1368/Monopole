console.log("Home.js working!")
let biscuit = document.cookie;

function getCookie(cookieName) {
    let result = {};
    biscuit.split(';').forEach(function(el) {
      let [key,value] = el.split('=');
      result[key.trim()] = value;
    })
    return result[cookieName];
}


document.getElementById("username").innerHTML = "Seems like you are "+getCookie("username") + "!";