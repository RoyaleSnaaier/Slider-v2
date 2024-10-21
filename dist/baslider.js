/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/*!*************************!*\
  !*** ./src/js/index.ts ***!
  \*************************/

(function () {
    var initializeSlider = function (container, settings) {
        if (settings === void 0) { settings = {}; }
        if (container.dataset.initSlider) {
            return;
        }
        container.dataset.initSlider = "1";
        var beforeImage = container.querySelector('img[data-image="1"]');
        var afterImage = container.querySelector('img[data-image="2"]');
        var labels = container.querySelector('.acbaslider__labels');
        var beforeLabel = null;
        var afterLabel = null;
        var floatingLabelsEnabled = container.dataset.floatingLabels === 'true';
        if (floatingLabelsEnabled) {
            beforeLabel = document.createElement('span');
            beforeLabel.className = 'acbaslider__floating-label --before';
            beforeLabel.innerText = 'Before';
            container.appendChild(beforeLabel);
            afterLabel = document.createElement('span');
            afterLabel.className = 'acbaslider__floating-label --after';
            afterLabel.innerText = 'After';
            container.appendChild(afterLabel);
        }
        var config = Object.assign({
            step: parseInt(container.dataset.step) || 5,
            startPosition: parseInt(container.dataset.startingposition) || 50,
            mouseFollow: container.dataset.mousefollow === 'true',
            clickPosition: container.dataset.clickposition === 'true',
            autoSlide: container.dataset.autoslide === 'true',
            slideSpeed: parseInt(container.dataset.slidespeed) || 3000
        }, settings);
        if (labels) {
            labels.style.display = 'none';
        }
        if (!beforeImage || !afterImage)
            return;
        var setResponsiveSize = function () {
            if (!beforeImage.naturalWidth || !beforeImage.naturalHeight) {
                console.log("Images are not fully loaded yet.");
                return;
            }
            var aspectRatio = beforeImage.naturalHeight / beforeImage.naturalWidth;
            var containerWidth = container.clientWidth || beforeImage.naturalWidth;
            var height = containerWidth * aspectRatio;
            container.style.height = "".concat(height, "px");
        };
        var initializeResponsiveSize = function () {
            setResponsiveSize();
            window.addEventListener('resize', setResponsiveSize);
        };
        initializeResponsiveSize();
        // Set initial styles for the container if u want to have it dynamic :) (remove the box-radius and box-shadow from the scss!)
        // container.style.borderRadius = '15px';
        // container.style.boxShadow = '0px 8px 20px rgba(0, 0, 0, 0.2)';
        afterImage.style.clipPath = "inset(0 ".concat(100 - config.startPosition, "% 0 0)");
        var slider = document.createElement('div');
        slider.className = 'acbaslider__divider';
        var handle = document.createElement('div');
        handle.className = 'acbaslider__divider__handle';
        slider.appendChild(handle);
        container.appendChild(slider);
        slider.style.left = "".concat(config.startPosition, "%");
        var isDragging = false;
        var autoSlideInterval;
        // Existing function to update slider position
        var updateSliderPosition = (function () {
            var lastFrame = 0;
            return function (percentage, smooth, isClick) {
                if (smooth === void 0) { smooth = false; }
                if (isClick === void 0) { isClick = false; }
                var now = performance.now();
                if (now - lastFrame < 16)
                    return;
                lastFrame = now;
                var clickTransitionDuration = '0.3s ease';
                var defaultTransitionDuration = '0.05s ease';
                var sliderTransition = smooth
                    ? (isClick ? clickTransitionDuration : defaultTransitionDuration)
                    : 'none';
                var labelTransition = smooth ? '0.07s ease' : 'none';
                var afterImageClipValue = 100 - percentage;
                var beforeLabelOffset = "calc(".concat(percentage, "% - 15%)");
                var afterLabelOffset = "calc(".concat(percentage, "% + 5%)");
                slider.style.transition = sliderTransition;
                afterImage.style.transition = sliderTransition;
                slider.style.left = "".concat(percentage, "%");
                afterImage.style.clipPath = "inset(0 ".concat(afterImageClipValue, "% 0 0)");
                if (floatingLabelsEnabled) {
                    beforeLabel.style.transition = labelTransition;
                    afterLabel.style.transition = labelTransition;
                    beforeLabel.style.left = beforeLabelOffset;
                    afterLabel.style.left = afterLabelOffset;
                }
            };
        })();
        // Ensure floating labels update on slider load
        updateSliderPosition(config.startPosition);
        var onMouseMove = function (e) {
            if (isDragging || config.mouseFollow) {
                var rect = container.getBoundingClientRect();
                var offsetX = e.clientX - rect.left;
                offsetX = Math.max(0, Math.min(offsetX, rect.width));
                var percentage = (offsetX / rect.width) * 100;
                updateSliderPosition(percentage, true);
            }
        };
        var stopDragging = function () {
            isDragging = false;
            slider.style.transition = 'none';
            afterImage.style.transition = 'none';
        };
        slider.addEventListener('mousedown', function () {
            isDragging = true;
            slider.style.transition = 'none';
            afterImage.style.transition = 'none';
        });
        container.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', stopDragging);
        if (config.clickPosition) {
            container.addEventListener('click', function (e) {
                var rect = container.getBoundingClientRect();
                var offsetX = e.clientX - rect.left;
                var percentage = (offsetX / rect.width) * 100;
                updateSliderPosition(percentage, true, true);
            });
        }
        // Automatic sliding feature
        var startAutoSlide = function () {
            var position = config.startPosition;
            var direction = 1;
            var updateDirection = function () {
                if (position >= 100) {
                    direction = -1;
                }
                else if (position <= 0) {
                    direction = 1;
                }
            };
            autoSlideInterval = setInterval(function () {
                position += config.step * direction;
                updateDirection();
                position = Math.max(0, Math.min(position, 100));
                updateSliderPosition(position, true);
            }, config.slideSpeed);
        };
        var pauseAutoSlide = function () {
            clearInterval(autoSlideInterval);
        };
        var resumeAutoSlide = function () {
            if (config.autoSlide) {
                startAutoSlide();
            }
        };
        if (config.autoSlide) {
            startAutoSlide();
            container.addEventListener('mouseenter', pauseAutoSlide);
            container.addEventListener('mouseleave', resumeAutoSlide);
            container.addEventListener('mousedown', pauseAutoSlide);
            container.addEventListener('mouseup', resumeAutoSlide);
            container.addEventListener('touchstart', pauseAutoSlide);
            container.addEventListener('touchend', resumeAutoSlide);
        }
        slider.addEventListener('touchstart', function () {
            isDragging = true;
            slider.style.transition = 'none';
            afterImage.style.transition = 'none';
        });
        document.addEventListener('touchmove', function (e) {
            var touch = e.touches[0];
            onMouseMove(touch);
        });
        document.addEventListener('touchend', stopDragging);
        slider.tabIndex = 0;
        slider.addEventListener('keydown', function (e) {
            var percentage = parseFloat(slider.style.left) || config.startPosition;
            var stepSize = config.step;
            if (e.key === 'ArrowLeft' && percentage > 0) {
                percentage = Math.max(0, percentage - stepSize);
            }
            if (e.key === 'ArrowRight' && percentage < 100) {
                percentage = Math.min(100, percentage + stepSize);
            }
            updateSliderPosition(percentage, true);
        });
        if (beforeImage.complete && afterImage.complete) {
            setResponsiveSize();
        }
        else {
            beforeImage.onload = afterImage.onload = setResponsiveSize;
        }
        var resizeObserver = new ResizeObserver(setResponsiveSize);
        resizeObserver.observe(container);
    };
    document.addEventListener('DOMContentLoaded', function () {
        var initMySlide = function (el) {
            var containers = document.querySelectorAll(el);
            containers.forEach(function (container) {
                var beforeImage = container.querySelector('img[data-image="1"]');
                var afterImage = container.querySelector('img[data-image="2"]');
                var config = {};
                ['step', 'startingPosition', 'mouseFollow', 'clickPosition', 'autoSlide', 'slideSpeed'].forEach(function (prop) {
                    if (container.dataset[prop]) {
                        config[prop] = container.dataset[prop];
                    }
                });
                if (beforeImage.complete && afterImage.complete) {
                    initializeSlider(container, config);
                }
                else {
                    beforeImage.onload = afterImage.onload = function () { return initializeSlider(container, config); };
                }
            });
        };
        initMySlide('[data-component="beforeafterslider"]');
    });
})();

/******/ })()
;
//# sourceMappingURL=baslider.js.map