let cartData = [];
function loadCart() {
    cartData = JSON.parse(localStorage.getItem('ayoushTrips')) || [];
}
function saveCart() {
    localStorage.setItem('ayoushTrips', JSON.stringify(cartData));
    render();
}
function render() {
    loadCart();

    const cartCount = document.getElementById('cart-count');
    if (cartCount) cartCount.textContent = cartData.length;

    const cartPageDiv = document.getElementById('cart-items-page');
    if (cartPageDiv) {
        if (cartData.length === 0) {
            cartPageDiv.innerHTML = "<h3 style='text-align:center;'>Your bag is empty! 👜</h3>";
        } else {
            cartPageDiv.innerHTML = cartData.map((item, index) => `
                <div style="display:flex; justify-content:space-between; background:#fff; padding:15px; margin:10px 0; border-radius:8px; border:1px solid #ddd;">
                    <span>✈️ ${item}</span>
                    <button onclick="removeItem(${index})" style="color:red; border:none; background:none; cursor:pointer;">✖</button>
                </div>
            `).join('');
        }
    }

    const cartItems = document.getElementById('cart-items');
    if (cartItems) {
        cartItems.innerHTML = cartData.map(item =>
            `<div style="display:inline-block; background:#3498db; color:#fff; padding:5px 10px; margin:5px; border-radius:5px;">${item}</div>`
        ).join('');
    }

    const ticketTrips = document.getElementById('ticket-trips');
    if (ticketTrips) {
        if (cartData.length === 0) {
            ticketTrips.textContent = "No destinations selected.";
        } else {
            ticketTrips.innerHTML = cartData.join('<br>');
        }
    }

    setupDragAndDrop();
}
function addToCart(name) {
    loadCart();
    if (!cartData.includes(name)) {
        cartData.push(name);
        saveCart();
    } else {
        alert("Already in your bag!");
    }
}
function removeItem(index) {
    cartData.splice(index, 1);
    saveCart();
}
function clearCart() {
    if (confirm("Empty bag?")) {
        cartData = [];
        saveCart();
    }
}
function setupDragAndDrop() {
    const trips = document.querySelectorAll('.trip-item');
    const dropzone = document.getElementById('dropzone');

    if (!trips || !trips.length) return;

    trips.forEach(trip => {
        trip.setAttribute('draggable', 'true');
        trip.ondragstart = (e) => e.dataTransfer.setData('name', trip.dataset.name);
    });

    if (dropzone) {
        dropzone.ondragover = (e) => e.preventDefault();
        dropzone.ondrop = (e) => {
            e.preventDefault();
            const name = e.dataTransfer.getData('name');
            if (name) addToCart(name);
        };
    }
}
function setupColors() {
    const savedColor = localStorage.getItem('themeColor');
    if (savedColor) document.body.style.backgroundColor = savedColor;

    document.querySelectorAll('#colorPalette button').forEach(btn => {
        btn.addEventListener('click', () => {
            const color = btn.dataset.color;
            document.body.style.backgroundColor = color;
            localStorage.setItem('themeColor', color);
        });
    });
}
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-more')) {
        const overlay = e.target.closest('.trip-item').querySelector('.details-overlay');
        if (overlay) overlay.style.display = 'flex';
    }
    if (e.target.classList.contains('close-info')) {
        const overlay = e.target.closest('.details-overlay');
        if (overlay) overlay.style.display = 'none';
    }
    if (e.target.classList.contains('add-manual')) {
        addToCart(e.target.dataset.name);
    }
});
window.addEventListener('storage', () => render());
window.addEventListener('DOMContentLoaded', () => {
    setupColors();
    render();
});
