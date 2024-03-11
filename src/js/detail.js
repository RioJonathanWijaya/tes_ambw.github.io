var urlGym = new URLSearchParams(window.location.search);
var idWorkout = urlGym.get('gym');
console.log(idWorkout);

var image = document.querySelector('#image');
var title = document.querySelector('#title');
var description = document.querySelector('#description');
var equipment = document.querySelector('#equipment');

var networkDataReceived = false;

var url = "https://gymhub-ac3b2-default-rtdb.asia-southeast1.firebasedatabase.app/gym/" +idWorkout +".json";

// while online put data to session storage then when offline check if the data is already in the session storage then load it if not go to offline.html
if(!sessionStorage.getItem(idWorkout)){
    fetch(url)
        .then(function(res){
            return res.json();
  })
        .then(function(data) {
            networkDataReceived = true;
            console.log('From web', data);
            image.src = data.image;
            title.textContent = data.title;
            description.textContent = data.desc;
            equipment.textContent = data.equipment;
            sessionStorage.setItem(data.id,JSON.stringify(data));
            console.log(sessionStorage.getItem(idWorkout));
  })
        .catch(function (err) {
            console.log(err);
            window.location.href = "offline.html";
  });
}else{
  var data = JSON.parse(sessionStorage.getItem(idWorkout));    
  console.log(data);  
  image.src = data.image;
  title.textContent = data.title;
    description.textContent = data.desc;
    equipment.textContent = data.equipment;
}



