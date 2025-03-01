document.addEventListener("DOMContentLoaded", function () {
    console.log("cart.js loaded!"); // Debugging

    // Drag & Drop Functions
    window.allowDrop = function(event) {
        event.preventDefault();
    };

    window.drag = function(event) {
        const item = event.target;
        const itemData = {
            id: item.getAttribute("data-id"),
            name: item.getAttribute("data-name"),
            price: item.getAttribute("data-price")
        };
        event.dataTransfer.setData("text/plain", JSON.stringify(itemData));
    };

    window.drop = function(event) {
        event.preventDefault();
        const cart = document.getElementById("cart");
        const data = event.dataTransfer.getData("text/plain");
        const product = JSON.parse(data);

        // Create new cart item
        let cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");
        cartItem.innerHTML = `
            <p>${product.name} - $${product.price}</p>
            <button onclick="removeFromCart(this)">Remove</button>
        `;

        cart.appendChild(cartItem);
    };

    // Remove Item from Cart
    window.removeFromCart = function(button) {
        button.parentElement.remove();
    };

    // Checkout Function
    window.checkout = function() {
        alert("Proceeding to checkout! (This can be linked to a backend)");
    };
});
