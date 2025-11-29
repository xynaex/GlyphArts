// --- INITIALIZATION ---
AOS.init({offset: 0,});

// --- NAVIGATION FUNCTIONS ---
function hamburg(){
    const navbar = document.querySelector(".dropdown");
    navbar.style.transform = "translateY(0px)";
}
function cancel(){
    const navbar = document.querySelector(".dropdown");
    navbar.style.transform = "translateY(-500px)";
}

// --- CART LOGIC ---
let cart = []; // Array to store cart objects: { name: 'Item Name', price: 150.00, quantity: 1 }

// Helper function to render the cart content
function renderCart() {
    const cartContainer = document.getElementById('cart-items-container');
    const emptyMessage = document.querySelector('.empty-cart-message');
    const checkoutButton = document.querySelector('#cart-view .checkout-btn');
    
    cartContainer.innerHTML = ''; 
    let total = 0;

    if (cart.length === 0) {
        emptyMessage.style.display = 'block';
        cartContainer.style.display = 'none';
        checkoutButton.disabled = true;
        checkoutButton.style.opacity = 0.5;
        
    } else {
        emptyMessage.style.display = 'none';
        cartContainer.style.display = 'block';
        checkoutButton.disabled = false;
        checkoutButton.style.opacity = 1;

        cart.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('cart-item');
            const itemSubtotal = item.price * item.quantity;
            total += itemSubtotal; 
            
            itemDiv.innerHTML = `
                <div class="item-details" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed rgba(255, 255, 255, 0.2); padding: 5px 0;">
                    <p style="font-weight: 600;">${item.name}</p>
                    <p>₱${itemSubtotal.toFixed(2)}</p>
                </div>
                <div class="item-controls">
                    <button onclick="changeQuantity(${index}, -1)" class="control-btn">-</button>
                    <span>Qty: ${item.quantity}</span>
                    <button onclick="changeQuantity(${index}, 1)" class="control-btn">+</button>
                    <button onclick="removeItemFromCart(${index})" class="remove-btn" title="Remove Item"><i class="fa-solid fa-trash-can"></i></button>
                </div>
            `;
            cartContainer.appendChild(itemDiv);
        });

        // Add a total summary line
        const totalDiv = document.createElement('div');
        totalDiv.classList.add('cart-total-summary');
        totalDiv.innerHTML = `<p style="font-size: 1.5rem; font-weight: bold; text-align: right; margin-top: 15px; border-top: 2px solid var(--accent-color); padding-top: 10px;">Total: ₱${total.toFixed(2)}</p>`;
        cartContainer.appendChild(totalDiv);
    }
}


// Function called by "Add to Cart" buttons
function addToCart(productName, priceString) {
    // 1. Clean up price string to get a number (e.g., "₱150.00" -> 150.00)
    const productPrice = parseFloat(priceString.replace(/[^\d.]/g, ''));
    if (isNaN(productPrice)) {
        console.error("Invalid price:", priceString);
        return; 
    }

    // 2. Check if item already exists in cart
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        const product = { name: productName, price: productPrice, quantity: 1 };
        cart.push(product);
    }
    
    // 3. Re-render the cart and open the modal
    renderCart(); 
    openCart();
}

// Update quantity function
function changeQuantity(index, delta) {
    if (cart[index]) {
        cart[index].quantity += delta;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1); // Remove if quantity reaches 0
        }
        renderCart(); 
    }
}

// Remove item function
function removeItemFromCart(index) {
    cart.splice(index, 1);
    renderCart(); 
}

// --- MODAL & VIEW SWITCHING FUNCTIONS ---

function openCart() {
    showCartView(); 
    document.getElementById('cartModal').style.display = 'block';
}

function closeCart() {
    document.getElementById('cartModal').style.display = 'none';
    showCartView(); // Reset to cart view when closing
}

function showCartView() {
    renderCart(); // Always render before showing cart view
    document.getElementById('cart-view').style.display = 'block';
    document.getElementById('checkout-form-container').style.display = 'none';
    document.querySelector('.cart-content h2').innerText = 'Your Shopping Cart';
}

function showCheckoutForm() {
    if (cart.length === 0) {
        alert('Your cart is empty. Please add items before checking out.');
        return;
    }
    
    // Set view to Checkout Form
    document.getElementById('cart-view').style.display = 'none';
    document.getElementById('checkout-form-container').style.display = 'block';
    document.querySelector('.cart-content h2').innerText = 'Shipping & Contact Details';
    
    // Prepare hidden data for Formspree
    prepareFormspreeData();
}

function prepareFormspreeData() {
    // Calculate total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalText = `₱${total.toFixed(2)}`;
    
    // Create a detailed summary of the order items
    const cartSummary = cart.map(item => 
        `\n- ${item.name} (Qty: ${item.quantity}) @ ₱${item.price.toFixed(2)}`
    ).join('');
    
    const orderDetails = `Total: ${totalText}\n--- ITEMS ORDERED ---\n${cartSummary}`;
    
    // Find the form and dynamically insert hidden fields for Formspree
    const form = document.querySelector('#checkout-form-container form');
    
    // 1. Remove old hidden fields if they exist
    document.querySelectorAll('.formspree-hidden-field').forEach(field => field.remove());
    
    // 2. Create and add new hidden fields
    
    // Hidden Total Field
    const totalInput = document.createElement('input');
    totalInput.type = 'hidden';
    totalInput.name = 'Cart_Total';
    totalInput.value = totalText;
    totalInput.classList.add('formspree-hidden-field');
    form.appendChild(totalInput);
    
    // Hidden Order Details Field (The full breakdown)
    const orderInput = document.createElement('input');
    orderInput.type = 'hidden';
    orderInput.name = 'Order_Details_Summary';
    orderInput.value = orderDetails;
    orderInput.classList.add('formspree-hidden-field');
    form.appendChild(orderInput);
}


// --- TYPEWRITER EFFECT ---
const texts = [
    "DIGITAL ARTS",
    "TRADITIONAL ARTS",
    "COMMISSION"
]

let speed = 100;

const textElements = document.querySelector(".typewriter-text")

let textIndex = 0;
let charcterIndex = 0;

function typeWriter() {
    if(charcterIndex < texts[textIndex].length){
        textElements.innerHTML += texts[textIndex].charAt(charcterIndex);
        charcterIndex++;
        setTimeout(typeWriter, speed); 
    }
    else{
        setTimeout(eraseText, 1000)
    }
}

function eraseText() {
    if(textElements.innerHTML.length > 0){
        textElements.innerHTML = textElements.innerHTML.slice(0,-1)
        setTimeout(eraseText, 50)
    }
    else{
        textIndex = (textIndex + 1) % texts.length;
        charcterIndex = 0;
        setTimeout(typeWriter,500)
    }
}

window.onload = function() {
    typeWriter();
    renderCart(); 
};