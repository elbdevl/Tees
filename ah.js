// التحكم في القائمة الجانبية
const menuToggle = document.querySelector('.menu-toggle');
const sidebar = document.querySelector('.sidebar');
const closeBtn = document.querySelector('.close-btn');

menuToggle.addEventListener('click', () => {
    sidebar.classList.add('active');
});

closeBtn.addEventListener('click', () => {
    sidebar.classList.remove('active');
});

// إغلاق القائمة عند النقر خارجها
document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && !e.target.closest('.menu-toggle')) {
        sidebar.classList.remove('active');
    }
});

// إغلاق القائمة عند تغيير حجم الشاشة
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        sidebar.classList.remove('active');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const productsContainer = document.getElementById('productsContainer');
    const productDetailPage = document.getElementById('productDetailPage');
    const productDetailContent = document.getElementById('productDetailContent');
    const backButton = document.getElementById('backButton');

    // التحقق من تحميل بيانات المنتجات
    if (!window.products) {
        console.error('لم يتم تحميل بيانات المنتجات!');
        productsContainer.innerHTML = '<p class="error">حدث خطأ في تحميل المنتجات. يرجى تحديث الصفحة.</p>';
        return;
    }

    initApp();

    function initApp() {
        renderProducts();
        handleRouting();
    }

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
            console.error('المنتج غير موجود!');
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
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i> إضافة إلى السلة
                </button>
                ${renderRelatedProducts(product.related)}
            </div>
        `;

        document.querySelector('.products-page').style.display = 'none';
        productDetailPage.style.display = 'block';
        addRelatedProductsListeners();
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
                addToCart(e.target.closest('.add-to-cart').dataset.id);
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

    backButton.addEventListener('click', () => {
        window.history.back();
    });

    window.addEventListener('hashchange', handleRouting);
});

// دالة تغيير الصورة الرئيسية
window.changeMainImage = function(src, element) {
    document.getElementById('mainImage').src = src;
    document.querySelectorAll('.thumbnail').forEach(thumb => thumb.classList.remove('active'));
    element.classList.add('active');
}

// دالة إضافة إلى السلة
window.addToCart = function(productId) {
    console.log(`تمت إضافة المنتج ${productId} إلى السلة`);
    // يمكنك إضافة منطق السلة هنا
    alert(`تمت إضافة المنتج إلى السلة! (ID: ${productId})`);
}