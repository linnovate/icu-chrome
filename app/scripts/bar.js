var toggle = document.getElementById('toggle-left-bar');
var bar = document.getElementById('left-bar');

toggle.onclick = function() {
  bar.className = bar.className ? '': 'open';
}
