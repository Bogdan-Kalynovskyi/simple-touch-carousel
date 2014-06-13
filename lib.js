function $$ (str) {
    return document.getElementById(str);
}


function $ (str) {
    return document.querySelectorAll(str);
}


Element.prototype.hasClass = function (className) {
    if (document.documentElement.classList) {
        return this.classList.contains(className);
    } else {
        return new RegExp('(^|\\s)' + className + '(\\s|$)').test(this.className);
    }
};


Element.prototype.addClass = function (className) {
    if (!this.hasClass(className)) {
        if (document.documentElement.classList) {
            this.classList.add(className);
        } else {
            this.className += (this.className ? ' ' : '') + className;
        }
    }
};


Element.prototype.removeClass = function (className) {
    if (this.hasClass(className)) {
        if (document.documentElement.classList) {
            this.classList.remove(className);
        } else {
            this.className = this.className.replace(new RegExp('(^|\\s)*' + className + '(\\s|$)*', 'g'), '');
        }
    }
};


function transitionEndEventName () {
    var i,
        undefined,
        el = document.createElement('div'),
        transitions = {
            'transition':'transitionend',
            'OTransition':'otransitionend',
            'MozTransition':'transitionend',
            'WebkitTransition':'webkitTransitionEnd'
        };

    for (i in transitions) {
        if (transitions.hasOwnProperty(i) && el.style[i] !== undefined) {
            return transitions[i];
        }
    }
}

function swipe (element, callback){

    var direction,
        startX,
        startY,
        distX,
        distY,
        isLeft,
        isUp,
        threshold = 150,     //required min distance traveled to be considered swipe
        restraint = .7,     // maximum distance allowed at the same time in perpendicular direction
        allowedTime = 400,   // maximum time allowed to travel that distance
        elapsedTime,
        startTime;

    element.addEventListener('touchstart', function (e) {
        var touchobj = e.changedTouches[0];
        direction = 'none';
        startX = touchobj.pageX;
        startY = touchobj.pageY;
        startTime = Date.now();
    });

    element.addEventListener('touchend', function (e) {
        var touchobj = e.changedTouches[0];
        distX = touchobj.pageX - startX;
        distY = touchobj.pageY - startY;
        isLeft = distX < 0;
        isUp = distY < 0;
        distX = Math.abs(distX);
        distY = Math.abs(distY);
        elapsedTime = Date.now() - startTime;
        if (elapsedTime < allowedTime) {
            if (distX > distY) {
                if (distX > threshold && distY < distX * restraint) {
                    direction = isLeft ? 'left' : 'right';
                }
            }
            else {
                if (distY > threshold && distX < distY * restraint) {
                    direction = isUp ? 'up' : 'down';
                }
            }
        }
        if (direction) {
            callback(direction, Math.max(distX, distY) / elapsedTime);
        }
    });
}
