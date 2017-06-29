$(document).ready(function() {
  var dateTime = new Date();
  var time = dateTime.getHours();

  if(time >= 19 && time <= 24) {
    $('body').addClass("bg-night");
  }
  else if(time > 12 && time < 19) {
    $('body').addClass("bg-day");
  }
  else {
    $('body').addClass("bg-morning");
  }
});
