// Main JavaScript file for Royal Jewels

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Add to cart function
function addToCart(productName, price) {
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: productName,
            price: price,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartIcon();
    showNotification(`${productName} добавлен в корзину!`);
}

// Update cart icon with item count
function updateCartIcon() {
    const cartIcon = document.querySelector('.cart-icon');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (totalItems > 0) {
        if (!cartIcon.querySelector('.cart-count')) {
            const cartCount = document.createElement('span');
            cartCount.className = 'cart-count';
            cartCount.style.cssText = `
                position: absolute;
                top: -8px;
                right: -8px;
                background: #ff4444;
                color: white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                font-weight: bold;
            `;
            cartIcon.appendChild(cartCount);
        }
        cartIcon.querySelector('.cart-count').textContent = totalItems;
    } else {
        const cartCount = cartIcon.querySelector('.cart-count');
        if (cartCount) {
            cartCount.remove();
        }
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #d4af37;
        color: #1a1a1a;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        font-weight: 600;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Mobile menu functionality
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    }
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Newsletter form submission
function initNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            if (email) {
                showNotification('Спасибо за подписку!');
                this.reset();
            }
        });
    }
}

// Animate elements on scroll
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.feature-item, .product-card, .testimonial-card').forEach(el => {
        observer.observe(el);
    });
}

// Product filter functionality
function initProductFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const priceFilter = document.getElementById('price-filter');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterProducts);
    }
    
    if (priceFilter) {
        priceFilter.addEventListener('change', filterProducts);
    }
}

function filterProducts() {
    const categoryFilter = document.getElementById('category-filter');
    const priceFilter = document.getElementById('price-filter');
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        let show = true;
        const category = product.dataset.category;
        const price = parseInt(product.dataset.price);
        
        // Category filter
        if (categoryFilter && categoryFilter.value && category !== categoryFilter.value) {
            show = false;
        }
        
        // Price filter
        if (priceFilter && priceFilter.value) {
            const [min, max] = priceFilter.value.split('-').map(p => p === '+' ? Infinity : parseInt(p));
            if (price < min || (max !== Infinity && price > max)) {
                show = false;
            }
        }
        
        product.style.display = show ? 'block' : 'none';
    });
}

// Clear filters function
function clearFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const priceFilter = document.getElementById('price-filter');
    
    if (categoryFilter) categoryFilter.value = '';
    if (priceFilter) priceFilter.value = '';
    
    document.querySelectorAll('.product-card').forEach(product => {
        product.style.display = 'block';
    });
}

// Quantity controls for cart
function changeQuantity(itemId, change) {
    const quantityElement = document.getElementById(`quantity-${itemId}`);
    if (quantityElement) {
        let currentQuantity = parseInt(quantityElement.textContent);
        currentQuantity = Math.max(1, currentQuantity + change);
        quantityElement.textContent = currentQuantity;
        updateTotal();
    }
}

// Remove item from cart
function removeItem(itemId) {
    const cartItem = document.querySelector(`[onclick="removeItem(${itemId})"]`).parentElement;
    if (cartItem) {
        cartItem.remove();
        updateTotal();
        
        // Check if cart is empty
        const cartItems = document.querySelectorAll('.cart-item');
        if (cartItems.length === 0) {
            document.querySelector('.cart-container').style.display = 'none';
            document.getElementById('empty-cart').style.display = 'block';
        }
    }
}

// Update cart total
function updateTotal() {
    const quantities = document.querySelectorAll('.quantity');
    const prices = [15000000, 17000000]; // Product prices
    let total = 0;
    
    quantities.forEach((quantity, index) => {
        if (index < prices.length) {
            total += parseInt(quantity.textContent) * prices[index];
        }
    });
    
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    
    if (subtotalElement) {
        subtotalElement.textContent = `${total.toLocaleString()} сум`;
    }
    if (totalElement) {
        totalElement.textContent = `${total.toLocaleString()} сум`;
    }
}

// Checkout function
function checkout() {
    showNotification('Спасибо за заказ! Мы свяжемся с вами в ближайшее время.');
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    updateCartIcon();
    initMobileMenu();
    initSmoothScrolling();
    initNewsletterForm();
    initScrollAnimations();
    initProductFilters();
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            animation: fadeInUp 0.6s ease forwards;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .feature-item,
        .product-card,
        .testimonial-card {
            opacity: 0;
            transform: translateY(30px);
        }
        
        .feature-item.animate-in,
        .product-card.animate-in,
        .testimonial-card.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
});

// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// Add scroll effect to header
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}); 