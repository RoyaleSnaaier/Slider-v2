(function () {
    const initializeSlider = (container: HTMLElement, settings = {}) => {
        if (container.dataset.initSlider) {
            return;
        }

        container.dataset.initSlider = "1";

        const beforeImage = container.querySelector<HTMLImageElement>('img[data-image="1"]');
        const afterImage = container.querySelector<HTMLImageElement>('img[data-image="2"]');
        const labels = container.querySelector<HTMLElement>('.acbaslider__labels');
        let beforeLabel: HTMLSpanElement | null = null;
        let afterLabel: HTMLSpanElement | null = null;
        const floatingLabelsEnabled = container.dataset.floatingLabels === 'true';
        
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

        const config = Object.assign({
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

        if (!beforeImage || !afterImage) return;


        const setResponsiveSize = () => {
            if (!beforeImage.naturalWidth || !beforeImage.naturalHeight) {
                console.log("Images are not fully loaded yet.");
                return;
            }

            const aspectRatio = beforeImage.naturalHeight / beforeImage.naturalWidth;
            const containerWidth = container.clientWidth || beforeImage.naturalWidth;

            const height = containerWidth * aspectRatio;
            container.style.height = `${height}px`;
        };

        const initializeResponsiveSize = () => {
            setResponsiveSize();
            window.addEventListener('resize', setResponsiveSize);
        };

        initializeResponsiveSize();

        // Set initial styles for the container if u want to have it dynamic :) (remove the box-radius and box-shadow from the scss!)
        // container.style.borderRadius = '15px';
        // container.style.boxShadow = '0px 8px 20px rgba(0, 0, 0, 0.2)';

        // Set initial styles for the after image
        afterImage.style.clipPath = `inset(0 ${100 - config.startPosition}% 0 0)`;

        let slider = document.createElement('div');
        slider.className = 'acbaslider__divider';

        let handle = document.createElement('div');
        handle.className = 'acbaslider__divider__handle';

        slider.appendChild(handle);
        container.appendChild(slider);

        slider.style.left = `${config.startPosition}%`;

        let isDragging = false;
        let autoSlideInterval: any;

        // Existing function to update slider position
        const updateSliderPosition = (() => {
            let lastFrame = 0;

            return (percentage: number, smooth = false) => {
                const now = performance.now();
                if (now - lastFrame < 16) return;
                lastFrame = now;

                const sliderTransition = smooth ? '0.3s ease' : 'none';
                const labelTransition = smooth ? '0.36s ease' : 'none';

                const afterImageClipValue = 100 - percentage;
                const beforeLabelOffset = `calc(${percentage}% - 15%)`;
                const afterLabelOffset = `calc(${percentage}% + 5%)`;

                slider.style.transition = sliderTransition;
                afterImage.style.transition = sliderTransition;
                slider.style.left = `${percentage}%`;
                afterImage.style.clipPath = `inset(0 ${afterImageClipValue}% 0 0)`;

                if (floatingLabelsEnabled) {
                    beforeLabel.style.transition = labelTransition;
                    afterLabel.style.transition = labelTransition;

                    beforeLabel.style.left = beforeLabelOffset;
                    afterLabel.style.left = afterLabelOffset;
                }

                requestAnimationFrame(() => {
                    if (smooth) {
                        slider.style.transition = sliderTransition;
                        afterImage.style.transition = sliderTransition;
                    } else {
                        slider.style.transition = 'none';
                        afterImage.style.transition = 'none';
                    }
                });
            };
        })();

        // Ensure floating labels update on slider load
        updateSliderPosition(config.startPosition);
            const onMouseMove = (e: MouseEvent|Touch) => {
                if (isDragging || config.mouseFollow) {
                    const rect = container.getBoundingClientRect();
                    let offsetX = e.clientX - rect.left;

                    offsetX = Math.max(0, Math.min(offsetX, rect.width));

                    const percentage = (offsetX / rect.width) * 100;
                    updateSliderPosition(percentage, true);
                }
            };

        const stopDragging = () => {
            isDragging = false;
            slider.style.transition = 'none';
            afterImage.style.transition = 'none';
        };

        slider.addEventListener('mousedown', () => {
            isDragging = true;
            slider.style.transition = 'none'; 
            afterImage.style.transition = 'none';
        });

        container.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', stopDragging);

        if (config.clickPosition) {
            container.addEventListener('click', (e) => {
                const rect = container.getBoundingClientRect();
                let offsetX = e.clientX - rect.left;
                const percentage = (offsetX / rect.width) * 100;
                updateSliderPosition(percentage, true);
            });
        }

        // Automatic sliding feature
        const startAutoSlide = () => {
            let position = config.startPosition;
            let direction = 1;

            const updateDirection = () => {
                if (position >= 100) {
                    direction = -1;
                } else if (position <= 0) {
                    direction = 1;
                }
            };

            autoSlideInterval = setInterval(() => {
                position += config.step * direction;
                updateDirection();
                position = Math.max(0, Math.min(position, 100));
                updateSliderPosition(position, true);
            }, config.slideSpeed);
        };

        const pauseAutoSlide = () => {
            clearInterval(autoSlideInterval);
        };

        const resumeAutoSlide = () => {
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

        slider.addEventListener('touchstart', () => {
            isDragging = true;
            slider.style.transition = 'none';
            afterImage.style.transition = 'none';
        });

        document.addEventListener('touchmove', (e: TouchEvent) => {
            const touch: Touch = e.touches[0];

            onMouseMove(touch);
        });

        document.addEventListener('touchend', stopDragging);

        slider.tabIndex = 0;
        slider.addEventListener('keydown', (e) => {
            let percentage = parseFloat(slider.style.left) || config.startPosition;
            const stepSize = config.step;

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
        } else {
            beforeImage.onload = afterImage.onload = setResponsiveSize;
        }

        const resizeObserver = new ResizeObserver(setResponsiveSize);
        resizeObserver.observe(container);
    };

    document.addEventListener('DOMContentLoaded', function () {
        const initMySlide = (el: string) => {
            const containers = document.querySelectorAll<HTMLElement>(el);

            containers.forEach(container => {
                const beforeImage: HTMLImageElement | null = container.querySelector<HTMLImageElement>('img[data-image="1"]');
                const afterImage = container.querySelector<HTMLImageElement>('img[data-image="2"]');
                const config: { [key: string]: string } = {};

                ['step', 'startingPosition', 'mouseFollow', 'clickPosition', 'autoSlide', 'slideSpeed'].forEach(prop => {
                    if (container.dataset[prop]) {
                        config[prop] = container.dataset[prop];
                    }
                });

                if (beforeImage.complete && afterImage.complete) {
                    initializeSlider(container, config);
                } else {
                    beforeImage.onload = afterImage.onload = () => initializeSlider(container, config);
                }
            });
        };

        initMySlide('[data-component="beforeafterslider"]');
    });
})();