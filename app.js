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


  $(document).on("click", "#add-train", function(){
    event.preventDefault();
    var name = $("#name-input").val().trim();
    var where = $("#where-input").val().trim();
    var time = $("#startTime-input").val().trim();
    
    var rate = $("#rate-input").val().trim();


    database.ref().push({
    name: name,
    where: where,
     time: time,
      rate: rate
    });

    document.getElementById("nTrain").reset();
  });

  // var now = moment().valueOf();
  // console.log(now);
  // var date = moment.unix(now).format("dddd, MMMM Do YYYY, h:mm:ss a");
  // console.log(date);
 
  function makeRow (response){
    next(response.time, response.rate);
      $("#changes").append(`<tr>
      <td>${response.name}</td>
      <td>${response.where}</td>
      <td>${response.rate}</td>
      <td>${nextT}</td>
      <td>${left}</td>
    </tr>`);
  }
 
  database.ref().on("child_added", function(childSnapshot) {
    var response = childSnapshot.val();
    makeRow(response);
  });

  function next(time, rate){
      console.log(time);
      console.log(rate);
      var r = parseInt(rate);
      var x = moment().format('HH:mm');
      var xMin = minutesOfDay(x);
      var tMin = minutesOfDay(time);
      console.log("xMin="+xMin);
      console.log("tMin="+tMin);
      if(xMin > tMin){
          var diff = xMin - tMin;
          var time = diff%rate;
          time = rate - time;
          xMin += time;
          left = time;
      }else{
          left = tMin-xMin;
          xMin = tMin;
      }
      nextT = toTime(xMin);
  }

  function minutesOfDay(m){
    var time = m.split(":");
    return parseInt(time[1]) + (parseInt(time[0]) * 60);
  }

  function toTime(min){
      if(min>1440){
          min-=1440;
      }
      var h = (min/60);
      h = Math.floor(h);
      var m = min%60;
      if(h<10){
          h = "0"+h;
      }
      if(m<10){
        m = "0"+m;
    }
      return h+":"+m;
  }