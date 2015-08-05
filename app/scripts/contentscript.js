'use strict';

console.log('\'Allo \'Allo! Content script');

document.onmouseup = function(e) {detectDescription(e)};

function detectDescription(e){
  console.log(e);
  console.log(e.srcElement.parentElement.classList);
  var description = window.getSelection() || document.getSelection() || document.selection.createRange();
  var dtext = description.toString();
  if (e.srcElement.parentElement.classList[0] === "sweet-alert" || dtext.trim() == "" || dtext == null) {
  } else {
    taskCreation(dtext);
  }
}
function taskCreation(description){
  console.log(description);
  swal({
    title: "Create a task",
    text: "Desciption: " + description,
    type: "input",
    showCancelButton: true,
    closeOnConfirm: false,
    inputPlaceholder: "Name of Task",
    showLoaderOnConfirm: true
  },function(inputValue){
    console.log(description);
    if (inputValue === false) return false;
    if (inputValue === "") {
      swal.showInputError("You need to write a name!");
      return false;
    }
    createTask(inputValue, description)});
}

function createTask(name, description){
  setTimeout(function(){
    swal({
      title: "Task Created",
      text: "Name: " + name +  "\nDescription: " + description
    })
  }, 2000)
}

function jsActiveItemInList(_this, targetTag) {

  var target = event.target;
  if (!event.target)
    return 0;
  var i = 10;
  while (i--) {
    if (target == null)
      return 0;
    if (target.nodeName == targetTag)
      break;
    else
      target = target.parentElement;
  }
  var trList = event.currentTarget.getElementsByTagName(targetTag);
  var i = trList.length;
  while (i--) {
    trList[i].removeAttribute('active');
  }
}