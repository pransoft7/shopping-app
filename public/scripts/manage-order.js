const updateOrderForm = document.querySelectorAll('.order-actions form'); // Select all order forms

async function updateOrder(event) {
    event.preventDefault()
    const form = event.target;

    const formData = new FormData(form);
    const newStatus = formData.get('status');
    const orderId = formData.get('orderid');
    const csrfToken = formData.get('_csrf')

    let response;

    try {
        response = await fetch(`/admin/orders/${orderId}`, {
            method: 'PATCH',
            body: JSON.stringify({
                newStatus: newStatus,
                _csrf: csrfToken
            }), 
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        alert('Something went wrong - order status cannot be updated')
        return;
    }

    if (!response.ok) {
        alert('Something went wrong - order status cannot be updated')
        return;
    }

    const responseData = await response.json();

    form.parentElement.parentElement.querySelector('.badge').textContent = responseData.newStatus.toUpperCase();
}

for (const updateOrderFormItem of updateOrderForm) {
    updateOrderFormItem.addEventListener('submit', updateOrder) // Automatically passes event argument
}