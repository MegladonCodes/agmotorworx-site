// Supabase configuration
const supabaseUrl = 'https://iclyyxcdhxwlhvjeqntv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljbHl5eGNkaHh3bGh2amVxbnR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4MzgwNDQsImV4cCI6MjA1NzQxNDA0NH0.3QV-8VNIatxSJj6KfVv65S94Jy19XZS3hfNQz8TnThk';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);


// Function to fetch product data from Supabase
async function fetchProducts() {
    const { data, error } = await supabaseClient
        .from('products') // Replace 'products' with your actual table name
        .select('*');
    
    if (error) {
        console.error('Error fetching products:', error.message);
        return [];
    }
    return data;
}

// Function to display product details
async function displayProductDetails() {
    const productDetailsContainer = document.getElementById('product-details');
    if (!productDetailsContainer) return;

    // Get product ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));

    if (!productId) {
        productDetailsContainer.innerHTML = '<div class="error-message">Product not found. Please return to the <a href="agmotorworx-shop-page.html">shop page</a>.</div>';
        return;
    }

    const products = await fetchProducts();
    const product = products.find(p => p.id === productId);

    if (!product) {
        productDetailsContainer.innerHTML = '<div class="error-message">Product not found. Please return to the <a href="agmotorworx-shop-page.html">shop page</a>.</div>';
        return;
    }

    // Display product details
    productDetailsContainer.innerHTML = `
        <div class="breadcrumbs">
            <a href="agmotorworx-shop-page.html">Shop</a> > ${product.category} > ${product.title}
        </div>
        <div class="product-details-content">
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.title}" class="product-image">
            </div>
            <div class="product-info">
                <h1 class="product-title">${product.title}</h1>
                <p class="product-category">${product.category}</p>
                <p class="product-price">R${product.price.toFixed(2)}</p>
                <div class="product-description">
                    <p>${product.description}</p>
                </div>
                <div class="product-features">
                    <h3>Key Features:</h3>
                    <ul>
                        <li>${product.features}</li>
                    </ul>
                </div>
                <div class="product-actions">
                    <a href="tel:+27818479871" class="call-to-order-btn">Call to Order</a>
                </div>
                <div class="back-to-shop">
                    <a href="agmotorworx-shop-page.html">← Back to Shop</a>
                </div>
            </div>
        </div>
        <div class="related-products">
            <h2>Related Products</h2>
            <div class="related-products-grid">
                ${getRelatedProducts(products, product).map(relatedProduct => `
                    <div class="related-product-card" onclick="window.location.href='product-details.html?id=${relatedProduct.id}'">
                        <img src="${relatedProduct.image}" alt="${relatedProduct.title}" class="related-product-image">
                        <h3>${relatedProduct.title}</h3>
                        <p>R${relatedProduct.price.toFixed(2)}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // Add event listener to "Add to Cart" button
    const addToCartBtn = productDetailsContainer.querySelector('.add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            alert(`Added ${product.title} to cart!`);
        });
    }
}

// Function to get related products (same category, excluding current product)
function getRelatedProducts(products, currentProduct) {
    return products
        .filter(product => product.category === currentProduct.category && product.id !== currentProduct.id)
        .slice(0, 3); // Limit to 3 related products
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', displayProductDetails);
