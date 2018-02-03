var cache = {
  dog: [],
  cow: [],
  giraffe: []
};
var url =
  "https://api.flickr.com/services/feeds/photos_public.gne?format=json&tags=";

/**
 * Create image element.
 *
 * @param {String} src
 * @param {String} alt
 * @param {String} title
 */
function createImage(src, alt, title) {
  var img = document.createElement("img");
  img.src = src;
  if (alt != null) img.alt = alt;
  if (title != null) img.title = title;
  return img;
}

/**
 * Find an image node inside a parent node.
 *
 * @param {Element} parent node
 * @return {Element} last image node
 */
function getLastImage(dom) {
  var node,
    nodes = dom.childNodes,
    i = nodes.length - 1;
  while ((node = nodes[i--])) {
    if (node.tagName.toLowerCase() === "img") {
      return node;
    }
  }
  return null;
}

/**
 * Append multiple images to page in one time for saving rendering overhead.
 *
 * @param {Array} collection of image url
 */
function appendImages(images, callback) {
  var content = document.getElementById("content");
  content.innerHTML = "";

  var fragment = document.createDocumentFragment();
  for (var key in images) {
    fragment.appendChild(createImage(images[key]));
  }

  if (callback) {
    getLastImage(fragment).onload = function() {
      callback();
    };
  }
  content.appendChild(fragment);
}

/**
 * Disable or enable all buttons
 *
 * @param {Boolean} state of if disabled
 */
function toggleButtons() {
  var buttons = document.getElementsByTagName("button");
  for (var key in buttons) {
    var button = buttons[key];
    button.disabled = !button.disabled;
  }
}

/**
 * Fetch images from flickr, render 5 images and cache the others for next click.
 *
 * @param {String} flickr api tag: cow, dog, giraffe
 */
function loadImages(tag) {
  toggleButtons();
  var imgs = cache[tag];
  if (imgs && imgs.length >= 5) {
    appendImages(imgs.splice(0, 5), toggleButtons);
  } else {
    jsonp(url + tag, function(error, data) {
      if (error) {
        content.innerHTML = error.message;
        toggleButtons();
      } else if (data) {
        var images = data.items;
        for (var key in images) {
          var image = images[key];
          imgs.push(image.media.m);
        }
        appendImages(imgs.splice(0, 5), toggleButtons);
      }
    });
  }
}
