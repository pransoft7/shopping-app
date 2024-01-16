const deleteProductBtns = document.querySelectorAll('.product-item button'); // Array of Elements

async function deleteProduct(event) { // event property is passed in by default for event listener functions
    const button = event.target; 
    const productId = button.dataset.productid; // Get product ID from button's data- attribute
    const csrfToken = button.dataset.csrf;
    console.log("Printing csrfToken")
    console.log(csrfToken);

    const response = await fetch('/admin/products/' + productId + '/delete?_csrf=' + csrfToken, {
        method: 'DELETE'
    });

    if (!response.ok) {
        alert('Something went wrong!');
        return;
    }

    button.parentElement.parentElement.parentElement.parentElement.remove(); // Remove product from DOM
}

for (const deleteProductBtn of deleteProductBtns) {
    deleteProductBtn.addEventListener('click', deleteProduct);
}