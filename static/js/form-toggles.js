
document.addEventListener("DOMContentLoaded", function() {
    const moreInfoCheckbox = document.querySelector("input[name='more_info']");
    const moreInfoFields = document.querySelectorAll(".more-info");

    // стартове налаштування при завантаженні сторінки
    moreInfoFields.forEach(field => field.style.display = moreInfoCheckbox.checked ? "block" : "none");

    // Обробник подій для чекбоксу
    moreInfoCheckbox.addEventListener("change", function() {
        moreInfoFields.forEach(field => {
            field.style.display = this.checked ? "block" : "none";
        });
    });
});

