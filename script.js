let products = [
    { id: 1, name: "ስማርት ስልክ (Smartphone)", price: 15000, category: "electronics", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300", description: "ጥራት ያለው ዘመናዊ ስማርት ስልክ።" },
    { id: 2, name: "ላፕቶፕ (Laptop)", price: 38000, category: "electronics", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300", description: "ፈጣን እና ለአሰራር ምቹ የሆነ ላፕቶፕ።" },
    { id: 3, name: "ታብሌት (Tablet)", price: 12000, category: "electronics", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300", description: "ለጥናት እና ለመዝናኛ የሚሆን ታብሌት።" },
    { id: 16, name: "ወንድ ጃኬት (Men Jacket)", price: 2500, category: "clothing", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300", description: "ሞቅ የሚያደርግ የወንድ ጃኬት።" },
    { id: 17, name: "የስፖርት ጫማ (Sport Shoes)", price: 3200, category: "clothing", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300", description: "ለስፖርት ምቹ የሆነ ጫማ።" },
    { id: 31, name: "ዘመናዊ የቡና ጠረጴዛ (Coffee Table)", price: 4500, category: "furniture", image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=300", description: "ለሳሎን የሚሆን ማራኪ ጠረጴዛ።" }
];

let cart = [];
let deliveryFee = 0;
let discountRate = 0;
let freeDelivery = false;
let couponUsed = false; 
let adminDiscountAllowed = false; 
let adminGiftAllowed = false;

let userWonBonusAmount = 0; 
let userWonFreeDelivery = false;

window.addEventListener('DOMContentLoaded', () => {
    renderProducts(products);

    const urlParams = new URLSearchParams(window.location.search);
    const isAdmin = urlParams.get('admin');
    const adminModal = document.getElementById("admin-modal");
    
    if (isAdmin === 'true') {
        let password = prompt("🔒 እባክዎ የአስተዳዳሪ መግቢያ ቃል ያስገቡ:");
        if (password === "maki2026") {
            if (adminModal) adminModal.style.display = "flex";
            renderAdminManagementList();
        } else {
            alert("❌ የይለፍ ቃል ስህተት ነው!");
            window.location.href = window.location.pathname; 
        }
    } else {
        if (adminModal) adminModal.style.display = "none";
    }
});

// --- አድሚን የበዓል ስጦታ ማስተካከያ ---
function toggleAdminGift(checkbox) {
    adminGiftAllowed = checkbox.checked;
    const giftSection = document.getElementById("holiday-gift-section");
    if (!giftSection) return;

    if (adminGiftAllowed) {
        giftSection.style.setProperty('display', 'block', 'important');
        alert("🎁 አድሚኑ የበዓል ስጦታ ማሽከርከሪያውን አበራ!");
    } else {
        giftSection.style.setProperty('display', 'none', 'important');
        alert("🔒 አድሚኑ የበዓል ስጦታውን ዘጋው!");
    }
}

function saveAdminGiftSettings() {
    const customText = document.getElementById("admin-gift-text-input").value.trim();
    const descEl = document.getElementById("admin-gift-description");
    if (customText && descEl) {
        descEl.innerText = customText;
        alert("✨ የስጦታው መግለጫ ተስተካክሏል!");
    } else {
        alert("⚠️ እባክዎ ትክክለኛ መግለጫ ጽሁፍ ያስገቡ!");
    }
}

function spinHolidayGift() {
    const resultBox = document.getElementById("spin-result-display");
    if (!resultBox) return;
    resultBox.innerText = "🔄 በመሽከርከር ላይ...";
    
    setTimeout(() => {
        const possibleGifts = [
            { text: "🎉 እንኳን ደስ አለዎት! 150 ብር የሽልማት ቦነስ አሸንፈዋል!", bonus: 150, freeDel: false },
            { text: "🙏 እናመሰግናለን! ለዚህ ግዢዎ 50 ብር ቅናሽ ተሰጥቷል!", bonus: 50, freeDel: false },
            { text: "✨ መልካም በዓል! ነፃ የዕቃ ማድረሻ (Free Delivery) ተሸልመዋል!", bonus: 0, freeDel: true },
            { text: "🎈 እናመሰግናለን! ቀጣይ ዕድልዎን ይሞክሩ!", bonus: 0, freeDel: false }
        ];
        
        const won = possibleGifts[Math.floor(Math.random() * possibleGifts.length)];
        resultBox.innerText = won.text;

        userWonBonusAmount = won.bonus;
        userWonFreeDelivery = won.freeDel;

        updateCartUI();
        sendTelegramNotification(`🎁 አዲስ የስጦታ ማሽከርከር ውጤት!\nየደረሰው ሽልማት: ${won.text}`);
    }, 1000);
}

function toggleAdminDiscount(checkbox) {
    adminDiscountAllowed = checkbox.checked;
    const promoContainer = document.getElementById("promo-container");
    if (promoContainer) {
        promoContainer.style.display = adminDiscountAllowed ? "block" : "none";
    }
    if (!adminDiscountAllowed) {
        discountRate = 0;
        freeDelivery = false;
        couponUsed = false;
        updateCartUI();
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const btn = document.getElementById('theme-btn');
    if (btn) {
        btn.innerText = document.body.classList.contains('dark-mode') ? "☀️" : "🌙";
    }
}

function handleSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    const query = searchInput.value.toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query));
    renderProducts(filtered);
}

function renderProducts(productsToDisplay) {
    const productContainer = document.getElementById("product-list");
    if (!productContainer) return;
    productContainer.innerHTML = "";
    
    if (productsToDisplay.length === 0) {
        productContainer.innerHTML = "<p style='grid-column: 1/-1; text-align:center;'>ምንም እቃዎች አልተገኙም።</p>";
        return;
    }

    productsToDisplay.forEach(product => {
        const productCard = document.createElement("div");
        productCard.className = "product-card";
        productCard.innerHTML = `
            <div>
                <img src="${product.image}" style="width:100%; height:120px; object-fit:cover; border-radius:4px;">
                <h3 style="font-size:14px; margin: 6px 0 3px 0;">${product.name}</h3>
                <p style="color: #007bff; font-weight: bold; font-size: 13px; margin-bottom: 6px;">${product.price} ብር</p>
            </div>
            <div style="display: flex; gap: 4px;">
                <button onclick="showProductDetail(${product.id})" style="background: #17a2b8; color: white; border: none; padding: 5px; border-radius: 3px; cursor: pointer; flex: 1; font-size: 11px;">ዝርዝር 👁️</button>
                <button onclick="addToCart(${product.id})" style="background: #28a745; color: white; border: none; padding: 5px; border-radius: 3px; cursor: pointer; flex: 1; font-size: 11px;">ግዛ 🛒</button>
            </div>
        `;
        productContainer.appendChild(productCard);
    });
}

function filterCategory(category) {
    if (category === 'all') renderProducts(products);
    else renderProducts(products.filter(p => p.category === category));
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) cartItem.quantity += 1;
    else cart.push({ ...product, quantity: 1 });
    updateCartUI();
    alert(`✅ ${product.name} ተጨምሯል!`);
}

function updateCartUI() {
    const cartContainer = document.getElementById("cart-items");
    const cartTotalElement = document.getElementById("cart-total");
    if (!cartContainer || !cartTotalElement) return;
    cartContainer.innerHTML = "";
    let subtotal = 0;

    cart.forEach((item, index) => {
        let itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        cartContainer.innerHTML += `
            <div style="display:flex; justify-content:space-between; font-size:11px; margin:4px 0; align-items:center;">
                <span>${item.name} (${item.quantity})</span>
                <span>${itemTotal} ብር <button onclick="cart.splice(${index},1);updateCartUI();" style="color:red; border:none; background:none; cursor:pointer; font-weight:bold;">✕</button></span>
            </div>
        `;
    });

    let promoDiscount = subtotal * discountRate;
    let totalDiscount = promoDiscount + userWonBonusAmount;
    
    // ነፃ ዴሊቨሪ ከስጦታ ወይም ከኩፖን ሲገኝ ማድረሻው 0 ይሆናል
    let isFreeDelActive = freeDelivery || userWonFreeDelivery;
    let currentDelivery = isFreeDelActive ? 0 : deliveryFee;
    
    let grand = (subtotal - totalDiscount) + currentDelivery;
    if (grand < 0) grand = 0;

    cartTotalElement.innerHTML = `<b>ዕቃዎች ድምር:</b> ${subtotal} ብር<br>
        ${totalDiscount > 0 ? `<b>አጠቃላይ ቅናሽ/ቦነስ:</b> -${totalDiscount} ብር<br>` : ''}
        <b>ማስረከቢያ:</b> ${currentDelivery} ብር ${isFreeDelActive ? '<span style="color:green;">(ነፃ - Free Delivery ✅)</span>' : ''}<br>
        <b style="color:#28a745; font-size:14px;">ጠቅላላ ክፍያ: ${grand} ብር</b>`;
}

function applyPromoCode() {
    if (!adminDiscountAllowed) {
        alert("❌ አስተዳዳሪው በአሁኑ ሰዓት ቅናሽ አልፈቀደም!");
        return;
    }

    const code = document.getElementById("promo-input").value.trim().toUpperCase();
    const msg = document.getElementById("promo-message");

    if (couponUsed) { 
        msg.style.color = "red"; 
        msg.innerText = "❌ ይህ ኩፖን በዚህ ትዕዛዝ ተጠቀሟል!"; 
        return; 
    }

    if (code === "MAKI5") {
        discountRate = 0.05;
        freeDelivery = false;
        couponUsed = true;
        msg.style.color = "green";
        msg.innerText = "🎉 5% ቅናሽ ተደረገ!";
    } else if (code === "FREEDEL") {
        discountRate = 0;
        freeDelivery = true;
        couponUsed = true;
        msg.style.color = "green";
        msg.innerText = "🎉 ነፃ ማድረሻ (Free Delivery) ተሰርቷል!";
    } else {
        msg.style.color = "red";
        msg.innerText = "❌ ትክክል ያልሆነ የኩፖን ኮድ!";
    }
    updateCartUI();
}

function updateDeliveryFee() {
    const sel = document.getElementById("customer-location");
    if (!sel) return;
    deliveryFee = parseInt(sel.options[sel.selectedIndex].getAttribute("data-fee")) || 0;
    updateCartUI();
}

function showPaymentDetails() {
    const method = document.getElementById("payment-method").value;
    const infoBox = document.getElementById("payment-info-box");
    if (!infoBox) return;
    
    let infoText = "";
    if (method === "Telebirr") infoText = "📱 <b>የቴሌብር ቁጥር:</b> 0912345678 (ማክቤል ካሰዬ)";
    else if (method === "CBE") infoText = "🏦 <b>የንግድ ባንክ (CBE) ቁጥር:</b> 1000123456789 (ማክቤል ካሰዬ)";
    else if (method === "Abyssinia") infoText = "🏦 <b>የአቢሲኒያ ባንክ ቁጥር:</b> UT123456 (ማክቤል ካሰዬ)";
    else if (method === "Dashen") infoText = "🏦 <b>የዳሽን ባንክ ቁጥር:</b> 5000123456 (ማክቤል ካሰዬ)";
    else if (method === "COD") infoText = "💵 እቃው ሲደርሰዎት በጥሬ ገንዘብ መክፈል ይችላሉ።";

    infoBox.style.display = infoText ? "block" : "none";
    infoBox.innerHTML = infoText;
}

function renderAdminManagementList() {
    const list = document.getElementById("admin-product-management-list");
    if (!list) return;
    list.innerHTML = "";
    products.forEach(p => {
        list.innerHTML += `
            <div style="display:flex; justify-content:space-between; align-items:center; font-size:11px; margin:4px 0; background:rgba(0,0,0,0.05); padding:6px; border-radius:4px;">
                <span><b>${p.name}</b> - <span style="color:#007bff; font-weight:bold;">${p.price} ብር</span></span>
                <div style="display:flex; gap:4px;">
                    <button onclick="adminEditProduct(${p.id})" style="background:#ffc107; border:none; padding:3px 6px; cursor:pointer; font-size:10px; border-radius:3px;">አስተካክል ✍️</button>
                    <button onclick="adminDeleteProduct(${p.id})" style="background:#dc3545; color:white; border:none; padding:3px 6px; cursor:pointer; font-size:10px; border-radius:3px;">ሰርዝ 🗑️</button>
                </div>
            </div>
        `;
    });
}

// --- አዲስ ዕቃ ሲጨመር በቅጽበት በፊት ለፊት እና በአድሚን ዝርዝር እንዲታይ ---
function adminAddProduct() {
    const nameInput = document.getElementById("admin-product-name");
    const priceInput = document.getElementById("admin-product-price");
    const categoryInput = document.getElementById("admin-product-category");
    const imageInput = document.getElementById("admin-product-image");

    if (!nameInput || !priceInput) return;

    const name = nameInput.value.trim();
    const price = parseFloat(priceInput.value);
    const category = categoryInput ? categoryInput.value : "electronics";
    const image = imageInput && imageInput.value.trim() ? imageInput.value.trim() : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300";

    if (!name || isNaN(price)) { 
        alert("⚠️ እባክዎ ትክክለኛ የእቃ ስም እና ዋጋ ያስገቡ!"); 
        return; 
    }

    const newProduct = {
        id: Date.now(),
        name: name,
        price: price,
        category: category,
        image: image,
        description: "በአስተዳዳሪ የተጨመረ አዲስ እቃ"
    };

    products.push(newProduct);

    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = "";

    renderProducts(products);
    renderAdminManagementList();

    nameInput.value = "";
    priceInput.value = "";
    if (imageInput) imageInput.value = "";

    alert("✅ አዲሱ ዕቃ ተጨመረ; አሁን በዌብሳይቱ ፊት ለፊት በግልጽ ይታያል!");
}

// --- ዋጋ እና ስም ማስተካከል (በቅጽበት የሚለወጥ) ---
function adminEditProduct(id) {
    const p = products.find(x => x.id === id);
    if (!p) return;

    const newName = prompt("አዲሱን የእቃ ስም ያስገቡ:", p.name);
    if (newName === null) return;

    const newPriceInput = prompt("አዲሱን ዋጋ (በብር) ያስገቡ:", p.price);
    if (newPriceInput === null) return;

    const newPrice = parseFloat(newPriceInput);
    if (isNaN(newPrice)) {
        alert("⚠️ እባክዎ ትክክለኛ የቁጥር ዋጋ ያስገቡ!");
        return;
    }

    p.name = newName.trim();
    p.price = newPrice;

    renderProducts(products);
    renderAdminManagementList();
    updateCartUI();

    alert(`✨ የእቃው ዋጋ እና ስም በተሳካ ሁኔታ ተስተካክሏል!\nአዲስ ስም: ${p.name}\nአዲስ ዋጋ: ${p.price} ብር`);
}

function adminDeleteProduct(id) {
    if (confirm("እርግጠኛ ኖት ይህንን እቃ መሰረዝ ይፈልጋሉ?")) {
        products = products.filter(x => x.id !== id);
        renderProducts(products);
        renderAdminManagementList();
    }
}

function closeAdminPanel() {
    window.location.href = window.location.pathname;
}

function checkout(e) {
    e.preventDefault();
    if (cart.length === 0) { alert("ከረጢቱ ባዶ ነው!"); return; }
    
    const name = document.getElementById("customer-name").value;
    const phone = document.getElementById("customer-phone").value;
    const location = document.getElementById("customer-location").value;
    const paymentMethod = document.getElementById("payment-method").value;
    const tx = document.getElementById("transaction-id").value;
    
    if (!name || !phone || !location || !paymentMethod || !tx) { 
        alert("እባክዎ ሙሉ መረጃ፣ ስልክ ቁጥር፣ አድራሻ እና የክፍያ ማረጋገጫ (Transaction ID) ያስገቡ!"); 
        return; 
    }
    
    let itemsText = "";
    let subtotal = 0;
    cart.forEach(item => {
        let itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        itemsText += `- ${item.name} (${item.quantity} ብዛት) = ${itemTotal} ብር\n`;
    });

    let promoDiscount = subtotal * discountRate;
    let totalDiscount = promoDiscount + userWonBonusAmount;
    let isFreeDelActive = freeDelivery || userWonFreeDelivery;
    let currentDelivery = isFreeDelActive ? 0 : deliveryFee;
    let grandTotal = (subtotal - totalDiscount) + currentDelivery;
    if (grandTotal < 0) grandTotal = 0;

    let orderMessage = `🛒 አዲስ ትዕዛዝ መጣ!\n\n` +
                       `👤 ስም: ${name}\n` +
                       `📞 ስልክ: ${phone}\n` +
                       `📍 አድራሻ: ${location}\n\n` +
                       `📦 የተመረጡ እቃዎች:\n${itemsText}\n` +
                       `💰 ዕቃዎች ድምር: ${subtotal} ብር\n` +
                       `${totalDiscount > 0 ? `🏷️ ቅናሽ/ቦነስ: -${totalDiscount} ብር\n` : ''}` +
                       `🚚 ማድረሻ ዋጋ: ${currentDelivery} ብር ${isFreeDelActive ? '(ነፃ - Free)' : ''}\n` +
                       `💵 ጠቅላላ ክፍያ: ${grandTotal} ብር\n\n` +
                       `💳 የክፍያ መንገድ: ${paymentMethod}\n` +
                       `🆔 የክፍያ ማረጋገጫ (TxID): ${tx}`;
    
    sendTelegramNotification(orderMessage);

    alert("✅ ትዕዛዝዎ ዋጋውን እና ቅናሹን ጨምሮ በተሳካ ሁኔታ ወደ ቴሌግራም ቦትዎ ተልኳል!");
    cart = [];
    userWonBonusAmount = 0;
    userWonFreeDelivery = false;
    updateCartUI();
}

function sendTelegramNotification(message) {
    const botToken = "8981438302:AAH19L3Uk-6XYCQRo86WEtI0-v59gSyf8AE";
    const chatId = "8885724020";
    const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`;

    fetch(url)
        .then(response => response.json())
        .then(data => console.log("Telegram sent:", data))
        .catch(error => console.error("Telegram error:", error));
}

function showProductDetail(id) {
    const p = products.find(x => x.id === id);
    if (p) alert(`ስም: ${p.name}\nዋጋ: ${p.price} ብር\nመግለጫ: ${p.description}`);
}
