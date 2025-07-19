// payment.js
import { showLoader, hideLoader } from './ui.js';
import { validateCard, processPayment } from './payment-api.js';

const paymentForm = document.getElementById('advancedPaymentForm');
const cardNumberInput = document.getElementById('cardNumber');
const cardLogo = document.getElementById('cardLogo');

// التعرف على نوع البطاقة
async function detectCardType(number) {
    const bin = number.replace(/\s/g, '').substring(0, 6);
    if (bin.length < 6) return;

    try {
        const response = await fetch(`https://lookup.binlist.net/${bin}`);
        const data = await response.json();
        cardLogo.src = getCardLogo(data.brand);
    } catch (error) {
        cardLogo.src = 'images/unknown-card.png';
    }
}

function getCardLogo(brand) {
    const logos = {
        'visa': 'images/visa.png',
        'mastercard': 'images/mastercard.png',
        'amex': 'images/amex.png',
        // إضافة المزيد من الأنواع
    };
    return logos[brand.toLowerCase()] || 'images/unknown-card.png';
}

// إدارة الخطوات
document.querySelectorAll('.next-step').forEach(btn => {
    btn.addEventListener('click', () => navigateSteps(1));
});

document.querySelectorAll('.prev-step').forEach(btn => {
    btn.addEventListener('click', () => navigateSteps(-1));
});

function navigateSteps(direction) {
    // ... كود إدارة الخطوات ...
}

// التحقق من الدفع
paymentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    showLoader();

    const formData = {
        method: document.querySelector('.payment-method-card.active').dataset.method,
        details: {}
    };

    if (formData.method === 'credit-card') {
        const validation = validateCard({
            number: cardNumberInput.value,
            expiry: document.getElementById('expiryDate').value,
            cvv: document.getElementById('cvv').value
        });

        if (!validation.valid) {
            showErrors(validation.errors);
            return;
        }

        formData.details = { ...validation.data };
    } else {
        const selectedTime = document.querySelector('.time-slot.selected')?.dataset.time;
        if (!selectedTime) {
            showErrors(['الرجاء اختيار وقت التسليم']);
            return;
        }
        formData.details.deliveryTime = selectedTime;
    }

    const result = await processPayment(formData);
    handlePaymentResult(result);
});

// أحداث ديناميكية
cardNumberInput.addEventListener('input', (e) => {
    detectCardType(e.target.value);
    formatCardNumber(e.target);
});

document.querySelectorAll('.time-slot').forEach(slot => {
    slot.addEventListener('click', () => {
        document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
        slot.classList.add('selected');
    });
});

// تنسيق رقم البطاقة
function formatCardNumber(input) {
    let value = input.value.replace(/\D/g, '');
    value = value.match(/.{1,4}/g)?.join(' ') || '';
    input.value = value;
}