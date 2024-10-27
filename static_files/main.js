// uglifyjs go.js -o docs/go.js -c -m 
// reference: 
//     https://stackoverflow.com/questions/4974238/javascript-equivalent-of-pythons-format-function/4974690#4974690
String.prototype.format = function () {
var i = 0, args = arguments;
return this.replace(/{}/g, function () {return typeof args[i] != 'undefined' ? args[i++] : '';});
};
//
var shortDict = {};
for (const targetKey in reverseShortDict) {
for (const langKey in reverseShortDict[targetKey]) {
for (const shortKey of reverseShortDict[targetKey][langKey]) {
shortDict[shortKey] = {"lang":langKey,"key":targetKey};
}
}
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
"locationLink":{"en":"If redirection fails, please click this","hant":"🔗 若重新導向目標失敗，請點擊前往"},
"content-start":{"en":"Redirect to target location: (after {})<br>{}","hant":"重新導向到目標：（{}後）<br>【{}】"},
"content-end":{"en":"Redirect to target location:<br>{}","hant":"重新導向到目標：<br>【{}】"}
}
//
url = window.location.href;
var parameter = "";
if ((!url.includes("?"))||url.split("?").length<2) {
parameter = "";
} else {
parameter = url.split("?")[1].toUpperCase();
};
//
function myFunction(target) {
window.location.href = target;
};
//
if (Object.keys(shortDict).includes(parameter)) {
langStr = shortDict[parameter]["lang"]
targetKey = shortDict[parameter]["key"]
document.getElementById("title").innerText = "Go to: {}".format(jumpDict[targetKey][langStr]);
document.getElementById("locationLink").innerHTML = infoDict["locationLink"][langStr];
document.getElementById("locationLink").href = jumpDict[targetKey]['url'];
var left = 3;
var downloadTimer = setInterval(function(){
if(left <= 0){
clearInterval(downloadTimer);
document.getElementById("content").innerHTML = infoDict["content-end"][langStr].format(jumpDict[targetKey][langStr]);
myFunction(jumpDict[targetKey]['url']);
} else {
document.getElementById("content").innerHTML = infoDict["content-start"][langStr].format(countdownDict[left][langStr],jumpDict[targetKey][langStr]);
};
left -= 1;
}, 1000);
};
