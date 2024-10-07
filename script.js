document.addEventListener('DOMContentLoaded', function () {
    const initializeSlider = (container, defaultConfig = {}) => {
        if (container.dataset.initSlider) {
            return;
        }

        container.dataset.initSlider = 1;

        const beforeImage = container.querySelector('img[data-image="1"]');
        const afterImage = container.querySelector('img[data-image="2"]');
        const labels = container.querySelector('.acbaslider__labels');
        const config = {
            step: 5,
            startPosition: defaultConfig.startPosition || 50  
        };

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

            if (!containerWidth) {
                console.log("Container width is 0, setting default size.");
                container.style.width = '100%';
            }

            const height = containerWidth * aspectRatio;
            container.style.height = `${height}px`;
            console.log(`Responsive size set: ${containerWidth}px width, ${height}px height`);
        };

        const initializeResponsiveSize = () => {
            setResponsiveSize();
            window.addEventListener('resize', setResponsiveSize);
        };

        initializeResponsiveSize();

        // Apply dynamic styles to container and images
        container.style.borderRadius = '15px';
        container.style.boxShadow = '0px 8px 20px rgba(0, 0, 0, 0.2)';

        // Set the initial position of the divider and image clipping
        afterImage.style.clipPath = `inset(0 ${100 - config.startPosition}% 0 0)`;
        afterImage.style.transition = 'clip-path 0.4s ease-in-out';

        // Slider creation
        let slider = document.createElement('div');
        slider.className = 'acbaslider__divider';

        let handle = document.createElement('div');
        handle.className = 'acbaslider__divider__handle';

        slider.appendChild(handle);
        container.appendChild(slider);

        // Set initial slider position
        slider.style.left = `${config.startPosition}%`;

        let isDragging = false;

        const onMouseMove = (e) => {
            if (!isDragging) return;

            const rect = container.getBoundingClientRect();
            let offsetX = e.clientX - rect.left;

            if (offsetX < 0) offsetX = 0;
            if (offsetX > rect.width) offsetX = rect.width;

            const percentage = (offsetX / rect.width) * 100;

            slider.style.left = `${percentage}%`;
            afterImage.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
        };

        const stopDragging = () => {
            isDragging = false;
            slider.style.transition = 'left 0.2s ease';
            afterImage.style.transition = 'clip-path 0.2s ease';
        };

        slider.addEventListener('mousedown', () => {
            isDragging = true;
            slider.style.transition = 'none';
            afterImage.style.transition = 'none';
        });

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', stopDragging);

        slider.addEventListener('touchstart', () => {
            isDragging = true;
            slider.style.transition = 'none';
            afterImage.style.transition = 'none';
        });

        document.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            onMouseMove(touch);
        });

        document.addEventListener('touchend', stopDragging);

        slider.tabIndex = 0;
        slider.addEventListener('keydown', (e) => {
            let percentage = parseFloat(slider.style.left) || config.startPosition;

            if (e.key === 'ArrowLeft') {
                percentage = Math.max(0, percentage - config.step);
            }

            if (e.key === 'ArrowRight') {
                percentage = Math.min(100, percentage + config.step);
            }

            slider.style.left = `${percentage}%`;
            afterImage.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
        });

        if (beforeImage.complete && afterImage.complete) {
            setResponsiveSize();
        } else {
            beforeImage.onload = afterImage.onload = setResponsiveSize;
        }

        const resizeObserver = new ResizeObserver(setResponsiveSize);
        resizeObserver.observe(container);
    };

    const initMySlide = (el) => {
        const containers = document.querySelectorAll(el);

        containers.forEach(container => {
            const beforeImage = container.querySelector('img[data-image="1"]');
            const afterImage = container.querySelector('img[data-image="2"]');

            if (beforeImage.complete && afterImage.complete) {
                initializeSlider(container);
            } else {
                beforeImage.onload = afterImage.onload = () => initializeSlider(container);
            }
        });
    };

    initMySlide('[data-component="beforeafterslider"]');
});
