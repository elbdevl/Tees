// cart.js - إدارة سلة التسوق
export const cart = {
  items: JSON.parse(localStorage.getItem('cart')) || [],
  
  save() {
    localStorage.setItem('cart', JSON.stringify(this.items));
  },
  
  add(product) {
    const existingItem = this.items.find(item => item.id === product.id);
    existingItem ? existingItem.quantity++ : this.items.push({ ...product, quantity: 1 });
    this.save();
    this.updateUI();
  },
  
  remove(id) {
    this.items = this.items.filter(item => item.id !== id);
    this.save();
    this.updateUI();
  },
  
  updateQuantity(id, change) {
    const item = this.items.find(item => item.id === id);
    if (item) {
      item.quantity = Math.max(1, item.quantity + change);
      this.save();
      this.updateUI();
    }
  },
  
  getTotal() {
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },
  
  updateUI() {
    this.updateCartIcon();
    this.renderCartItems();
    this.renderOrderSummary();
  },
  
  updateCartIcon() {
    const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.cart-counter').forEach(counter => {
      counter.textContent = totalItems > 0 ? `(${totalItems})` : '';
    });
  },
  
  renderCartItems() {
    const container = document.getElementById('cartContainer');
    if (!container) return;
    
    container.innerHTML = this.items.length ?
      this.items.map(item => this.createCartItemHTML(item)).join('') :
      this.emptyCartHTML();
  },
  
  createCartItemHTML(item) {
    return `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-info">
                    <h3>${item.name}</h3>
                    <p class="price">${item.price.toLocaleString()} درهم</p>
                    <div class="quantity-control">
                        <button class="qty-btn minus">−</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn plus">+</button>
                    </div>
                </div>
                <div class="item-total">
                    ${(item.price * item.quantity).toLocaleString()} درهم
                </div>
                <button class="remove-item">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
  },
  
  emptyCartHTML() {
    return `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3>سلة التسوق فارغة</h3>
                <a href="products.html" class="cta-button">تصفح المنتجات</a>
            </div>
        `;
  },
  
  renderOrderSummary() {
    if (!document.querySelector('.order-summary')) return;
    
    const subtotal = this.getTotal();
    const shipping = 50;
    const total = subtotal + shipping;
    
    document.querySelector('.subtotal').textContent = subtotal.toLocaleString() + ' درهم';
    document.querySelector('.total-price').textContent = total.toLocaleString() + ' درهم';
    document.getElementById('orderItems').innerHTML = this.items.map(item => `
            <div class="order-item">
                <span>${item.name} × ${item.quantity}</span>
                <span>${(item.price * item.quantity).toLocaleString()} درهم</span>
            </div>
        `).join('');
  },
  
  init() {
    this.bindEvents();
    this.updateUI();
  },
  
  bindEvents() {
    document.addEventListener('click', e => {
      if (e.target.closest('.add-to-cart')) {
        const product = this.getProductData(e.target);
        this.add(product);
        this.showNotification(`تمت إضافة ${product.name} إلى السلة`);
      }
      
      if (e.target.closest('.qty-btn')) {
        const itemId = e.target.closest('.cart-item').dataset.id;
        const isPlus = e.target.classList.contains('plus');
        this.updateQuantity(itemId, isPlus ? 1 : -1);
      }
      
      if (e.target.closest('.remove-item')) {
        const itemId = e.target.closest('.cart-item').dataset.id;
        if (confirm('هل تريد حذف هذا المنتج؟')) this.remove(itemId);
      }
    });
    
    // إدارة طرق الدفع
    document.querySelectorAll('.payment-method').forEach(method => {
      method.addEventListener('click', () => {
        document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('active'));
        method.classList.add('active');
        document.getElementById('creditCardForm').classList.toggle('hidden', method.dataset.method !== 'credit-card');
      });
    });
    
    document.getElementById('checkoutForm')?.addEventListener('submit', e => {
      if (document.querySelector('.payment-method.active').dataset.method === 'credit-card') {
        if (!this.validateCreditCard()) e.preventDefault();
      }
    });
  },
  
  getProductData(button) {
    // جلب بيانات المنتج من العنصر في الصفحة
    const productElement = button.closest('.product');
    return {
      id: productElement.dataset.id,
      name: productElement.querySelector('.product-name').textContent,
      price: parseFloat(productElement.querySelector('.product-price').dataset.value),
      image: productElement.querySelector('img').src
    };
  },
  
  validateCreditCard() {
    const cardNumber = document.getElementById('cardNumber').value;
    const expiryDate = document.getElementById('expiryDate').value;
    const cvv = document.getElementById('cvv').value;
    
    if (!/^\d{16}$/.test(cardNumber)) {
      alert('رقم البطاقة غير صحيح');
      return false;
    }
    
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
      alert('تاريخ الانتهاء غير صحيح');
      return false;
    }
    
    if (!/^\d{3}$/.test(cvv)) {
      alert('CVV غير صحيح');
      return false;
    }
    
    return true;
  },
  
  showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }
};

// التهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => cart.init());