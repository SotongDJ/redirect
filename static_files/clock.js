const month_arr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const day_arr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function currentTime() {
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

 document.getElementById("clock").innerText = time_str; 
 document.getElementById("day").innerText = date_str;  
 let t = setTimeout(function(){ currentTime() }, 1000); 
}
