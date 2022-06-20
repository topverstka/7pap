let swiperOptions = {
  loop: true,
  autoplay: {
    delay: 1,
    disableOnInteraction: false,
  },
  slidesPerView: "auto",
  speed: 5000,
  grabCursor: true,
  mousewheelControl: true,
  spaceBetween: 52,
};

let casesLtr = new Swiper(".cases__list--row-ltr", swiperOptions);
let casesRtl = new Swiper(".cases__list--row-rtl", swiperOptions);
