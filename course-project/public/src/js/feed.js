var shareImageButton = document.querySelector('#share-image-button');
var createPostArea = document.querySelector('#create-post');
var closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');

function openCreatePostModal() {
  createPostArea.style.display = 'block';
  if(deferredPromt){
    deferredPromt.prompt();
    deferredPromt.userChoise.then(function(choiseResult){
      console.log(choiseResult.outcome);
      if(choiseResult.outcome==='dismissed'){
        console.log("User cancelled installation");
      }else{
        console.log("User added to home screen")
      }
    })
  }
}

function closeCreatePostModal() {
  createPostArea.style.display = 'none';
}

shareImageButton.addEventListener('click', openCreatePostModal);

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);
