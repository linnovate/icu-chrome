var chromecast = document.getElementById('chromecast');
var background = document.getElementById('background-url');

var set = function() {
  console.log("chromecast: " + chromecast.checked)
  console.log('background: ', background.value)
  // chrome.storage.sync.set({'background-url': })
}

document.getElementById('save').addEventListener('click', set)

chromecast.addEventListener('change', function() {
  if(chromecast.checked) {
    background.parentElement.style.visibility = 'hidden';
  } else {
    background.parentElement.style.visibility = 'visible';
  }
})