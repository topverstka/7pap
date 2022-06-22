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

const casesLtrClass = ".cases__list--row-ltr";
const casesRtlClass = ".cases__list--row-rtl";
const ltrWrapper = document
  .querySelector(casesLtrClass)
  .querySelector(".cases__list-wrapper");
const rtlWrapper = document
  .querySelector(casesRtlClass)
  .querySelector(".cases__list-wrapper");

if (window.innerWidth > 1099) {
  let casesLtr = new Swiper(casesLtrClass, swiperOptions);
  let casesRtl = new Swiper(casesRtlClass, swiperOptions);
} else {
  ltrWrapper.classList.remove("swiper-wrapper");
  rtlWrapper.classList.remove("swiper-wrapper");
}
