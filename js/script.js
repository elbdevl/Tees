// إدارة سلة التسوق
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// تحديث أيقونة السلة
const updateCartIcon = () => {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('.cart-counter').forEach(counter => {
    counter.textContent = totalItems > 0 ? `(${totalItems})` : '';
  });
}

// إضافة منتج للسلة
const addToCart = (product) => {
  const existingProduct = cart.find(item => item.id === product.id);
  
  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartIcon();
  showNotification(`تمت إضافة ${product.name} إلى السلة`);
}

// حذف منتج من السلة
const removeFromCart = (index) => {
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartDisplay();
  updateCartIcon();
}

// تحديث الكمية
const updateQuantity = (index, newQuantity) => {
  if (newQuantity > 0) {
    cart[index].quantity = parseInt(newQuantity);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
  }
}

// تحديث المجموع الكلي
const updateTotal = () => {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  document.getElementById('total-price').textContent = total.toFixed(2);
}

// عرض الإشعارات
const showNotification = (message) => {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => notification.remove(), 3000);
}

// تحديث عرض السلة
const updateCartDisplay = () => {
  const container = document.querySelector('.cart-items');
  const emptyCartHTML = `
    <div class="empty-cart">
      <i class="fas fa-shopping-cart"></i>
      <h3>سلة التسوق فارغة</h3>
      <a href="products.html" class="cta-button">تصفح المنتجات</a>
    </div>
  `;
  
  if (cart.length === 0) {
    container.innerHTML = emptyCartHTML;
    document.querySelector('.cart-summary').style.display = 'none';
    return;
  }
  
  container.innerHTML = cart.map((item, index) => `
    <div class="cart-item" data-index="${index}">
      <img src="images/product${item.id}.jpg" alt="${item.name}">
      <div class="item-details">
        <h3>${item.name}</h3>
        <p>السعر: ${item.price.toFixed(2)} ر.س</p>
        <div class="quantity-control">
          <button class="quantity-btn minus">-</button>
          <input type="number" value="${item.quantity}" min="1" class="quantity-input">
          <button class="quantity-btn plus">+</button>
        </div>
      </div>
      <button class="remove-item">
        <i class="fas fa-trash-alt"></i>
      </button>
    </div>
  `).join('');
  
  // إضافة الأحداث الديناميكية
  document.querySelectorAll('.minus').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = e.target.closest('.cart-item').dataset.index;
      const input = e.target.nextElementSibling;
      updateQuantity(index, parseInt(input.value) - 1);
    });
  });
  
  document.querySelectorAll('.plus').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = e.target.closest('.cart-item').dataset.index;
      const input = e.target.previousElementSibling;
      updateQuantity(index, parseInt(input.value) + 1);
    });
  });
  
  document.querySelectorAll('.remove-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = e.target.closest('.cart-item').dataset.index;
      removeFromCart(index);
    });
  });
  
  document.querySelectorAll('.quantity-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const index = e.target.closest('.cart-item').dataset.index;
      updateQuantity(index, parseInt(e.target.value));
    });
  });
  
  updateTotal();
  document.querySelector('.cart-summary').style.display = 'block';
}

// التهيئة الأولية
document.addEventListener('DOMContentLoaded', () => {
  updateCartIcon();
  updateCartDisplay();
  
  // تحديث السلة عند التغيير من نوافذ أخرى
  window.addEventListener('storage', () => {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartDisplay();
    updateCartIcon();
  });
});

// إدارة طرق الدفع
document.querySelectorAll('.payment-method').forEach(method => {
  method.addEventListener('click', () => {
    // إزالة النشاط عن جميع العناصر
    document.querySelectorAll('.payment-method').forEach(m => {
      m.classList.remove('active');
    });
    
    // إضافة النشاط للعنصر المحدد
    method.classList.add('active');
    
    // إظهار/إخفاء حقول الدفع
    const methodType = method.dataset.method;
    document.querySelectorAll('.payment-details').forEach(d => {
      d.style.display = 'none';
    });
    
    if (methodType === 'credit-card') {
      document.getElementById('creditCardForm').style.display = 'block';
    } else {
      document.getElementById('creditCardForm').style.display = 'none';
    }
  });
});

// جعل حقول بطاقة الائتمان غير إلزامية عند اختيار الدفع النقدي
document.getElementById('checkoutForm').addEventListener('submit', (e) => {
  const activeMethod = document.querySelector('.payment-method.active').dataset.method;
  
  if (activeMethod === 'cash') {
    document.getElementById('cardNumber').required = false;
    document.getElementById('expiryDate').required = false;
    document.getElementById('cvv').required = false;
  }
});
