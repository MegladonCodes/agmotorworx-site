document.addEventListener('DOMContentLoaded', function () {
    const burgerMenu = document.getElementById('burger-menu');
    const navLinks = document.getElementById('nav-links');
    const navLinksMobile = document.getElementById('nav-links-mobile');

    if (!burgerMenu || !navLinksMobile) return;

    navLinksMobile.style.display = 'none';

    function toggleMenu() {
        burgerMenu.classList.toggle('active');
        navLinksMobile.classList.toggle('active');
        navLinksMobile.style.display = navLinksMobile.classList.contains('active') ? 'flex' : 'none';
    }

    burgerMenu.addEventListener('click', toggleMenu);

    navLinksMobile.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            burgerMenu.classList.remove('active');
            navLinksMobile.classList.remove('active');
            navLinksMobile.style.display = 'none';
        });
    });

    function handleResize() {
        if (window.innerWidth <= 768) {
            burgerMenu.style.display = 'flex';
            if (navLinks) navLinks.style.display = 'none';
        } else {
            burgerMenu.style.display = 'none';
            burgerMenu.classList.remove('active');
            if (navLinks) navLinks.style.display = 'flex';
            navLinksMobile.classList.remove('active');
            navLinksMobile.style.display = 'none';
        }
    }

    window.addEventListener('resize', handleResize);
    handleResize();
});
