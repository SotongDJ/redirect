// uglifyjs go.js -o docs/go.js -c -m 
// reference: 
//     https://stackoverflow.com/questions/4974238/javascript-equivalent-of-pythons-format-function/4974690#4974690
String.prototype.format = function () {
var i = 0, args = arguments;
return this.replace(/{}/g, function () {return typeof args[i] != 'undefined' ? args[i++] : '';});
};
//
let countdownDict = {
1:{"en":"1s","hant":"一秒"},
2:{"en":"2s","hant":"兩秒"},
3:{"en":"3s","hant":"三秒"},
4:{"en":"4s","hant":"四秒"},
5:{"en":"5s","hant":"五秒"},
}
let infoDict = {
"content-start":{"en":"Redirect to target location: (after {})","hant":"重新導向到目標：（{}後）"},
"content-end":{"en":"Redirect to target location:","hant":"重新導向到目標："},
}
function myFunction(target) {
window.location.href = target;
};
//
var left = 3;
var downloadTimer = setInterval(function(){
if(left <= 0){
clearInterval(downloadTimer);
document.getElementById("enRemind")&&(document.getElementById("enRemind").innerHTML = infoDict["content-end"]["en"]);
document.getElementById("hantRemind")&&(document.getElementById("hantRemind").innerHTML = infoDict["content-end"]["hant"]);
document.getElementById("locationLink")&&myFunction(document.getElementById("locationLink").href);
} else {
document.getElementById("enRemind")&&(document.getElementById("enRemind").innerHTML = infoDict["content-start"]["en"].format(countdownDict[left]["en"]));
document.getElementById("hantRemind")&&(document.getElementById("hantRemind").innerHTML = infoDict["content-start"]["hant"].format(countdownDict[left]["hant"]));
};
left -= 1;
}, 1000);
