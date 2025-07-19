// pd.js - التحكم بالقائمة وعرض المنتجات والسلة (نسخة محدثة)
document.addEventListener('DOMContentLoaded', function() {
    // === تحديث عدد المنتجات في السلة ===
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        // تحديث جميع عناصر عداد السلة في الصفحة
        document.querySelectorAll('.cart-count').forEach(element => {
            element.textContent = totalItems;
            element.style.display = totalItems > 0 ? 'inline-block' : 'none';
        });
    }
    
    // === القائمة الجانبية ===
    setupSidebar();
    
    // === إدارة السلة ===
    if (document.getElementById('cartContainer')) {
        initCart();
    }
    
    // === عرض المنتجات ===
    if (document.getElementById('productsContainer')) {
        initProducts();
    }
    
    // === الدوال العامة ===
    window.changeMainImage = function(src, element) {
        const mainImage = document.getElementById('mainImage');
        if (mainImage) {
            mainImage.src = src;
            document.querySelectorAll('.thumbnail').forEach(thumb => {
                thumb.classList.remove('active');
            });
            element.classList.add('active');
        }
    };
    
    window.addToCart = function(productId) {
        // تحميل السلة من localStorage
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.id === parseInt(productId));
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({
                id: parseInt(productId),
                quantity: 1
            });
        }
        
        // حفظ السلة المحدثة
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // تحديث العداد
        updateCartCount();
        
        // إظهار الإشعار
        showNotification('تمت إضافة المنتج إلى السلة');
        
        // تحديث واجهة السلة إذا كانت مفتوحة
        if (window.cartInstance) {
            window.cartInstance.render();
        }
    };
    
    // === وظائف مساعدة ===
    function setupSidebar() {
        const menuToggle = document.querySelector('.menu-toggle');
        const sidebar = document.querySelector('.sidebar');
        const closeBtn = document.querySelector('.close-btn');
        
        if (!menuToggle || !sidebar || !closeBtn) return;
        
        menuToggle.addEventListener('click', function() {
            sidebar.classList.add('active');
        });
        
        closeBtn.addEventListener('click', function() {
            sidebar.classList.remove('active');
        });
        
        document.addEventListener('click', function(e) {
            if (!sidebar.contains(e.target) && 
                !e.target.closest('.menu-toggle') && 
                sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
            }
        });
        
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                sidebar.classList.remove('active');
            }
        });
    }
    
    function initCart() {
        window.cartInstance = {
            items: [],
            
            init() {
                this.loadCart();
                this.render();
                this.setupEventListeners();
                updateCartCount(); // تحديث العداد عند التحميل
            },
            
            loadCart() {
                this.items = JSON.parse(localStorage.getItem('cart')) || [];
            },
            
            saveCart() {
                localStorage.setItem('cart', JSON.stringify(this.items));
                updateCartCount(); // تحديث العداد بعد أي تغيير
            },
            
            render() {
                const cartContainer = document.getElementById('cartContainer');
                if (!cartContainer) return;
                
                if (this.items.length === 0) {
                    cartContainer.innerHTML = `
                        <div class="empty-cart">
                            <i class="fas fa-shopping-cart"></i>
                            <h3>سلة التسوق فارغة</h3>
                            <a href="products.html" class="cta-button">
                                <i class="fas fa-box-open"></i> تصفح المنتجات
                            </a>
                        </div>
                    `;
                } else {
                    cartContainer.innerHTML = this.items.map(item => {
                        const product = window.products.find(p => p.id === item.id);
                        if (!product) return '';
                        
                        const totalPrice = product.price * item.quantity;
                        return `
                            <div class="cart-item" data-id="${item.id}">
                                <div class="item-image">
                                    <img src="${product.images[0]}" alt="${product.name}">
                                </div>
                                <div class="item-details">
                                    <h3 class="item-title">${product.name}</h3>
                                    <p class="item-price">${product.price.toLocaleString()} درهم</p>
                                    <div class="quantity-control">
                                        <button class="quantity-btn minus" data-id="${item.id}">
                                            <i class="fas fa-minus"></i>
                                        </button>
                                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                                        <button class="quantity-btn plus" data-id="${item.id}">
                                            <i class="fas fa-plus"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="item-actions">
                                    <button class="remove-item" data-id="${item.id}">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                    <p class="item-total">${totalPrice.toLocaleString()} درهم</p>
                                </div>
                            </div>
                        `;
                    }).join('');
                }
                
                this.updateSummary();
            },
            
            updateSummary() {
                const subtotal = this.items.reduce((total, item) => {
                    const product = window.products.find(p => p.id === item.id);
                    return total + (product ? product.price * item.quantity : 0);
                }, 0);
                
                const shipping = 50;
                const total = subtotal + shipping;
                
                if (document.querySelector('.subtotal')) {
                    document.querySelector('.subtotal').textContent = `${subtotal.toLocaleString()} درهم`;
                }
                
                if (document.querySelector('.grand-total')) {
                    document.querySelector('.grand-total').textContent = `${total.toLocaleString()} درهم`;
                }
            },
            
            addItem(productId) {
                const existingItem = this.items.find(item => item.id === parseInt(productId));
                if (existingItem) {
                    existingItem.quantity++;
                } else {
                    this.items.push({
                        id: parseInt(productId),
                        quantity: 1
                    });
                }
                this.saveCart();
                this.render();
                showNotification(`تمت إضافة ${product.name} إلى السلة ✔️`);
            },
            
            removeItem(productId) {
                this.items = this.items.filter(item => item.id !== parseInt(productId));
                this.saveCart();
                this.render();
                showNotification('تم حذف المنتج من السلة');
            },
            
            updateQuantity(productId, change) {
                const item = this.items.find(item => item.id === parseInt(productId));
                if (item) {
                    item.quantity = Math.max(1, item.quantity + change);
                    this.saveCart();
                    this.render();
                }
            },
            
            setQuantity(productId, quantity) {
                const item = this.items.find(item => item.id === parseInt(productId));
                if (item) {
                    item.quantity = Math.max(1, parseInt(quantity) || 1);
                    this.saveCart();
                    this.render();
                }
            },
            
            setupEventListeners() {
                document.addEventListener('click', (e) => {
                    if (e.target.closest('.quantity-btn.minus')) {
                        const id = e.target.closest('.quantity-btn').dataset.id;
                        this.updateQuantity(id, -1);
                    }
                    
                    if (e.target.closest('.quantity-btn.plus')) {
                        const id = e.target.closest('.quantity-btn').dataset.id;
                        this.updateQuantity(id, 1);
                    }
                    
                    if (e.target.closest('.remove-item')) {
                        const id = e.target.closest('.remove-item').dataset.id;
                        if (confirm('هل تريد حذف هذا المنتج من السلة؟')) {
                            this.removeItem(id);
                        }
                    }
                });
                
                document.addEventListener('change', (e) => {
                    if (e.target.classList.contains('quantity-input')) {
                        const id = e.target.dataset.id;
                        this.setQuantity(id, e.target.value);
                    }
                });
            }
        };
        
        window.cartInstance.init();
    }
    
    // دالة لتصفية المنتجات حسب الفئة
    function renderProductsByCategory(category) {
        const productsContainer = document.getElementById('productsContainer');
        if (!productsContainer) return;
        
        // التحقق من تحميل بيانات المنتجات
        if (!window.products || window.products.length === 0) {
            productsContainer.innerHTML = '<p class="error">حدث خطأ في تحميل المنتجات. يرجى تحديث الصفحة.</p>';
            return;
        }
        
        // تصفية المنتجات حسب الفئة المطلوبة
        const filteredProducts = window.products.filter(
            product => product.category === category
        );
        
        // عرض المنتجات المصفاة
        productsContainer.innerHTML = filteredProducts.map(product => `
            <div class="product-card" data-id="${product.id}">
                <img src="${product.images[0]}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <span class="product-price">${product.price} درهم</span>
                    <div class="product-actions">
                        <button class="add-to-cart" data-id="${product.id}">
                            <i class="fas fa-cart-plus"></i> إضافة للسلة
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        addProductEventListeners();
    }
    
    function initProducts() {
        const productsContainer = document.getElementById('productsContainer');
        const productDetailPage = document.getElementById('productDetailPage');
        const productDetailContent = document.getElementById('productDetailContent');
        const backButton = document.getElementById('backButton');
        
        if (!productsContainer || !productDetailPage || !productDetailContent) return;
        
        // التحقق من تحميل بيانات المنتجات
        if (!window.products || window.products.length === 0) {
            productsContainer.innerHTML = '<p class="error">حدث خطأ في تحميل المنتجات. يرجى تحديث الصفحة.</p>';
            return;
        }
        
        // تحديد إذا كنا في صفحة table.html لعرض فئة "طاولات" فقط
        if (window.location.pathname.includes('table.html')) {
            renderProductsByCategory('طاولات');
        } else {
            renderProducts();
        }
        
        handleRouting();
        updateCartCount(); // تحديث عداد السلة عند تحميل الصفحة
        
        function renderProducts() {
            productsContainer.innerHTML = window.products.map(product => `
                <div class="product-card" data-id="${product.id}">
                    <img src="${product.images[0]}" alt="${product.name}" class="product-image">
                    <div class="product-info">
                        <h3 class="product-title">${product.name}</h3>
                        <span class="product-price">${product.price} درهم</span>
                        <div class="product-actions">
                            <button class="add-to-cart" data-id="${product.id}">
                                <i class="fas fa-cart-plus"></i> إضافة للسلة
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
            
            addProductEventListeners();
        }
        
        function showProductDetail(id) {
            const product = window.products.find(p => p.id == id);
            if (!product) {
                window.location.hash = '';
                return;
            }
            
            productDetailContent.innerHTML = `
                <div class="product-gallery">
                    <img src="${product.images[0]}" class="main-image" id="mainImage">
                    <div class="thumbnails-grid">
                        ${product.images.map((img, index) => `
                            <img src="${img}" 
                                 class="thumbnail ${index === 0 ? 'active' : ''}" 
                                 onclick="changeMainImage('${img}', this)">
                        `).join('')}
                    </div>
                </div>
                <div class="product-info-detail">
                    <h1>${product.name}</h1>
                    <div class="product-price-detail">${product.price} درهم</div>
                    <p class="description">${product.description}</p>
                    <div class="product-specs">
                        ${Object.entries(product.specs).map(([key, value]) => `
                            <div class="spec-item">
                                <span>${key}</span>
                                <span>${Array.isArray(value) ? value.join('، ') : value}</span>
                            </div>
                        `).join('')}
                    </div>
                    <button class="add-to-cart" data-id="${product.id}">
                        <i class="fas fa-cart-plus"></i> إضافة إلى السلة
                    </button>
                    ${renderRelatedProducts(product.related)}
                </div>
            `;
            
            document.querySelector('.products-page').style.display = 'none';
            productDetailPage.style.display = 'block';
            addRelatedProductsListeners();
            
            // إضافة حدث للزر في صفحة التفاصيل
            const detailBtn = productDetailContent.querySelector('.add-to-cart');
            if (detailBtn) {
                detailBtn.addEventListener('click', function() {
                    addToCart(this.dataset.id);
                });
            }
        }
        
        function renderRelatedProducts(relatedIds) {
            const relatedProducts = window.products.filter(p => relatedIds.includes(p.id));
            return `
                <div class="related-products">
                    <h3 class="related-title">قد يعجبك أيضاً</h3>
                    <div class="products-grid related-grid">
                        ${relatedProducts.map(product => `
                            <div class="product-card" data-id="${product.id}">
                                <img src="${product.images[0]}" alt="${product.name}" class="product-image">
                                <div class="product-info">
                                    <h3 class="product-title">${product.name}</h3>
                                    <span class="product-price">${product.price} درهم</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        
        function addProductEventListeners() {
            document.querySelectorAll('.product-card').forEach(card => {
                card.addEventListener('click', (e) => {
                    if (!e.target.closest('.add-to-cart')) {
                        const id = card.dataset.id;
                        window.location.hash = `#product/${id}`;
                    }
                });
            });
            
            document.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', (e) => {
                    e.stopPropagation();
                    addToCart(button.dataset.id);
                });
            });
        }
        
        function addRelatedProductsListeners() {
            document.querySelectorAll('.related-products .product-card').forEach(card => {
                card.addEventListener('click', () => {
                    const id = card.dataset.id;
                    window.location.hash = `#product/${id}`;
                });
            });
        }
        
        function handleRouting() {
            const path = window.location.hash.substr(1);
            if (path.startsWith('product/')) {
                const productId = path.split('/')[1];
                showProductDetail(productId);
            } else {
                document.querySelector('.products-page').style.display = 'block';
                productDetailPage.style.display = 'none';
            }
        }
        
        if (backButton) {
            backButton.addEventListener('click', () => window.history.back());
        }
        
        window.addEventListener('hashchange', handleRouting);
    }
    
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <div>${message}</div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // تحديث عداد السلة عند تحميل الصفحة
    updateCartCount();
});