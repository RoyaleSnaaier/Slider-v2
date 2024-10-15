(function () {
    const initializeSlider = (container: HTMLElement, settings = {}) => {
        if (container.dataset.initSlider) {
            return;
        }

        container.dataset.initSlider = "1";

        const beforeImage = container.querySelector<HTMLImageElement>('img[data-image="1"]');
        const afterImage = container.querySelector<HTMLImageElement>('img[data-image="2"]');
        const labels = container.querySelector<HTMLElement>('.acbaslider__labels');

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
            console.log(`Responsive size set: ${containerWidth}px width, ${height}px height`);
        };

        const initializeResponsiveSize = () => {
            setResponsiveSize();
            window.addEventListener('resize', setResponsiveSize);
        };

        initializeResponsiveSize();

        container.style.borderRadius = '15px';
        container.style.boxShadow = '0px 8px 20px rgba(0, 0, 0, 0.2)';

        // Set initial styles for the after image
        afterImage.style.clipPath = `inset(0 ${100 - config.startPosition}% 0 0)`;
        afterImage.style.transition = 'clip-path 0.3s ease';
        let slider = document.createElement('div');
        slider.className = 'acbaslider__divider';

        let handle = document.createElement('div');
        handle.className = 'acbaslider__divider__handle';

        slider.appendChild(handle);
        container.appendChild(slider);

        slider.style.left = `${config.startPosition}%`;

        let isDragging = false;
        let autoSlideInterval: any;

        const updateSliderPosition = (percentage: number, smooth = false) => {
            if (smooth) {
                slider.style.transition = 'left 0.3s ease';
                afterImage.style.transition = 'clip-path 0.3s ease';
            } else {
                slider.style.transition = 'none';
                afterImage.style.transition = 'none';
            }

            slider.style.left = `${percentage}%`;
            afterImage.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
        };

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
                const beforeImage: HTMLImageElement|null = container.querySelector<HTMLImageElement>('img[data-image="1"]');
                const afterImage = container.querySelector<HTMLImageElement>('img[data-image="2"]');
                const config: {[key:string]: string} = {};

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
