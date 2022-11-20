var deferredPromt;

if ('serviceWorker' in navigator){
    navigator.serviceWorker.register('/sw.js',{scope:'/'}).then(function(){
        console.log('serviceWorker has registered!');
    })
} 

window.addEventListener('beforeinstallprompt',function(event){
    console.log('beforeinstallprompt fired',event);
    event.preventDefault()
    deferredPromt = event
})