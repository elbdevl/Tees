
        // === بيانات المنتجات ===
        const products = [
            {
                id: 1,
                name: "كنبة فاخرة",
                price: 14999,
                description: "كنبة جلدية فاخرة بتصميم إيطالي",
                image: "https://i.ibb.co/vv3WbSMm/IMG-20250226-WA0042.jpg",
                category: "كنبات",
                specs: {
                    material: "جلد طبيعي",
                    dimensions: "220x90x75 سم",
                    colors: ["بني", "أسود"]
                }
            },
            // إضافة منتجات أخرى هنا...
        ];

        // === نظام التوجيه ===
        function router() {
            const path = window.location.hash.replace('#', '');
            const app = document.getElementById('app');
            
            if (path.startsWith('/product/')) {
                const productId = path.split('/')[2];
                renderProductDetail(productId);
            } else if (path === '/cart') {
                renderCart();
            } else {
                renderHome();
            }
        }

        // === الصفحات ===
        function renderHome() {
            app.innerHTML = `
                <h1>المنتجات</h1>
                <div class="products">
                    ${products.map(product => `
                        <div class="product-card">
                            <img src="${product.image}" alt="${product.name}">
                            <h3>${product.name}</h3>
                            <p>${product.price.toLocaleString()} ر.س</p>
                            <button onclick="navigateTo('#/product/${product.id}')">عرض التفاصيل</button>
                        </div>
                    `).join('')}
                </div>
                <a href="#/cart" style="display: block; margin-top: 20px;">عرض السلة</a>
            `;
        }

        function renderProductDetail(productId) {
            const product = products.find(p => p.id == productId);
            app.innerHTML = `
                <h1>${product.name}</h1>
                <img src="${product.image}" alt="${product.name}" style="max-width: 400px;">
                <p>${product.description}</p>
                <h3>${product.price.toLocaleString()} ر.س</h3>
                <button onclick="addToCart(${productId})">إضافة إلى السلة</button>
                <a href="#" style="display: block; margin-top: 20px;">العودة إلى الرئيسية</a>
            `;
        }

        function renderCart() {
            const cart = JSON.parse(localStorage.getItem('cart') || [];
            app.innerHTML = `
                <h1>السلة</h1>
                ${cart.length === 0 ? 
                    '<p>السلة فارغة</p>' : 
                    cart.map(item => `
                        <div class="cart-item">
                            <h3>${item.name}</h3>
                            <p>الكمية: ${item.quantity}</p>
                        </div>
                    `).join('')
                }
                <a href="#" style="display: block; margin-top: 20px;">العودة إلى الرئيسية</a>
            `;
        }

        // === الدوال المساعدة ===
        function navigateTo(path) {
            window.location.hash = path;
        }

        function addToCart(productId) {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const product = products.find(p => p.id == productId);
            
            const existingItem = cart.find(item => item.id == productId);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            alert('تمت الإضافة إلى السلة!');
        }

        // === تشغيل التطبيق ===
        window.addEventListener('hashchange', router);
        window.addEventListener('load', router);
  