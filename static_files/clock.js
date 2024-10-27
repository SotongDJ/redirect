const month_arr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const day_arr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function fontAwe(fontKey,fontID="") {
  var fontI = document.createElement('i');
  fontI.className = fontKey;
  if (fontID) {fontI.id = fontID;};
  return fontI;
};

navigator.wakeLock||console.log("Screen Wake Lock API supported!");
let verbose = false;
let wakeLock = null;
async function wake(){
  if ("wakeLock" in navigator) {
    if (verbose){
      console.log("Screen Wake Lock API supported!");
    }
    try {
      wakeLock = await navigator.wakeLock.request("screen");
      if (verbose){
        console.log("Wake Lock is active!");
      }
    } catch (err) {
      if (verbose){
        console.log(`${err.name}, ${err.message}`);
      }
    }
  } else {
    if (verbose){
      console.log("Wake lock is not supported by this browser.");
    }
  }
}

// source: https://github.com/sensor-js/sensor-js.github.io/blob/master/demo.html
function handleOrientation(event) {
  updateFieldIfNotNull('Orientation_a', event.alpha);
  updateFieldIfNotNull('Orientation_b', event.beta);
  updateFieldIfNotNull('Orientation_g', event.gamma);
}

function updateFieldIfNotNull(fieldName, value, precision=1){
  if (value != null)
    document.getElementById(fieldName).innerHTML = value.toFixed(precision);
}

let is_running = false;
function orientationDetector() {
  if (
    DeviceMotionEvent &&
    typeof DeviceMotionEvent.requestPermission === "function"
  ) {
    DeviceMotionEvent.requestPermission();
  }
  
  if (is_running){
    window.removeEventListener("deviceorientation", handleOrientation);
    document.getElementById("orient").style.display = "none";
    is_running = false;
  }else{
    window.addEventListener("deviceorientation", handleOrientation);
    document.getElementById("orient").style.display = "block";
    is_running = true;
  }
};

function turnStatic() {
document.getElementById("bound").className = "center";
}
function turnMove() {
document.getElementById("bound").className = "bound";
}
function turnDay() {
document.querySelector("body").style = "background-color: white; color: black;";
document.getElementById("bound").style = "background-color: white; color: black;";
}
function turnNight() {
document.querySelector("body").style = "background-color: black; color: white;";
document.getElementById("bound").style = "background-color: black; color: white;";
}

navigator.getBattery||console.log("Battery API is not supported by this browser.");
function currentTime(precision=1) {
  let date_class = new Date();
  let hour_int = date_class.getHours();
  let min_int = date_class.getMinutes();
  let sec_int = date_class.getSeconds();

  let apm_str = (hour_int > 12) ? "PM" : "AM";

  let year_int = date_class.getFullYear();
  let month_str = month_arr[date_class.getMonth()];
  let day_int = date_class.getDate();
  let week_str = day_arr[date_class.getDay()];

  if (hour_int == 0) {
    hour_str = "12";
  }else if ( hour_int > 21) {
    hour_str = hour_int - 12;
  }else if ( hour_int > 12) {
    hour_str = "0" + (hour_int - 12);
  }else if ( hour_int < 10) {
    hour_str = "0" + hour_int;
  }else {
    hour_str = hour_int;
  };
  min_str = (min_int < 10) ? "0" + min_int : min_int;
  sec_str = (sec_int < 10) ? "0" + sec_int : sec_int;

  let time_str = hour_str + ":" + min_str + ":" + sec_str + " " + apm_str;
  let date_str = month_str + " " + day_int + ", " + year_int + " " + week_str;

  wake();
  document.getElementById("power").innerHTML = "";
  if (navigator.getBattery) {
    navigator.getBattery().then((battery) => {
      let batteryLevel = false;
      batteryLevel = battery.level;
      if (batteryLevel) {
        if (wakeLock.released) {
          document.getElementById("power").appendChild(fontAwe("fa-solid fa-mug-saucer fa-fw"));
          document.getElementById("power").append(" ");
        } else {
          document.getElementById("power").appendChild(fontAwe("fa-solid fa-mug-hot fa-fw"));
          document.getElementById("power").append(" ");
        }
        let battery_level = Math.round(batteryLevel*100).toFixed(precision);
        let battery_str = " " + battery_level + "% ";
        if (battery.charging) {
          document.getElementById("power").appendChild(fontAwe("fa-solid fa-plug-circle-bolt fa-fw"));
        } else if (battery_level == 100) {
          document.getElementById("power").appendChild(fontAwe("fa-solid fa-battery-full fa-fw"));
        } else if (battery_level >= 75) {
          document.getElementById("power").appendChild(fontAwe("fa-solid fa-battery-three-quarters fa-fw"));
        } else if (battery_level >= 50) {
          document.getElementById("power").appendChild(fontAwe("fa-solid fa-battery-half fa-fw"));
        } else if (battery_level >= 25) {
          document.getElementById("power").appendChild(fontAwe("fa-solid fa-battery-quarter fa-fw"));
        } else {
          document.getElementById("power").appendChild(fontAwe("fa-solid fa-battery-empty fa-fw"));
        };
        document.getElementById("power").append(battery_str);
        document.getElementById("power").append(" ");
      };
    });
  };

  let btnStatic = document.createElement("a");
  btnStatic.href = "javascript: void(turnStatic())";
  btnStatic.appendChild(fontAwe("fa-solid fa-thumbtack fa-fw"));
  document.getElementById("power").appendChild(btnStatic);
  document.getElementById("power").append(" ");

  let btnMove = document.createElement("a");
  btnMove.href = "javascript: void(turnMove())";
  btnMove.appendChild(fontAwe("fa-solid fa-shoe-prints fa-fw"));
  document.getElementById("power").appendChild(btnMove);
  document.getElementById("power").append(" ");

  let btnDay = document.createElement("a");
  btnDay.href = "javascript: void(turnDay())";
  btnDay.appendChild(fontAwe("fa-solid fa-sun fa-fw"));
  document.getElementById("power").appendChild(btnDay);
  document.getElementById("power").append(" ");

  let btnNight = document.createElement("a");
  btnNight.href = "javascript: void(turnNight())";
  btnNight.appendChild(fontAwe("fa-solid fa-moon fa-fw"));
  document.getElementById("power").appendChild(btnNight);
  document.getElementById("power").append(" ");

  let orient = document.createElement("a");
  orient.href = "javascript: void(orientationDetector())";
  if (is_running){
    orient.appendChild(fontAwe("fa-solid fa-pen-ruler fa-fw"));
  } else {
    orient.appendChild(fontAwe("fa-solid fa-ruler fa-fw"));
  }
  document.getElementById("power").appendChild(orient);

  document.getElementById("clock").innerText = time_str;
  document.getElementById("day").innerText = date_str;
  let t = setTimeout(function(){ currentTime() }, 1000);
}
