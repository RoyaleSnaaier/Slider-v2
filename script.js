document.addEventListener('DOMContentLoaded', function () {
    const initializeSlider = (container) => {
        if (container.dataset.initSlider) {
            return;
        }

        container.dataset.initSlider = 1;

        const beforeImage = container.querySelector('img[data-image="1"]');
        const afterImage = container.querySelector('img[data-image="2"]');
        const labels = container.querySelector('.acbaslider__labels');

        // Hide labels when JavaScript is enabled
        if (labels) {
            labels.style.display = 'none';
        }

        if (!beforeImage || !afterImage) return;

        // Dynamic styling applied by JS
        container.style.position = 'relative';
        container.style.overflow = 'hidden';
        container.style.borderRadius = '15px'; // Add border-radius dynamically
        container.style.boxShadow = '0px 8px 20px rgba(0, 0, 0, 0.2)'; // Add box-shadow dynamically

        beforeImage.style.position = 'absolute';
        beforeImage.style.top = '0';
        beforeImage.style.left = '0';
        beforeImage.style.width = '100%';
        beforeImage.style.height = '100%';
        beforeImage.style.objectFit = 'cover';

        afterImage.style.position = 'absolute';
        afterImage.style.top = '0';
        afterImage.style.left = '0';
        afterImage.style.width = '100%';
        afterImage.style.height = '100%';
        afterImage.style.objectFit = 'cover';
        afterImage.style.clipPath = 'inset(0 50% 0 0)';
        afterImage.style.transition = 'clip-path 0.4s ease-in-out';

        const setResponsiveSize = () => {
            const aspectRatio = beforeImage.naturalHeight / beforeImage.naturalWidth;
            const containerWidth = container.clientWidth || beforeImage.naturalWidth;
            container.style.width = `${containerWidth}px`;
            container.style.height = `${containerWidth * aspectRatio}px`;
            afterImage.style.clipPath = 'inset(0 50% 0 0)';
        };

        let slider = document.createElement('div');
        slider.style.position = 'absolute';
        slider.style.top = '0';
        slider.style.left = '50%';
        slider.style.width = '4px';
        slider.style.height = '100%';
        slider.style.backgroundColor = '#fff';
        slider.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.8)';
        slider.style.cursor = 'pointer';
        slider.style.transition = 'left 0.2s ease-in-out';

        let handle = document.createElement('div');
        handle.style.position = 'absolute';
        handle.style.top = '50%';
        handle.style.left = '50%';
        handle.style.transform = 'translate(-50%, -50%)';
        handle.style.width = '25px';
        handle.style.height = '25px';
        handle.style.borderRadius = '50%';
        handle.style.backgroundColor = '#ffffff';
        handle.style.border = '3px solid #888';
        handle.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.7)';
        handle.style.transition = 'box-shadow 0.3s ease-in-out';
        handle.addEventListener('mouseenter', () => {
            handle.style.boxShadow = '0 0 30px rgba(255, 255, 255, 1)';
        });
        handle.addEventListener('mouseleave', () => {
            handle.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.7)';
        });

        slider.appendChild(handle);
        container.appendChild(slider);

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
            let percentage = parseFloat(slider.style.left) || 50;

            if (e.key === 'ArrowLeft') {
                percentage = Math.max(0, percentage - 5);
            }

            if (e.key === 'ArrowRight') {
                percentage = Math.min(100, percentage + 5);
            }

            slider.style.left = `${percentage}%`;
            afterImage.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
        });

        setResponsiveSize();
        window.addEventListener('resize', setResponsiveSize);
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
