const itemQuantityUpdateElements = document.querySelectorAll('.cart-item-management')

// Below elements are used in updateCartItem, stored here for optimisation
const cartTotalPrice = document.getElementById('cart-total-price')
const cartBadges = document.querySelectorAll('.nav-items .badge')

async function updateCartItem(event) {
    event.preventDefault(); // To prevent browser default of submitting the form

    const form = event.target;

    const productId = form.dataset.productid;
    const csrfToken = form.dataset.csrf;
    const quantity = form.firstElementChild.value; // value of quantity input tag

    let response;
    try {
        response = await fetch('/cart/items', {
            method: 'PATCH',
            body: JSON.stringify({
                productId: productId,
                quantity: quantity,
                _csrf: csrfToken
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    } catch (error) {
        alert('Something went wrong!')
        return;
    }

    if (!response.ok) {
        alert('Something went wrong');
        return;
    }

    const responseData = await response.json();

    if (responseData.updatedCartData.updatedItemPrice === 0) {
        form.parentElement.parentElement.remove();
    } else {
        const cartItemTotalPrice = form.parentElement.querySelector('.cart-item-totalprice')
        cartItemTotalPrice.textContent = responseData.updatedCartData.updatedItemPrice.toFixed(2);
    }

    cartTotalPrice.textContent = responseData.updatedCartData.newTotalPrice.toFixed(2);
    for (const cartBadge of cartBadges) {
        cartBadge.textContent = responseData.updatedCartData.newTotalQuantity;
    }
}

for (const formElement of itemQuantityUpdateElements) {
    formElement.addEventListener('submit', updateCartItem)
}