document.addEventListener("DOMContentLoaded", function() {
    const moreInfoCheckbox = document.querySelector("input[name='more_info']");
    const moreInfoGroups = document.querySelectorAll(".more-info .form-group"); // Селектор для груп полів

    // Стартове налаштування при завантаженні сторінки
    moreInfoGroups.forEach(group => group.style.display = moreInfoCheckbox.checked ? "block" : "none");

    // Обробник подій для чекбоксу
    moreInfoCheckbox.addEventListener("change", function() {
        moreInfoGroups.forEach(group => {
            group.style.display = this.checked ? "block" : "none";
        });
    });
});
