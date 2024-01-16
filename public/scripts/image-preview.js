const imagePicker = document.querySelector('#image-upload input'); // Select using CSS selector
const imagePreview = document.querySelector('#image-upload img');

function updateImagePreview() {
    const files = imagePicker.files; // Array (with one element in this case)

    if (!files || files.length === 0) {
        imagePreview.style.display = 'none';
        return;
    }

    const pickedFile = files[0];
    imagePreview.src = URL.createObjectURL(pickedFile);
    imagePreview.style.display = 'block';
}

imagePicker.addEventListener('change', updateImagePreview);