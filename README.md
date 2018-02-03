## Rotating Card

This feature I used CSS Grid Layout to divide the page regions, so may only support browsers which are compatible with CSS Grid Layout.

Browser compatibility:

    IE: no
    Chrome >= 57
    Edge >= 16	
    Firefox >= 52
    Opera >= 44
    Safari >= 10.1

To verify the functionality, can directly open the rotating-card/index.html in browser.

## Flickr Images

Because same-origin policy restriction and Flickr public api doesn't support CORS headers, so I created a simple JSONP lib to load the images from Flickr.

Images layout is a flex box.

To verify the functionality, can directly open the flickr-images/index.html in browser.

## Calculate draw date

lottery-draw/Calculator.php supports two ways to call:

1. CLI:
    1. php lottery-draw/Calculator.php "2018-2-7 2:00:10"
    2. php lottery-draw/Calculator.php "2018-1-7 12:00:10" true
2. Class static method:
    1. Calculator::calculate('NOW');
    1. Calculator::calculate('2018-1-7 12:00:10', true);

Calculation logic:

1. Judge second parameter $includePast
    1. If true and input date time is earlier than current time, calculate based on now.
    2. Otherwise calculate based on first parameter date.
2. If input time is earlier than Wednesday 20:00 of current week, it's the draw date.
3. Otherwise if it is earlier than Friday 20:00 of current week, it's the draw date.
4. Otherwise the draw date is Wednesday 20:00 of next week.