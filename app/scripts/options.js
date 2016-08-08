var chromecast = document.getElementById('chromecast');
var background = document.getElementById('background');
var user = document.getElementById('user');
var password = document.getElementById('password');
var save = document.getElementById('save');
var reset = document.getElementById('reset');
var services = document.getElementById('services');
var selectedServices = document.getElementById('selected-services');


var backgroundVisibilty = function() {
  if(chromecast.checked) {
    background.parentElement.parentElement.style.visibility = 'hidden';
  } else {
    background.parentElement.parentElement.style.visibility = 'visible';
  }
}


var get = function() {
  chrome.storage.sync.get({
    chromecast: true,
    background: null,
    user: null,
    password: null
  }, function(data) {
    chromecast.checked = data.chromecast;
    background.value = data.background;
    user.value = data.user;
    password.value = data.password;
    backgroundVisibilty();
    console.log(data)
  })
}
get()


var set = function() {
  chrome.storage.sync.set({
    chromecast: chromecast.checked,
    background: background.value,
    user: user.value,
    password: password.value
  }, function() {
    get();
    if (chrome.runtime.lastError) console.log(chrome.runtime.lastError);
  })
}



chromecast.addEventListener('change', backgroundVisibilty)
save.addEventListener('click', set);
reset.addEventListener('click', function() {
  chrome.storage.sync.set({
    chromecast: true,
    background: null
  }, get)
})


services.addEventListener('change', function() {
  selected = []
  for (var n in services.options) {
    if(services.options[n].selected) {
      selected.push(services.options[n].value)
    }
  }
  console.log(selected)
  selectedServices.value = selected.join(', ')
})

selectedServices.addEventListener('focus', function() {
  services.style.display = 'initial';
  services.focus();
})
services.addEventListener('blur', function() {
  services.style.display = 'none';
})
services.addEventListener('focus', function() {
  services.style.display = 'initial';
})
