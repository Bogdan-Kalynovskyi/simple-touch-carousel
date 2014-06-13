/**
 * Carousel class constructor arguments
 *
 * scrollArea - container for all the images that are scrolling
 * upBtn - up button
 * downBtn - button button
 **/

var Carousel = function (scrollArea, minusBtn, plusBtn) {

    var elements = scrollArea.children,
        elementWidth = elements[0].offsetWidth,
        containerWidth = scrollArea.offsetWidth,
        scroll = 0,
        totalScroll = 0,
        visible = Math.floor(containerWidth / elementWidth),
        length = elements.length,
        overflow = Math.floor((length - visible) / 2),

        isAnimating = false,
        transitionend = transitionEndEventName(),
        isTouchStarted = false,
        touchStartX;


    function realIndex (index) {
        index += scroll;
        if (index >= length - overflow) {
            index -= length;
        }
        if (index >= length - overflow) {
            index -= length;
        }
        return index;
    }


    function isVisible (index, step) {
        index = realIndex(index);
        if (step > 0) {
            return index >= 0 && index < visible + step;
        } else if (step < 0) {
            return index >= step && index < visible;
        } else {
            return index >= -1 && index < visible + 1;
        }
    }


    /* direction: up: -1, down: 1 */
    function animate (step) {
        var element,
            style,
            pos,
            isEventSet;

        if (Math.abs(totalScroll + step) > overflow) {
            step = 0;
        }

//        if (isAnimating) {
//            return;
//        }

        isAnimating = true;
        totalScroll += step;

        scroll += step;
        if (scroll < 0) {
            scroll += length;
        }
        else if (scroll >= length) {
            scroll -= length;
        }

        for (var i = 0; i < length; i++) {
            pos = realIndex(i);
            element = elements[i];
            style = element.style;
            if (isVisible(i, step)) {
                style.webkitTransition = style.transition = '';
                style.webkitTransform = style.transform = 'translate3d(' + pos * elementWidth + 'px, 0, 0)';
                if (!isEventSet) {
                    isEventSet = true;
                    element.addEventListener(transitionend, afterAnimate);
                }
            }
            else if (step) {
                style.webkitTransition = style.transition = 'none';
                style.webkitTransform = style.transform = 'translate3d(' + (pos * elementWidth) + 'px, 0, 0)';
            }
        }
    }


    function afterAnimate () {
        this.removeEventListener(transitionend, afterAnimate);

        isAnimating = false;
        totalScroll = 0;
    }


    function moveAll (distance) {
        var element,
            style,
            pos,
            step,
            step1;

        step = distance / elementWidth;
        step1 = step > 0 ? -Math.ceil(step) : -Math.floor(step);
        step = step > 0 ? Math.floor(step) : Math.ceil(step);

        if (step) {
            distance -= step * elementWidth;
            touchStartX += step * elementWidth;

            scroll += step;
            if (scroll < 0) {
                scroll += length;
            }
            else if (scroll >= length) {
                scroll -= length;
            }
        }

        for (var i = 0; i < length; i++) {
            pos = realIndex(i);
            element = elements[i];
            style = element.style;
            if (isVisible(i, step1)) {
                style.webkitTransform = style.transform = 'translate3d(' + (pos * elementWidth + distance) + 'px, 0, 0)';
            }
            else if (step) {
                style.webkitTransform = style.transform = 'translate3d(' + (pos * elementWidth) + 'px, 0, 0)';
            }
        }
    }


    function init () {
        var element,
            style,
            pos;

        for (var i = 0; i < length; i++) {
            pos = realIndex(i);
            element = elements[i];
            style = element.style;
            style.webkitTransition = style.transition = 'none';
            style.webkitTransform = style.transform = 'translate3d(' + (pos * elementWidth) + 'px, 0, 0)';
        }
    }


    minusBtn.addEventListener('click', animate.bind(this, -1));
    plusBtn.addEventListener('click', animate.bind(this, 1));


    swipe(scrollArea, function (direction, velocity) {
        velocity = Math.floor(velocity);
        if (direction === 'left') {
            animate(-velocity);
        } else if (direction === 'right') {
            animate(velocity);
        }
    });


    function onTouchStart (e) {
        isTouchStarted = true;
        touchStartX = e.changedTouches[0].pageX;
        for (var i = 0; i < length; i++) {
            var style = elements[i].style;
            style.webkitTransition = style.transition = 'none';
        }
    }


    scrollArea.addEventListener('touchstart', function (e) {
        if (!isAnimating) {
            onTouchStart(e);
        }
    });

    scrollArea.addEventListener('touchmove', function (e) {
        if (isTouchStarted) {
            var touchX = e.changedTouches[0].pageX;
            moveAll(touchX - touchStartX);
        } else {
            onTouchStart(e);
        }
    });

    scrollArea.addEventListener('touchend', function (e) {
        isTouchStarted = false;
        touchStartX -= e.changedTouches[0].pageX;
        animate( -Math.round(touchStartX / elementWidth) );
    });


    init();
};


/* start on DOM creation */

document.addEventListener('DOMContentLoaded', function() {
    new Carousel(
        document.getElementById('carousel-scroll'),
        document.getElementById('carousel-up'),
        document.getElementById('carousel-down')
    );
});