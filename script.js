/**
 * Carousel class constructor arguments
 *
 * scrollArea - container for all the images that are scrolling
 * upBtn - up button
 * downBtn - button button
 **/

var Carousel = function (scrollArea, upBtn, downBtn) {

    var elements = scrollArea.children,
        index = 0,
        length = elements.length,
        scrollAreaHeight = scrollArea.offsetHeight,
        elementHeight = scrollAreaHeight / length,
        touchStartY,
        touchStartDelta;


    /* direction: up: -1, down: 1 */
    function animate (direction) {
        var lastIndex = index;

        if (index + direction < 0) {
            index = 0;
        } else if (index + direction >= length) {
            index = length - 1;
        } else {
            index += direction;
        }

        if (lastIndex !== index) {
            if (lastIndex === 0) {
                upBtn.removeClass('disabled');
            }
            else if (lastIndex === length - 1) {
                downBtn.removeClass('disabled');
            }
        }
        if (index === 0) {
            upBtn.addClass('disabled');
        }
        if (index === length - 1) {
            downBtn.addClass('disabled');
        }

        scrollArea.style.top = -index * elementHeight + 'px';
    }


    upBtn.addEventListener('click', animate.bind(this, -1));
    downBtn.addEventListener('click', animate.bind(this, 1));

    scrollArea.addEventListener('touchstart', function (e) {
        touchStartY = e.changedTouches[0].pageY;
        touchStartDelta = touchStartY + index * elementHeight;
        scrollArea.style.transition = scrollArea.style.webkitTransition = 'none';
    });

    scrollArea.addEventListener('touchmove', function (e) {
        var touchY = e.changedTouches[0].pageY;
        scrollArea.style.top = touchY - touchStartDelta + 'px';
    });

    scrollArea.addEventListener('touchend', function (e) {
        var touchDeltaY = touchStartY - e.changedTouches[0].pageY;
        scrollArea.style.transition = scrollArea.style.webkitTransition = '';
        animate( Math.round(1.2 * touchDeltaY / elementHeight) );
    });

    /* initial animate sets the carousel up */
    animate(0);
};


/* start on DOM creation */

document.addEventListener('DOMContentLoaded', function() {
    new Carousel(document.getElementById('carousel-scroll'), document.getElementById('carousel-up'), document.getElementById('carousel-down'));
});