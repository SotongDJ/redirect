if (parameter=="") {
// document.getElementById("title").innerText = "E-ink clock";
document.getElementById("content").style['display'] = "none";
document.getElementById("bar").style.display = "none";
document.getElementById("bound").className = "center";
document.getElementById("bound").style = "background-color: white; color: black;";
document.querySelector("body").style = "background-color: white; color: black;";
currentTime();
};