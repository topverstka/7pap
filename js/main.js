// #region library
// Служебные переменные
const d = document;
const body = document.querySelector("body");

// Служебные функции
function find(selector) {
  return document.querySelector(selector);
}

function findAll(selectors) {
  return document.querySelectorAll(selectors);
}

// Удаляет у всех элементов items класс itemClass
function removeAll(items, itemClass) {
  if (typeof items == "string") {
    items = document.querySelectorAll(items);
  }
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    item.classList.remove(itemClass);
  }
}

// Фиксирует скрол у body
function bodyLock(con) {
  if (con === true) {
    body.classList.add("_lock");
  } else if (con === false) {
    body.classList.remove("_lock");
  } else if (con === undefined) {
    if (!body.classList.contains("_lock")) {
      body.classList.add("_lock");
    } else {
      body.classList.remove("_lock");
    }
  } else {
    console.error("Неопределенный аргумент у функции bodyLock()");
  }
}
const debounce = (callback, wait) => {
  let timeoutId = null;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback.apply(null, args);
    }, wait);
  };
};
// #endregion library

// Мобильное меню
const header = document.querySelector(".header");
const hamburger = document.querySelector(".menu-wrapper");
const hamburgerLine = document.querySelector(".hamburger-menu");
const modalMobile = document.querySelector(".modal-mobile");
const modalMobileWrapper = modalMobile.querySelector(".modal-mobile__wrapper");
const modalMobileMenu = document.querySelector(".modal-mobile__menu");
const modalMobileFooterMenu = document.querySelector(
  ".modal-mobile__footer-menu"
);

hamburger.addEventListener("click", () => {
  body.classList.toggle("_lock");

  if (modalMobile.classList.contains("_show")) {
    modalMobile.classList.remove("_show");
    hamburgerLine.classList.remove("animate");
    setTimeout(() => {
      header.classList.remove("no-fixed");
      modalMobile.classList.add("opacity");
    }, 350);

    setTimeout(() => {
      modalMobileWrapper.classList.add("active_wrap");
    }, 450);
  } else {
    header.classList.add("no-fixed");
    modalMobile.classList.add("_show");
    hamburgerLine.classList.add("animate");
    modalMobile.classList.remove("opacity");
    modalMobileWrapper.classList.remove("active_wrap");
  }

  document.addEventListener("click", (e) => {
    const target = e.target;
    if (modalMobile && target.classList.contains("modal-mobile__wrapper")) {
      modalMobile.classList.remove("_show");
      hamburgerLine.classList.remove("animate");
      setTimeout(() => {
        header.classList.remove("no-fixed");
        modalMobile.classList.add("opacity");
      }, 350);

      setTimeout(() => {
        modalMobileWrapper.classList.add("active_wrap");
      }, 450);
      setTimeout(() => {
        body.classList.remove("_lock");
      }, 10);
    }
  });
});

// Слайдер Наши услуги на главной
const sliderOurServices = find(".slider-our-services__slider");

let ourServicesSlider;

function desktopSlider() {
  if (
    window.innerWidth < 993 &&
    sliderOurServices.dataset.desktop === "false"
  ) {
    ourServicesSlider = new Swiper(sliderOurServices, {
      slidesPerView: 3,
      spaceBetween: 52,

      breakpoints: {
        1190: {
          slidesPerView: 3,
        },

        768: {
          slidesPerView: 2,
        },
      },
    });

    sliderOurServices.dataset.desktop = "true";
  }

  if (window.innerWidth < 993) {
    sliderOurServices.dataset.desktop = "false";

    if (sliderOurServices.classList.contains("swiper-initialized")) {
      ourServicesSlider.destroy();
    }
  }
}

if (sliderOurServices) desktopSlider();

window.addEventListener("resize", () => {
  desktopSlider();
});

// Горизонтальная прокрутка колесиком мыши
const $scrollElem = $(".js-horizontal");

const WINDOW_HEIGHT = $(window).height();
const WINDOW_WIDTH = $(window).width();

