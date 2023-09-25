document.addEventListener("DOMContentLoaded", function () {
    // Get all flash message elements
    var flashMessages = document.querySelectorAll('.alert');

    // Loop through each flash message and hide it after 3 seconds
    flashMessages.forEach(function (flashMessage) {
        setTimeout(function () {
            flashMessage.style.display = 'none';
        }, 3000); // 3000 milliseconds = 3 seconds
    });
});