// pp.js - بيانات المنتجات
window.products = [
    {
        id: 1,
        name: 'مكتب عصري',
        price: 8800,
        description: 'مكتب عصري بتصميم أنيق مع مساحة تخزين واسعة. مثالي للمكاتب المنزلية والمكاتب الصغيرة.',
        images: ['images/1.jpg', 'images/1.jpg', 'images/2.jpg'],
        specs: {
            المادة: 'خشب وزجاج',
            الأبعاد: '160x80x75 سم',
            الألوان: ['أبيض', 'بني']
        },
        category: 'طاولات',
        related: [2, 3]
    },
    {
        id: 2,
        name: 'طاولة مكتب زجاجية',
        price: 2200,
        description: 'طاولة مكتب زجاجية فاخرة مع قاعدة معدنية متينة. تصميم عصري وأنيق يناسب المكاتب التنفيذية.',
        images: ['images/office-table.jpg', 'images/office-table.jpg', 'images/office-table.jpg'],
        specs: {
            المادة: 'زجاج وفولاذ',
            الأبعاد: '180x90x75 سم',
            الألوان: ['شفاف', 'أسود']
        },
        category: 'طاولات',
        related: [1, 3]
    },
    {
        id: 3,
        name: 'خزانة ملفات حديثة',
        price: 1500,
        description: 'خزانة ملفات حديثة بسعة كبيرة وأدراج متعددة. مثالية لتنظيم المستندات والملفات في المكتب.',
        images: ['images/2.jpg', 'images/2.jpg', 'images/2.jpg'],
        specs: {
            المادة: 'خشب صناعي',
            الأبعاد: '120x40x180 سم',
            الألوان: ['أبيض', 'رمادي']
        },
        category: 'خزانات',
        related: [1, 2]
    },
    {
        id: 4,
        name: 'خزانة ملفات حديثة',
        price: 1500,
        description: 'خزانة ملفات حديثة بتصميم عصري ومتانة عالية. مثالية لتنظيم المستندات والملفات في المكتب.',
        images: ['images/3.jpg', 'images/3.jpg', 'images/3.jpg'],
        specs: {
            المادة: 'خشب ومعدن',
            الأبعاد: '100x35x170 سم',
            الألوان: ['بني', 'أسود']
        },
        category: 'خزانات',
        related: [1, 2]
    },
    {
        id: 5,
        name: 'طاولة mkteb زجاجية',
        price: 2200,
        description: 'طاولة مكتب زجاجية فاخرة مع قاعدة معدنية متينة. تصميم عصري وأنيق يناسب المكاتب التنفيذية.',
        images: ['images/office-table.jpg', 'images/office-table.jpg', 'images/office-table.jpg'],
        specs: {
            المادة: 'زجاج وفولاذ',
            الأبعاد: '180x90x75 سم',
            الألوان: ['شفاف', 'أسود']
        },
        category: 'طاولات',
        related: [1, 3]
    },
    {
        id: 6,
        name: 'biroo عصري',
        price: 1500,
        description: 'مكتب عصري بتصميم أنيق مع مساحة تخزين واسعة. مثالي للمكاتب المنزلية والمكاتب الصغيرة.',
        images: ['images/3.jpg', 'images/4.jpg', 'images/5.jpg', 'images/6.jpg', 'images/7.jpg'],
        specs: {
            المادة: 'خشب وزجاج',
            الأبعاد: '160x80x75 سم',
            الألوان: ['أبيض', 'بني']
        },
        category: 'طاولات',
        related: [1, 3]
    },
    {
        id: 7,
        name: 'ioooo عصري',
        price: 1500,
        description: 'مكتب عصري بتصميم أنيق مع مساحة تخزين واسعة. مثالي للمكاتب المنزلية والمكاتب الصغيرة.',
        images: ['images/3.jpg', 'images/4.jpg', 'images/5.jpg', 'images/6.jpg', 'images/7.jpg'],
        specs: {
            المادة: 'خشب وزجاج',
            الأبعاد: '160x80x75 سم',
            الألوان: ['أبيض', 'بني']
        },
        category: 'غرف',
        related: [1, 3]
    },
];