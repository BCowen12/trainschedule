// Initialize Firebase
var config = {
  apiKey: "AIzaSyAn1KQVBgOa6xah8VvjlX3Kq7D0F82d26A",
  authDomain: "trains-90cd7.firebaseapp.com",
  databaseURL: "https://trains-90cd7.firebaseio.com",
  projectId: "trains-90cd7",
  storageBucket: "",
  messagingSenderId: "720584408676"
};
firebase.initializeApp(config);

var database = firebase.database();

var nextT;
var left;

//When clicked add train info
$(document).on("click", "#add-train", function() {
  event.preventDefault();
  var name = $("#name-input")
    .val()
    .trim();
  var where = $("#where-input")
    .val()
    .trim();
  var time = $("#startTime-input")
    .val()
    .trim();
  var rate = $("#rate-input")
    .val()
    .trim();

  database.ref().push({
    name: name,
    where: where,
    time: time,
    rate: rate
  });

  document.getElementById("nTrain").reset();
});

function makeRow(response) {
  next(response.time, response.rate);
  $("#changes").append(`<tr>
      <td>${response.name}</td>
      <td>${response.where}</td>
      <td>${response.rate}</td>
      <td>${moment(nextT).format("HH:mm")}</td>
      <td>${left}</td>
    </tr>`);
}

database.ref().on("child_added", function(childSnapshot) {
  var response = childSnapshot.val();
  makeRow(response);
});

function next(time, rate) {
  var startTime = moment(time, "HH:mm");
  var now = moment();

  if (now.isBefore(startTime)) {
    nextT = startTime;
  } else {
    var diff = startTime.diff(now, "minutes");
    left = parseInt(rate) + (diff % rate);
    nextT = now.add(left, "minutes");
  }
}
