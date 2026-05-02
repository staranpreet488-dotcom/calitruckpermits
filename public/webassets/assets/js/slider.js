var swiper = new Swiper(".ticketSlide", {
    slidesPerView: 1,
    spaceBetween: 10,
    navigation: {
        nextEl: ".sti_right",
        prevEl: ".sti_left",
    },
    breakpoints: {
        640: {
            slidesPerView: 2,
            spaceBetween: 20,
        },
        768: {
            slidesPerView: 3,
            spaceBetween: 40,
        },
        1024: {
            slidesPerView: 4,
            spaceBetween: 50,
        },
    },
});
var swiper = new Swiper("#t-shirtSlide", {
    slidesPerView: 1,
    spaceBetween: 0,
    navigation: {
        nextEl: ".tsti_right",
        prevEl: ".tsti_left",
    },
    breakpoints: {
        640: {
            slidesPerView: 2,
            spaceBetween: 0,
        },
        768: {
            slidesPerView: 3,
            spaceBetween: 5,
        },
        1024: {
            slidesPerView: 2.7,
            spaceBetween: 10,
        },
    },
});