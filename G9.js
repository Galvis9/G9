(() => {
    const scene = document.querySelector(".lightning-scene");
    const paths = document.querySelectorAll(".bolt-progress");
    const cards = document.querySelectorAll(".product-card");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!scene || paths.length === 0) {
        return;
    }

    if (prefersReducedMotion.matches) {
        return;
    }

    let lastProgress = -1;
    let flashTimeout;
    let frameRequested = false;

    const updateLightning = () => {
        const scrollableDistance = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollableDistance > 0
            ? Math.min(1, Math.max(0, window.scrollY / scrollableDistance))
            : 0;

        scene.style.setProperty("--bolt-progress", progress.toFixed(4));

        if (Math.abs(progress - lastProgress) > 0.018) {
            scene.classList.remove("is-flashing");
            requestAnimationFrame(() => scene.classList.add("is-flashing"));
            window.clearTimeout(flashTimeout);
            flashTimeout = window.setTimeout(() => {
                scene.classList.remove("is-flashing");
            }, 280);
            lastProgress = progress;
        }

        frameRequested = false;
    };

    updateLightning();

    window.addEventListener("scroll", () => {
        if (!frameRequested) {
            frameRequested = true;
            window.requestAnimationFrame(updateLightning);
        }
    }, { passive: true });

    window.addEventListener("resize", updateLightning, { passive: true });

    if ("IntersectionObserver" in window && cards.length > 0) {
        document.body.classList.add("motion-ready");
        const cardObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        cards.forEach((card) => cardObserver.observe(card));
    }
})();