function horizontalBlocksScroll() {
  if ($scrollElem.length === 0) return;

  $scrollElem.each((i, scrollItem) => {
    $(scrollItem).addClass("horizontal_initialized");
    const $blocks = $(scrollItem).find(".js-horizontal-block");
    const $track = $(scrollItem).find(".js-horizontal-track");

    const length = $blocks.length;
    const itemWidth = 100 / length;

    $track.attr("id", `horizontal-track-${i}`);

    // Ширина трэка и слайдов
    $track.css("width", `${100 * length}%`);
    $blocks.each((i, block) => $(block).css("width", `${itemWidth}%`));

    // Ширина промежутка между слайдами
    const columnGap = $($track).css("column-gap");
    const gap = (parseInt(columnGap) / parseInt($($track).width())) * 100;

    let wipeAnimation = new TimelineMax();

    for (let i = 1; i < length - 1; i++) {
      wipeAnimation.to($track, 0.2, { x: `-${(itemWidth + gap) * i}%` });
    }

    const controller = new ScrollMagic.Controller();

    // Инициализация сцены
    new ScrollMagic.Scene({
      triggerElement: scrollItem,
      triggerHook: "onLeave",
      duration: "80%",
      offset: 100,
    })
      .setPin(scrollItem)
      .setTween(wipeAnimation)
      .addTo(controller);
  });
}

if (window.matchMedia("(min-width: 993px)").matches) {
  horizontalBlocksScroll();
}

// Секция Наша сила
const ourStrengthCounterPlus = find(".our-strength__item.counter--plus");
const ourStrengthItemsHidden = findAll(".our-strength__item.hidden");

if (ourStrengthCounterPlus && ourStrengthItemsHidden) {
  ourStrengthCounterPlus.addEventListener("click", () => {
    ourStrengthCounterPlus.classList.toggle("active");

    if (ourStrengthCounterPlus.classList.contains("active")) {
      ourStrengthItemsHidden.forEach((item) => {
        item.classList.remove("hidden");
      });
    } else {
      ourStrengthItemsHidden.forEach((item) => {
        item.classList.add("hidden");
      });
    }
  });
}

// Слайдер с отзывами на главной
const sliderReviews = find(".slider-reviews__slider");
const sliderReviewsName = document.querySelector(".slider-reviews__name");
const sliderVideoReviewsLink = document.querySelector(
  ".slider-reviews__link.video-reviews"
);
const sliderReviewsLink = document.querySelector(
  ".slider-reviews__link.read-more"
);

if (sliderReviews) {
  const reviewsSlider = new Swiper(sliderReviews, {
    pagination: {
      el: ".slider-reviews__pagination",
      type: "fraction",
    },
    navigation: {
      nextEl: ".slider-reviews__next",
      prevEl: ".slider-reviews__prev",
    },

    on: {
      slideChange: function (e) {
        this.$el[0]
          .querySelector(".swiper-pagination-current")
          .classList.add("add-animation");
        sliderReviewsName.classList.add("add-animation");
        const indexСurrentSlide = reviewsSlider.realIndex;
        const dataName = reviewsSlider.slides[indexСurrentSlide].dataset.name;
        const dataVideoLink =
          reviewsSlider.slides[indexСurrentSlide].dataset.videoLink;
        const dataLink = reviewsSlider.slides[indexСurrentSlide].dataset.link;
        sliderReviewsName.textContent = dataName;
        sliderVideoReviewsLink.href = dataVideoLink;
        sliderReviewsLink.href = dataLink;
      },

      activeIndexChange: function () {
        setTimeout(() => {
          this.$el[0]
            .querySelector(".swiper-pagination-current")
            .classList.remove("add-animation");
          sliderReviewsName.classList.remove("add-animation");
        }, 800);
      },
    },
  });
}

// Фильтры в кейсах
const casesFilterCategories = document.querySelectorAll(
  ".cases-filter__category"
);
const casesFilterIndustriesInner = document.querySelector(
  ".cases-filter__industries-inner"
);
const casesFilterIndustries = document.querySelectorAll(
  ".cases-filter__industry"
);
const casesFilterMore = document.querySelector(
  ".cases-filter__industries-more"
);
const casesFilterDropdown = document.querySelector(
  ".cases-filter__industries-dropdown"
);

casesFilterCategories.forEach((category) => {
  category.addEventListener("click", () => {
    casesFilterCategories.forEach((item) => {
      item.classList.remove("cases-filter__category--active");
    });
    category.classList.add("cases-filter__category--active");
  });
});
casesFilterIndustries.forEach((industry) => {
  industry.addEventListener("click", () => {
    casesFilterIndustries.forEach((item) => {
      item.classList.remove("cases-filter__industry--active");
    });
    industry.classList.add("cases-filter__industry--active");
  });
});

