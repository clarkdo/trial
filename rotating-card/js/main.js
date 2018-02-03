function flip() {
  toggleFlip(document.getElementById("front"));
  toggleFlip(document.getElementById("back"));
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
