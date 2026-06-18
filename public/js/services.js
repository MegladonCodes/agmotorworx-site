document.addEventListener('DOMContentLoaded', function() {
    const burgerMenu = document.getElementById('burger-menu');
    const navLinks = document.getElementById('nav-links');
    const navLinksMobile = document.getElementById('nav-links-mobile');
    navLinksMobile.style.display = 'none';

    function toggleMenu() {
        navLinksMobile.classList.toggle('active');
        navLinksMobile.style.display = navLinksMobile.style.display === 'none' ? 'flex' : 'none';
    }

    burgerMenu.addEventListener('click', toggleMenu);

    function handleResize() {
        if (window.innerWidth <= 768) {
            burgerMenu.style.display = 'flex';
            navLinks.style.display = 'none';
        } else {
            burgerMenu.style.display = 'none';
            navLinks.style.display = 'flex';
            navLinksMobile.classList.remove('active');
        }
    }

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
});