function moveFiltersToDropdown() {
  casesFilterIndustries.forEach((item, index) => {
    if (index === 0) return;
    casesFilterDropdown.appendChild(item);
  });
}
function moveFiltersToScrollbar() {
  casesFilterIndustries.forEach((item, index) => {
    if (index === 0) return;
    casesFilterIndustriesInner.appendChild(item);
  });
}

// Перемещает фильтры между дропдауном и скроллбаром
function relocateFilterItems() {
  let filtersMaxWidth =
    document.querySelector(".cases-filter__industries").getBoundingClientRect()
      .width - 160;
  let filtersWidth = document
    .querySelector(".cases-filter__industries-inner")
    .getBoundingClientRect().width;
  let filtersToSkip = [];
  casesFilterIndustries.forEach((item, index, arr) => {
    // Чтобы убрать все большие кнопки, которые больше половины
    if (item.innerText.length > 16) {
      filtersToSkip.push(item);
      console.log("Сразу убрать", item.innerText);
    }
  });
  casesFilterIndustries.forEach((item, index, arr) => {
    if (index === 0 || filtersToSkip.includes(item)) return;

    if (filtersWidth <= filtersMaxWidth - 100) {
      casesFilterIndustriesInner.appendChild(item);
      filtersWidth += item.getBoundingClientRect().width;
    }
  });
}

function changeFiltersPosition() {
  if (window.innerWidth < 576) {
    moveFiltersToScrollbar();
  } else {
    moveFiltersToDropdown();
  }
  relocateFilterItems();
}

window.addEventListener("resize", () => {
  debounce(changeFiltersPosition(), 200);
});
// FIX Поправь чтоб при загрузке с мобили не срабатывала перекидка, а все закидывалось в скроллбар
changeFiltersPosition();

casesFilterMore.addEventListener("click", () => {
  casesFilterDropdown.classList.toggle(
    "cases-filter__industries-dropdown--visible"
  );
});
document.addEventListener("click", (e) => {
  if (
    !e.target.closest(".cases-filter__industries-dropdown") &&
    !e.target.closest(".cases-filter__industries-more")
  ) {
    casesFilterDropdown.classList.remove(
      "cases-filter__industries-dropdown--visible"
    );
  }
});

// Анимация для блока с кейсами при скролле
if (window.matchMedia("(min-width: 992px)").matches) {
  let flage = false;
  let ulList = document.querySelector(".cases__list");
  let elementObserver = document.querySelector(".cases");
  ulList.insertAdjacentHTML(
    "beforebegin",
    '<ul class="cases__list-preview"></ul>'
  );
  ulList.querySelectorAll("li").forEach((i, index) => {
    if (index < 2) {
      i.remove();
      document
        .querySelector(".cases__list-preview")
        .insertAdjacentHTML("afterbegin", i.outerHTML);
    }
  });
  document
    .querySelectorAll(".cases__list-preview li > div")
    .forEach((i) => i.removeAttribute("class"));

  let indent = 27;
  let indicator = new WheelIndicator({
    elem: document.querySelector("body"),
    callback: function (e) {
      if (e.direction === "down") {
        window.scrollTo({
          top: elementObserver.offsetTop - indent,
          left: 0,
          behavior: "smooth",
        });
        document.querySelector(".cases__list-preview").classList.add("_width");
        indicator.turnOff();
      }

      if (e.direction === "up") {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
        document
          .querySelector(".cases__list-preview")
          .classList.remove("_width");
      }
    },
  });

  window.addEventListener("wheel", function (e) {
    if (Math.sign(e.deltaY) === 1) {
      if (window.pageYOffset >= elementObserver.offsetTop - indent) {
        indicator.turnOff();
      }
    }
  });

  window.addEventListener("scroll", function (e) {
    if (elementObserver.offsetTop <= window.pageYOffset) {
      flage = true;
      indicator.turnOff();
      document.querySelector(".cases__list-preview").classList.add("_width");
    } else {
      indicator.turnOn();

      if (flage) {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });

        flage = false;
        document
          .querySelector(".cases__list-preview")
          .classList.remove("_width");
      }
    }
  });
}

// Прокрутка страницы вверх
const scrollTop = find(".scroll-top");

scrollTop.addEventListener("click", (event) => {
  event.preventDefault();

  const id = scrollTop.getAttribute("href").substring(1);
  const section = d.getElementById(id);

  if (section) {
    seamless.scrollIntoView(section, {
      behavior: "smooth",
      block: "start",
      inline: "center",
    });
  }
});

polyfill();
