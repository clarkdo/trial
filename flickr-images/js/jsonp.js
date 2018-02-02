var callbackName = "jsonFlickrFeed";

/**
 * Due to same-origin policy restrictions, use jsonp to load images.
 *
 * @param {String} url of flickr images
 * @param {Function} callback function when data fetched or error occurred
 */
function jsonp(url, callback) {
  var script = document.createElement("script");

  function cleanup() {
    if (script.parentNode) script.parentNode.removeChild(script);
    window[callbackName] = empty;
  }

  function cancel() {
    if (window[callbackName]) {
      cleanup();
    }
  }

  window[callbackName] = function(data) {
    cleanup();
    if (callback) callback(null, data);
  };

  // create script
  script.src = url;
  document.head.appendChild(script);

  return cancel;
}

function empty() {}
