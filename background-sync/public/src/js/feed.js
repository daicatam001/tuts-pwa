var shareImageButton = document.querySelector("#share-image-button");
var createPostArea = document.querySelector("#create-post");
var closeCreatePostModalButton = document.querySelector(
  "#close-create-post-modal-btn"
);
var sharedMomentsArea = document.querySelector("#shared-moments");
var form = document.querySelector("form");
var titleInput = document.querySelector("#title");
var locationInput = document.querySelector("#location");
function onSaveButtonClicked(event) {
  console.log("clicked");
  if ("caches" in window) {
    caches.open("user-requested").then(function (cache) {
      cache.add("https://httpbin.org/get");
      cache.add("/src/images/sf-boat.jpg");
    });
  }
}

function openCreatePostModal() {
  createPostArea.style.display = "block";
  if (deferredPrompt) {
    deferredPrompt.prompt();

    deferredPrompt.userChoice.then(function (choiceResult) {
      console.log(choiceResult.outcome);

      if (choiceResult.outcome === "dismissed") {
        console.log("User cancelled installation");
      } else {
        console.log("User added to home screen");
      }
    });

    deferredPrompt = null;
  }
}

function closeCreatePostModal() {
  createPostArea.style.display = "none";
}

shareImageButton.addEventListener("click", openCreatePostModal);

closeCreatePostModalButton.addEventListener("click", closeCreatePostModal);

function clearCards() {
  while (sharedMomentsArea.hasChildNodes()) {
    sharedMomentsArea.removeChild(sharedMomentsArea.lastChild);
  }
}

function createCard(data) {
  var cardWrapper = document.createElement("div");
  cardWrapper.className = "shared-moment-card mdl-card mdl-shadow--2dp";
  var cardTitle = document.createElement("div");
  cardTitle.className = "mdl-card__title";
  cardTitle.style.backgroundImage = 'url("' + data.image + '")';
  cardTitle.style.backgroundSize = "cover";
  cardTitle.style.height = "180px";
  cardWrapper.appendChild(cardTitle);
  var cardTitleTextElement = document.createElement("h2");
  cardTitleTextElement.style.color = "black";
  cardTitleTextElement.className = "mdl-card__title-text";
  cardTitleTextElement.textContent = data.title;
  cardTitle.appendChild(cardTitleTextElement);
  var cardSupportingText = document.createElement("div");
  cardSupportingText.className = "mdl-card__supporting-text";
  cardSupportingText.textContent = data.location;
  cardSupportingText.style.textAlign = "center";
  // var cardSaveButton = document.createElement("button");
  // cardSaveButton.innerHTML = "Save";
  // cardSaveButton.addEventListener('click',onSaveButtonClicked)
  // cardSupportingText.appendChild(cardSaveButton);
  cardWrapper.appendChild(cardSupportingText);
  componentHandler.upgradeElement(cardWrapper);
  sharedMomentsArea.appendChild(cardWrapper);
}

function updateUI(data) {
  clearCards();
  data.forEach((element) => {
    createCard(element);
  });
}

var url = "https://pwagram-6f96d-default-rtdb.firebaseio.com/posts.json";
var networkDataReceived = false;

fetch(url)
  .then(function (res) {
    return res.json();
  })
  .then(function (data) {
    networkDataReceived = true;
    console.log("data from fetch", data);

    updateUI(Object.values(data));
  });

if ("indexedDB" in window) {
  readAllData("posts").then(function (data) {
    console.log("data from caches", data);
    if (!networkDataReceived && data) {
      updateUI(Object.values(data));
    }
  });
}

function sendData() {
  fetch("https://pwagram-6f96d-default-rtdb.firebaseio.com/posts.json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      id: new Date().toISOString(),
      title: titleInput.value,
      location: locationInput.value,
    }),
  }).then(function () {
    console.log("Send data", data);
    updateUI();
  });
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  if (!titleInput.value.trim() && !locationInput.value.trim()) {
    return;
  }
  closeCreatePostModal();
  if ("serviceWorker" in navigator && "SyncManager" in window) {
    navigator.serviceWorker.ready.then(function (sw) {
      var post = {
        id: new Date().toISOString(),
        title: titleInput.value,
        location: locationInput.value,
      };
      writeData("sync-posts", post)
        .then(function () {
          return sw.sync.register("sync-new-posts");
        })
        .then(function () {
          var snackbarContainer = document.querySelector("#confirmation-toast");
          var data = { message: "Your Post was save for syncing" };
          snackbarContainer.MaterialSnackbar.showSnackbar(data);
        })
        .catch(function (e) {
          console.log(e);
        });
    });
  } else {
    sendData()
  }
});
