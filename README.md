## Rotating Card

This feature I used CSS Grid Layout to divide the page regions, so may only support browsers which are compatible with CSS Grid Layout.

To verify the functionality, can directly open the rotating-card/index.html in browser.

## Flickr Images

Because same-origin policy restriction and Flickr public api doesn't support CORS headers, so I created a simple JSONP lib to load the images from Flickr.

Images layout is a flex box.

To verify the functionality, can directly open the flickr-images/index.html in browser.

## Calculate draw date

lottery-draw/Calculator.php supports two ways to call:

1. CLI: php lottery-draw/Calculator.php "2018-2-7 2:00:10"
2. Class static method: Calculator::calculate('NOW');

Calculation logic:

1. If input date time is earlier than current time, ignore it and calculate from now.
2. If input time is earlier than Wednesday 20:00 of current week, it's the draw date.
3. Or if it is earlier than Friday 20:00 of current week, it's the draw date.
4. Or the draw date is Wednesday 20:00 of next week.