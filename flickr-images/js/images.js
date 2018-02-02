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
 * Append multiple images to page in one time for saving rendering overhead.
 *
 * @param {Array} collection of image url
 */
function appendImages(images) {
  var content = document.getElementById("content");
  content.innerHTML = "";

  var fragment = document.createDocumentFragment();
  for (var key in images) {
    fragment.appendChild(createImage(images[key]));
  }
  content.appendChild(fragment);
}

/**
 * Disable or enable all buttons
 *
 * @param {Boolean} state of if disabled
 */
function toggleButtons(disabled) {
  var buttons = document.getElementsByTagName("button");
  for (var key in buttons) {
    buttons[key].disabled = disabled;
  }
}

/**
 * Fetch images from flickr, render 5 images and cache the others for next click.
 *
 * @param {String} flickr api tag: cow, dog, giraffe
 */
function loadImages(tag) {
  var imgs = cache[tag];
  if (imgs && imgs.length >= 5) {
    appendImages(imgs.splice(0, 5));
  } else {
    toggleButtons(true);
    jsonp(url + tag, function(error, data) {
      if (error) {
        content.innerHTML = error.message;
      } else if (data) {
        var images = data.items;
        for (var key in images) {
          var image = images[key];
          imgs.push(image.media.m);
        }
        appendImages(imgs.splice(0, 5));
      }
      toggleButtons(false);
    });
  }
}
