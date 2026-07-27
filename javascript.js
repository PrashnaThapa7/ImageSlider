class ImageSlider {

    constructor(selector) {

        this.slider = document.querySelector(selector);

        this.track = this.slider.querySelector(".slider-track");

        this.originalSlides = [...this.track.children];

        this.prevBtn = document.querySelector(".slider-prev");
        this.nextBtn = document.querySelector(".slider-next");

        this.dotsContainer = document.querySelector(".slider-dots");

        this.currentIndex = 1;

        this.isAnimating = false;

        this.autoPlay = null;

        this.init();

    }

    /* Initialize */

    init() {

        this.cloneSlides();

        this.createDots();

        this.updateDimensions();

        this.jumpTo(this.currentIndex, false);

        this.bindEvents();

        this.startAutoPlay();

        window.addEventListener("resize", () => {

            this.updateDimensions();

            this.jumpTo(this.currentIndex, false);

        });

    }

    /* Clone first and last slides */

    cloneSlides() {

        const firstClone = this.originalSlides[0].cloneNode(true);

        const lastClone = this.originalSlides[this.originalSlides.length - 1].cloneNode(true);

        this.track.prepend(lastClone);

        this.track.append(firstClone);

        this.slides = [...this.track.children];

    }

    /* Create indicator dots */

    createDots() {

        this.originalSlides.forEach((_, index) => {

            const dot = document.createElement("button");

            dot.dataset.index = index + 1;

            if (index === 0) {

                dot.classList.add("active");

            }

            dot.addEventListener("click", () => {

                this.goToSlide(index + 1);

            });

            this.dotsContainer.appendChild(dot);

        });

        this.dots = [...this.dotsContainer.children];

    }

    /* Responsive width */

    updateDimensions() {

        this.slideWidth = this.slider.querySelector(".slider-window").clientWidth;

    }

    /* Update active dot */

    updateDots() {

        this.dots.forEach(dot => dot.classList.remove("active"));

        let active = this.currentIndex;

        if (active === 0) active = this.originalSlides.length;

        if (active > this.originalSlides.length) active = 1;

        this.dots[active - 1].classList.add("active");

    }

    /* Move slider */

    jumpTo(index, animate = true) {

        this.track.style.transition = animate
            ? "transform .55s ease-in-out"
            : "none";

        this.track.style.transform =
            `translateX(-${this.slideWidth * index}px)`;

    }

    next() {

        if (this.isAnimating) return;

        this.currentIndex++;

        this.move();

    }

    previous() {

        if (this.isAnimating) return;

        this.currentIndex--;

        this.move();

    }

    move() {

        this.isAnimating = true;

        this.jumpTo(this.currentIndex);

        this.updateDots();

    }

    goToSlide(index) {

        if (this.isAnimating) return;

        this.currentIndex = index;

        this.move();

    }

    /* Infinite Loop */

    transitionFinished() {

        this.track.addEventListener("transitionend", () => {

            if (this.currentIndex === this.slides.length - 1) {

                this.currentIndex = 1;

                this.jumpTo(this.currentIndex, false);

            }

            if (this.currentIndex === 0) {

                this.currentIndex = this.originalSlides.length;

                this.jumpTo(this.currentIndex, false);

            }

            this.updateDots();

            this.isAnimating = false;

        });

    }

    /* Auto Play */

    startAutoPlay() {

        this.autoPlay = setInterval(() => {

            this.next();

        }, 3000);

    }

    stopAutoPlay() {

        clearInterval(this.autoPlay);

    }

    /* Swipe Support */

    enableSwipe() {

        let startX = 0;

        let endX = 0;

        this.slider.addEventListener("touchstart", e => {

            startX = e.changedTouches[0].clientX;

        });

        this.slider.addEventListener("touchend", e => {

            endX = e.changedTouches[0].clientX;

            if (startX - endX > 50) {

                this.next();

            }

            if (endX - startX > 50) {

                this.previous();

            }

        });

    }

    /* Events */

    bindEvents() {

        this.prevBtn.addEventListener("click", () => {

            this.previous();

        });

        this.nextBtn.addEventListener("click", () => {

            this.next();

        });

        document.addEventListener("keydown", e => {

            if (e.key === "ArrowRight") this.next();

            if (e.key === "ArrowLeft") this.previous();

        });

        this.slider.addEventListener("mouseenter", () => {

            this.stopAutoPlay();

        });

        this.slider.addEventListener("mouseleave", () => {

            this.startAutoPlay();

        });

        this.enableSwipe();

        this.transitionFinished();

    }

}

/* Start Slider */

document.addEventListener("DOMContentLoaded", () => {

    new ImageSlider(".slider");

});