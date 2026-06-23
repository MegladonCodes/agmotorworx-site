document.addEventListener('DOMContentLoaded', function () {
    initDealerCarousel();
    initScrollAnimations();
});

function initDealerCarousel() {
    const slideContainer = document.querySelector('.slide-container');
    const slides = document.querySelectorAll('.slide');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    const dotsContainer = document.getElementById('dealer-dots');

    if (!slideContainer || !slides.length) return;

    let currentIndex = 0;
    const slideCount = slides.length;
    let autoInterval;

    slides.forEach(function (_, i) {
        const dot = document.createElement('button');
        dot.classList.add('dealer-dot');
        if (i === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', 'Go to dealer ' + (i + 1));
        dot.addEventListener('click', function () {
            goToSlide(i);
            resetAuto();
        });
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.dealer-dot');

    function updateDots(index) {
        dots.forEach(function (dot, i) {
            dot.classList.toggle('active', i === index);
        });
    }

    function goToSlide(index) {
        slideContainer.style.transition = 'transform 0.6s ease-in-out';
        slideContainer.style.transform = 'translateX(-' + (index * 100) + '%)';
        currentIndex = index;
        updateDots(index);
    }

    function nextSlide() {
        goToSlide((currentIndex + 1) % slideCount);
    }

    function prevSlide() {
        goToSlide((currentIndex - 1 + slideCount) % slideCount);
    }

    prevButton.addEventListener('click', function () { prevSlide(); resetAuto(); });
    nextButton.addEventListener('click', function () { nextSlide(); resetAuto(); });

    function startAuto() {
        autoInterval = setInterval(nextSlide, 5000);
    }

    function resetAuto() {
        clearInterval(autoInterval);
        startAuto();
    }

    slideContainer.addEventListener('mouseenter', function () { clearInterval(autoInterval); });
    slideContainer.addEventListener('mouseleave', startAuto);

    startAuto();
}

function initScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in');
    if (!elements.length) return;

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    elements.forEach(function (el) { observer.observe(el); });
}
