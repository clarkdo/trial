function flip() {
  var front = document.getElementById("front");
  var back = document.getElementById("back");
  toggleFlip(front);
  toggleFlip(back);
}

function toggleFlip(element) {
  var classes = element.className.split(" ");
  var i = classes.indexOf("flip");
  if (i >= 0) {
    classes.splice(i, 1);
  } else {
    classes.push("flip");
  }
  element.className = classes.join(" ");
}
