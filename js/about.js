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

    const imageFilenames = [
        'car1.jpeg', 'car2.jpeg', 'car3.jpeg', 'car4.jpeg', 'car5.jpeg',
        'car6.jpeg', 'car7.jpeg', 'car8.jpeg', 'car9.jpeg', 'car10.jpeg',
        'car11.jpeg', 'car12.jpeg', 'car13.jpeg', 'car14.jpeg', 'car15.jpeg',
        'car16.jpeg', 'car17.jpeg', 'car18.jpeg', 'car19.jpeg', 'car20.jpeg'
    ];
    
    // Generate gallery images array
    const galleryImages = imageFilenames.map(filename => ({
        src: `/img/about/${filename}`,
        alt: `Performance Car ${filename.split('_').pop().split('.')[0]}`
    }));

    // Initialize gallery
        initGallery(galleryImages);

});

function initGallery(galleryImages) {
    const mainImage = document.getElementById('mainImage');
    const thumbnailContainer = document.getElementById('thumbnailContainer');
    const galleryDots = document.getElementById('galleryDots');
    
    let currentIndex = 0;
    let autoRotateInterval;

    // Generate thumbnails
    galleryImages.forEach((image, index) => {
    // Create thumbnail
    const thumbnail = document.createElement('div');
    thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
    
    const img = document.createElement('img');
    img.src = image.src;
    img.alt = `Thumbnail ${index + 1}`;
    
    thumbnail.appendChild(img);
    thumbnailContainer.appendChild(thumbnail);
    
    // Add click event
    thumbnail.addEventListener('click', () => {
        setActiveImage(index);
        resetAutoRotate();
    });
    
    // Create dot
    const dot = document.createElement('div');
    dot.className = `dot ${index === 0 ? 'active' : ''}`;
    
    dot.addEventListener('click', () => {
        setActiveImage(index);
        resetAutoRotate();
    });
    
    galleryDots.appendChild(dot);
    });
    
    // Start auto-rotation
    startAutoRotate();

    // Set active image
    function setActiveImage(index) {
    // Update current index
    currentIndex = index;
    
    // Update main image
    mainImage.src = galleryImages[index].src;
    mainImage.alt = galleryImages[index].alt;
    
    // Update thumbnails
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumb, i) => {
        thumb.className = `thumbnail ${i === index ? 'active' : ''}`;
    });
    
    // Update dots
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
        dot.className = `dot ${i === index ? 'active' : ''}`;
    });
    }
    
    // Auto-rotate images
    function startAutoRotate() {
    autoRotateInterval = setInterval(() => {
        const nextIndex = (currentIndex + 1) % galleryImages.length;
        setActiveImage(nextIndex);
    }, 5000); // Change image every 5 seconds
    }
    
    // Reset auto-rotation timer
    function resetAutoRotate() {
    clearInterval(autoRotateInterval);
    startAutoRotate();
    }
    
    // Pause auto-rotation when hovering over gallery
    const galleryContainer = document.querySelector('.gallery-container');
    galleryContainer.addEventListener('mouseenter', () => {
    clearInterval(autoRotateInterval);
    });
    
    galleryContainer.addEventListener('mouseleave', () => {
    startAutoRotate();
    });
}

// Set active image
function setActiveImage(index) {
    // Update current index
    currentIndex = index;
    
    // Update main image
    mainImage.src = galleryImages[index].src;
    mainImage.alt = galleryImages[index].alt;
    
    // Update thumbnails
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumb, i) => {
        thumb.className = `thumbnail ${i === index ? 'active' : ''}`;
    });
    
    // Update dots
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
        dot.className = `dot ${i === index ? 'active' : ''}`;
    });
}

// Auto-rotate images
function startAutoRotate() {
    autoRotateInterval = setInterval(() => {
        const nextIndex = (currentIndex + 1) % galleryImages.length;
        setActiveImage(nextIndex);
    }, 5000); // Change image every 5 seconds
}

// Reset auto-rotation timer
function resetAutoRotate() {
    clearInterval(autoRotateInterval);
    startAutoRotate();
}

// Pause auto-rotation when hovering over gallery
const galleryContainer = document.querySelector('.gallery-container');
galleryContainer.addEventListener('mouseenter', () => {
    clearInterval(autoRotateInterval);
});

galleryContainer.addEventListener('mouseleave', () => {
    startAutoRotate();
});