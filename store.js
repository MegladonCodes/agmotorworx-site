// Supabase configuration
const supabaseUrl = 'https://iclyyxcdhxwlhvjeqntv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljbHl5eGNkaHh3bGh2amVxbnR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4MzgwNDQsImV4cCI6MjA1NzQxNDA0NH0.3QV-8VNIatxSJj6KfVv65S94Jy19XZS3hfNQz8TnThk';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);


// DOM elements
const productGrid = document.getElementById('product-grid');
const categoryFilter = document.getElementById('category-filter');
const productSearch = document.getElementById('product-search');
const paginationContainer = document.getElementById('pagination');
let products = []; // Will store products fetched from Supabase

// Pagination settings
const productsPerPage = 8;
let currentPage = 1;

// Fetch products from Supabase
async function fetchProducts() {
    try {

        let { data: products, error } = await supabaseClient.from('products').select('*');
        if (error) {
            console.error('Error loading products:', error);
            return;
        }
        
        return products || [];
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

// Initialize products
async function initializeProducts() {
    console.log('Fetching products...');
    products = await fetchProducts();
    console.log('Fetched products:', products);
    displayProducts();
}

// Filter and search products
function filterProducts() {
    const searchTerm = productSearch.value.toLowerCase();
    const categoryValue = categoryFilter.value;
    
    return products.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchTerm);
        const matchesCategory = categoryValue === '' || product.category === categoryValue;
        return matchesSearch && matchesCategory;
    });
}

// Navigate to product details page
function navigateToProductDetails(productId) {
    window.location.href = `product-details.html?id=${productId}`;
}

// Display products on the current page
function displayProducts() {
    const filteredProducts = filterProducts();
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const currentProducts = filteredProducts.slice(startIndex, endIndex);
    
    productGrid.innerHTML = '';
    
    if (currentProducts.length === 0) {
        productGrid.innerHTML = '<div class="no-products">No products found.</div>';
        return;
    }
    
    currentProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="product-image">
            <div class="product-details">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-category">${product.category}</p>
                <p class="product-price">R${product.price.toFixed(2)}</p>
                <button class="view-details">View Details</button>
            </div>
        `;
        
        // Add click event to the entire card
        productCard.addEventListener('click', () => {
            navigateToProductDetails(product.id);
        });
        
        // // Prevent navigation when clicking the "Add to Cart" button
        // const addToCartButton = productCard.querySelector('.add-to-cart');
        // addToCartButton.addEventListener('click', (e) => {
        //     e.stopPropagation(); // Prevent the card's click event from firing
        //     // Add to cart logic here
        //     alert(`Added ${product.title} to cart!`);
        // });
        
        productGrid.appendChild(productCard);
    });
    
    updatePagination(filteredProducts.length);
}

// Update pagination controls
function updatePagination(totalProducts) {
    const totalPages = Math.ceil(totalProducts / productsPerPage);
    paginationContainer.innerHTML = '';
    
    if (totalPages <= 1) {
        return;
    }
    
    // Previous button
    const prevButton = document.createElement('button');
    prevButton.className = `pagination-arrow ${currentPage === 1 ? 'disabled' : ''}`;
    prevButton.textContent = '←';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayProducts();
            window.scrollTo(0, 0);
        }
    });
    paginationContainer.appendChild(prevButton);
    
    // Page buttons
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    startPage = Math.max(1, endPage - 4);
    
    if (startPage > 1) {
        const firstPageButton = document.createElement('button');
        firstPageButton.className = 'pagination-button';
        firstPageButton.textContent = '1';
        firstPageButton.addEventListener('click', () => {
            currentPage = 1;
            displayProducts();
            window.scrollTo(0, 0);
        });
        paginationContainer.appendChild(firstPageButton);
        
        if (startPage > 2) {
            const ellipsis = document.createElement('span');
            ellipsis.className = 'pagination-ellipsis';
            ellipsis.textContent = '...';
            paginationContainer.appendChild(ellipsis);
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.className = `pagination-button ${i === currentPage ? 'active' : ''}`;
        pageButton.textContent = i;
        pageButton.addEventListener('click', () => {
            currentPage = i;
            displayProducts();
            window.scrollTo(0, 0);
        });
        paginationContainer.appendChild(pageButton);
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const ellipsis = document.createElement('span');
            ellipsis.className = 'pagination-ellipsis';
            ellipsis.textContent = '...';
            paginationContainer.appendChild(ellipsis);
        }
        
        const lastPageButton = document.createElement('button');
        lastPageButton.className = 'pagination-button';
        lastPageButton.textContent = totalPages;
        lastPageButton.addEventListener('click', () => {
            currentPage = totalPages;
            displayProducts();
            window.scrollTo(0, 0);
        });
        paginationContainer.appendChild(lastPageButton);
    }
    
    // Next button
    const nextButton = document.createElement('button');
    nextButton.className = `pagination-arrow ${currentPage === totalPages ? 'disabled' : ''}`;
    nextButton.textContent = '→';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayProducts();
            window.scrollTo(0, 0);
        }
    });
    paginationContainer.appendChild(nextButton);
}

// Event listeners
categoryFilter.addEventListener('change', () => {
    currentPage = 1;
    displayProducts();
});

productSearch.addEventListener('input', () => {
    currentPage = 1;
    displayProducts();
});

// Initialize the page
// Instead of immediately displaying products, we now fetch them first
document.addEventListener('DOMContentLoaded', () => {
    initializeProducts();
});