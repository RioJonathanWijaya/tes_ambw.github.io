var shareImageButton = document.querySelector('#share-image-button');
var closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
var cardArea = document.querySelector('#card-area');

function openCreatePostModal() {
  createPostArea.style.display = 'block';
  if (deferredPrompt) {
    deferredPrompt.prompt();

    deferredPrompt.userChoice.then(function(choiceResult) {
      console.log(choiceResult.outcome);

      if (choiceResult.outcome === 'dismissed') {
        console.log('User cancelled installation');
      } else {
        console.log('User added to home screen');
      }
    });

    deferredPrompt = null;
  }

  // if ('serviceWorker' in navigator) {
  //   navigator.serviceWorker.getRegistrations()
  //     .then(function(registrations) {
  //       for (var i = 0; i < registrations.length; i++) {
  //         registrations[i].unregister();
  //       }
  //     })
  // }
}

function closeCreatePostModal() {
  createPostArea.style.display = 'none';
}


// Currently not in use, allows to save assets in cache on demand otherwise
function onSaveButtonClicked(event) {
  console.log('clicked');
  if ('caches' in window) {
    caches.open('user-requested')
      .then(function(cache) {
        cache.add('https://httpbin.org/get');
        cache.add('/src/images/sf-boat.jpg');
      });
  }
}

function clearCards() {
  while(cardArea.hasChildNodes()) {
    cardArea.removeChild(cardArea.lastChild);
  }
}

function createCard(data, index) {
  var cardWrapper = document.createElement('div');
  cardWrapper.className = 'max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-8 hover:scale-[1.05] ease-in duration-200';
  var imageBody = document.createElement('a');
  imageBody.href = 'detail.html?gym=' +data.id;
  var cardImage = document.createElement('img');
  cardImage.className = 'rounded-t-lg';
  cardImage.src = data.image;
  imageBody.append(cardImage);
  cardWrapper.appendChild(imageBody);
  var cardBody = document.createElement('div');
  cardBody.className = 'p-5';
  cardWrapper.appendChild(cardBody);
  var cardTitle = document.createElement('h5');
  cardTitle.className = 'mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white';
  cardTitle.textContent = data.title;
  var cardDesc = document.createElement('p');
  cardDesc.className = 'mb-3 font-normal text-gray-700 dark:text-gray-400';
  cardDesc.textContent = data.desc;
  var cardButton =  document.createElement('a');
  cardButton.href = 'detail.html?gym=' + data.id;
  cardButton.className = 'inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800';
  cardButton.textContent = "Read More";
  cardBody.appendChild(cardTitle);
  cardBody.appendChild(cardDesc);
  cardBody.appendChild(cardButton);
  cardArea.appendChild(cardWrapper);
}

function updateUI(data) {
  clearCards();
  for (var i = 0; i < data.length; i++) {
    createCard(data[i],i);
  }
}

var url = 'https://gymhub-ac3b2-default-rtdb.asia-southeast1.firebasedatabase.app/gym.json';
var networkDataReceived = false;

fetch(url)
  .then(function(res) {
    return res.json();
  })
  .then(function(data) {
    networkDataReceived = true;
    console.log('From web', data);
    var dataArray = [];
    for (var key in data) {
      dataArray.push(data[key]);
    }
    updateUI(dataArray);
  });

if ('indexedDB' in window) {
  readAllData('gym')
    .then(function(data) {
      if (!networkDataReceived) {
        console.log('From cache', data);
        updateUI(data);
      }
    });
}
