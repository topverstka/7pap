// #region library
// Служебные переменные
const d = document;
const body = document.querySelector("body");

// Служебные функции

function copyToClipboard(element) {
  var clipboardStorage = document.createElement("input");
  document.querySelector("body").appendChild(clipboardStorage);
  clipboardStorage.setAttribute("value", element.innerText);
  clipboardStorage.select();
  document.execCommand("copy");
  clipboardStorage.remove();
}
// Get os class for body. It used to fix macos scrollbar issue
let os = "unknown";
if (navigator.appVersion.indexOf("Win") != -1) os = "windows";
if (navigator.appVersion.indexOf("Mac") != -1) os = "macos";
if (navigator.appVersion.indexOf("X11") != -1) os = "unix";
if (navigator.appVersion.indexOf("Linux") != -1) os = "linux";
document.body.classList.add("os-" + os);

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

// #region modal
// Открытие модального окна, если в url указан его id
openModalHash();
function openModalHash() {
  if (window.location.hash) {
    const hash = window.location.hash.substring(1);
    const modal = document.querySelector(`.modal#${hash}`);

    if (modal) {
      modal.classList.add("_show");
      bodyLock(true);
      closeWhenClickingOnBg(`#${hash} .modal__content`, modal);
    }
  }
}

// Закрытие модальных окон при клике по крестику
closeModalWhenClickingOnCross();
function closeModalWhenClickingOnCross() {
  const modalElems = document.querySelectorAll(".modal");
  for (let i = 0; i < modalElems.length; i++) {
    const modal = modalElems[i];
    const closeThisModal = modal.querySelector(".modal__close");

    closeThisModal.addEventListener("click", () => {
      modal.classList.remove("_show");
      bodyLock(false);
      resetHash();
    });
  }
}

// Закрытие модальных окон при нажатии по клавише ESC
closeModalWhenClickingOnESC();
function closeModalWhenClickingOnESC() {
  const modalElems = document.querySelectorAll(".modal");
  for (let i = 0; i < modalElems.length; i++) {
    const modal = modalElems[i];

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        modal.classList.remove("_show");
        bodyLock(false);
        resetHash();
      }
    });
  }
}

// Сброс id модального окна в url
function resetHash() {
  const windowTop = window.pageYOffset;
  window.location.hash = "";
  window.scrollTo(0, windowTop);
}

// Открытие модальных окон
openModal();
function openModal() {
  const btnsOpenModal = document.querySelectorAll("[data-modal-open]");
  const btnsCloseModal = document.querySelectorAll("[data-modal-close]");

  for (let i = 0; i < btnsOpenModal.length; i++) {
    const btn = btnsOpenModal[i];

    btn.addEventListener("click", (e) => {
      const dataBtn = btn.dataset.modalOpen;
      const modalThatOpens = document.querySelector(`#${dataBtn}`);

      btn.classList.add("modal-show");
      modalThatOpens.classList.add("_show");
      bodyLock(true);
      closeWhenClickingOnBg(`#${dataBtn} .modal__content`, modalThatOpens);
      window.location.hash = dataBtn;
    });
  }

  btnsCloseModal.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const dataBtn = btn.dataset.modalClose;
      const modalThatCloses = document.querySelector(`#${dataBtn}`);

      btn.classList.remove("modal-show");
      modalThatCloses.classList.remove("_show");
      bodyLock(false);
      resetHash();
    });
  });
}

// Закрытие модального окна при клике по заднему фону
function closeWhenClickingOnBg(itemArray, itemParent, classShow = "_show") {
  document.addEventListener("click", (e) => {
    let itemElems = document.querySelectorAll(itemArray);

    for (let i = 0; i < itemElems.length; i++) {
      const item = itemElems[i];

      const target = e.target,
        itsItem = target == item || item.contains(target),
        itemIsShow = item.classList.contains(classShow);

      if (itemParent) {
        const itsItemParent =
            target == itemParent || itemParent.contains(target),
          itemParentIsShow = itemParent.classList.contains(classShow);

        if (!itsItem && itsItemParent && itemParentIsShow) {
          itemParent.classList.remove(classShow);

          if (body.classList.contains("_lock")) {
            bodyLock(false);
          }

          if (window.location.hash === "#" + itemParent.getAttribute("id")) {
            resetHash();
          }
        }
      } else {
        if (!itsItem && itemIsShow) {
          item.classList.remove(classShow);
          if (body.classList.contains("_lock")) {
            bodyLock(false);
          }

          if (window.location.hash === "#" + itemParent.getAttribute("id")) {
            resetHash();
          }
        }
      }
    }
  });
}
// #endregion modal

// #region inputplaceholder
// @inputPlaceholders
const inputFields = document.querySelectorAll(".input");

function unblurInput(input, placeholder) {
  if (input.value.length === 0) {
    placeholder.classList.remove("active");
  }
}
function checkInputContent(input, placeholder) {
  if (input.value !== "") {
    if (!placeholder.classList.contains("active")) {
      placeholder.classList.add("active");
    }
    return;
  }
}

function makeInputActive(input) {
  if (input.classList.contains("input__placeholder--inited")) {
    return;
  }

  const placeholder = input.parentElement.querySelector(".input__placeholder");
  input.addEventListener("focus", () => {
    if (!placeholder) return;

    placeholder.classList.add("active");
  });

  if (placeholder) {
    input.classList.add("input__placeholder--inited");
    input.addEventListener("blur", () => {
      checkInputContent(input, placeholder);
      unblurInput(input, placeholder);
    });
    input.addEventListener("change", () =>
      checkInputContent(input, placeholder)
    );
    input.addEventListener("input", () => {
      // console.log("input", input.value.length);
      checkInputContent(input, placeholder);
    });
  }
  input.focus();
  input.blur();
  checkInputContent(input, placeholder);
}
if (inputFields) {
  inputFields.forEach((input) => {
    makeInputActive(input);
    input.blur();
  });
}
// #endregion inputplaceholder

// #region inputmask

function updateTelPlaceholder(input, mask, placeholderMask) {
  const stringStart = "+7(";
  const phoneCountryCode = 3;
  const placeholderChar = "x";
  const openDim = '<span class="input__placeholder-dimmed">';
  const closeDim = "</span>";
  const value = input.value.slice(phoneCountryCode);
  let maskSymbols = value.split("");
  let isDimOpened = false;

  maskSymbols.forEach((symbol, index) => {
    if (symbol === placeholderChar && !isDimOpened) {
      isDimOpened = true;
      maskSymbols[index] = openDim + placeholderChar;
    }
  });
  maskSymbols.push(closeDim);

  placeholderMask.innerHTML = stringStart + maskSymbols.join("");
}
(() => {
  var phoneInputs = document.querySelectorAll('.input[type="tel"]');
  var maskOptions = {
    mask: "+{7}(000) 000-00-00",
    // lazy: true,
    placeholderChar: "x",
    lazy: false,
    // placeholder: {
    // show: "always",
    // },
  };
  phoneInputs.forEach(function (input) {
    var mask = new IMask(input, maskOptions);
    let placeholderMask = document.createElement("div");
    placeholderMask.classList.add("input--tel-mask");
    input.parentElement.appendChild(placeholderMask);

    input.addEventListener("input", () => {
      updateTelPlaceholder(input, mask, placeholderMask);
    });
    updateTelPlaceholder(input, mask, placeholderMask);
  });
})();
// #endregion inputmask

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
  if (sliderOurServices) desktopSlider();
});

// #region b_team
let teamSlider = document.querySelector(".b_team");
let teamSwiper;
if (teamSlider) {
  (() => {
    function desktopSlider() {
      if (
        window.innerWidth > 992 &&
        teamSlider.querySelector(".b_team-slider").dataset.desktop === "false"
      ) {
        teamSwiper = new Swiper(".b_team-slider", {
          slidesPerView: "auto",
          // spaceBetween: 52,
        });

        const teamNext = document.querySelector(".b_team-slider__arrow--next");
        const teamPrev = document.querySelector(".b_team-slider__arrow--prev");
        teamNext.addEventListener("click", () => {
          window.scrollTo({
            top: window.pageYOffset + 600,
            behavior: "smooth",
          });
        });
        teamPrev.addEventListener("click", () => {
          window.scrollTo({
            top: window.pageYOffset - 600,
            behavior: "smooth",
          });
        });
      }
      teamSlider.dataset.desktop = "true";

      if (window.innerWidth < 993) {
        teamSlider.dataset.desktop = "false";

        if (teamSlider.classList.contains("swiper-initialized")) {
          teamSwiper.destroy();
        }
      }
    }
    if (teamSlider) desktopSlider();

    window.addEventListener("resize", () => {
      if (teamSlider) desktopSlider();
    });
  })();
}
// #endregion b_team

// #region js-horizontal

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
    let trackOffset = +scrollItem.dataset.scrollOffset;
    let trackOffsetModifier = window.innerHeight / 3;

    if (window.innerHeight < 900) {
      trackOffset = window.innerHeight / 3 + 120;
    }
    if (window.innerHeight < 700) {
      trackOffset = window.innerHeight / 3 + 200;
    }
    // if (isNaN(trackOffset) || window.innerHeight > 900) {
    // trackOffset = 100;
    // trackOffset = -(window.innerHeight - trackOffsetModifier) / 2;
    // }
    if (scrollItem.classList.contains("b_team")) {
      trackOffset = 0;
      if (window.innerHeight < 900) {
        trackOffset = 120;
      }
      if (window.innerHeight < 700) {
        trackOffset = 220;
      }
    }

    const length = $blocks.length;
    const itemWidth = 100 / length;

    $track.attr("id", `horizontal-track-${i}`);

    let scrollDuration;
    // Ширина трэка и слайдов
    if (scrollItem.dataset.speed == "slow") {
      $track.css("width", `${itemWidth * length + 2}%`);
      scrollDuration = "270%";
    } else {
      $track.css("width", `${100 * length}%`);
      scrollDuration = "80%";
    }
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
      duration: scrollDuration,
      // duration: length * itemWidth - 20 + "%",
      offset: trackOffset,
    })
      .setPin(scrollItem)
      .setTween(wipeAnimation)
      .addTo(controller);
  });
}

if (window.matchMedia("(min-width: 993px)").matches) {
  horizontalBlocksScroll();
}
// #endregion js-horizontal

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
  ".cases-filter__industries--clickable .cases-filter__industry"
);
const casesFilterMore = document.querySelector(
  ".cases-filter__industries-more"
);
const casesFilterDropdown = document.querySelector(
  ".cases-filter__industries-dropdown"
);

if ([...casesFilterIndustries].length > 0) {
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
        // item.classList.remove("cases-filter__industry--active");
      });
      industry.classList.toggle("cases-filter__industry--active");

      if (industry.classList.contains("cases-filter__industry--total")) {
        casesFilterIndustries.forEach((industry) => {
          industry.classList.remove("cases-filter__industry--active");
          if (industry.classList.contains("cases-filter__industry--total")) {
            industry.classList.add("cases-filter__industry--active");
          }
        });
      } else {
        casesFilterIndustriesInner
          .querySelector(".cases-filter__industry--total")
          .classList.remove("cases-filter__industry--active");
      }
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
      document
        .querySelector(".cases-filter__industries")
        .getBoundingClientRect().width - 160;
    let filtersWidth = document
      .querySelector(".cases-filter__industries-inner")
      .getBoundingClientRect().width;
    let filtersToSkip = [];
    casesFilterIndustries.forEach((item, index, arr) => {
      // Чтобы убрать все большие кнопки, которые больше половины
      if (item.innerText.length > 16) {
        filtersToSkip.push(item);
        // console.log("Сразу убрать", item.innerText);
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
}

// Анимация для блока с кейсами при скролле
const casesScrollBlock = document.querySelector(".cases");
if (casesScrollBlock) {
  if (
    window.matchMedia("(min-width: 992px)").matches &&
    !document.body.classList.contains("_lock")
  ) {
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
          document
            .querySelector(".cases__list-preview")
            .classList.add("_width");
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

// #region validators
function validateInputText(input) {
  if (input.value == "") {
    return changeInutState(input, "invalid");
  } else {
    return changeInutState(input, "valid");
  }
}
const textInputs = document.querySelectorAll('.input[type="text"]');
textInputs.forEach((input) => {
  input.addEventListener("input", () => {
    validateInputText(input);
  });
});

function validateCheckbox(checkbox) {
  if (checkbox.checked) {
    checkbox.parentElement.classList.remove("input--invalid");
    return true;
  } else {
    checkbox.parentElement.classList.add("input--invalid");
    return false;
  }
}
document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
  checkbox.addEventListener("change", function () {
    validateCheckbox(checkbox);
  });
});

const telephoneInputs = document.querySelectorAll('input[type="tel"]');
// telephoneInputs.forEach((input) => {
//   input.addEventListener("input", () => {
//     if (input.value != "+") {
//       input.value = "+" + input.value.replace(/[^\d]/g, "");
//       if (input.value.length > 8) {
//         validatePhone(input);
//       }
//     } else if (input.value == "+") {
//       input.value = "";
//     }
//   });
// });

function changeInutState(input, state) {
  if (state == "invalid") {
    input.classList.add("input--invalid");
    input.parentElement.classList.add("input__wrap--invalid");
    if (input.parentElement.querySelector(".error-text")) {
      input.parentElement
        .querySelector(".error-text")
        .classList.add("error-text--visible");
    }
    return false;
  } else if (state == "valid") {
    input.classList.remove("input--invalid");
    input.parentElement.classList.remove("input__wrap--invalid");
    if (input.parentElement.querySelector(".error-text")) {
      input.parentElement
        .querySelector(".error-text")
        .classList.remove("error-text--visible");
    }
    return true;
  }
}
function validatePhone(input) {
  if (input.value == "" || input.value.length < 8 || input.value.length > 18) {
    return changeInutState(input, "invalid");
  } else {
    return changeInutState(input, "valid");
  }
}
function validateEmail(input) {
  // regex validate email
  if (
    input.value == "" ||
    !input.value.match(
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    )
  ) {
    return changeInutState(input, "invalid");
  } else {
    return changeInutState(input, "valid");
  }
}

const phones = document.querySelectorAll(".js-click-copy");
phones.forEach((phone) => {
  phone.addEventListener("click", (event) => {
    if (window.innerWidth < 1024) return;
    event.preventDefault();
    copyToClipboard(phone);
    let phoneNumber = phone.innerText;
    // let copiedText = phone.dataset.clickedText;
    let copiedText = "Скопировано!";
    phone.innerText = copiedText;
    setTimeout(() => {
      phone.innerText = phoneNumber;
    }, 5000);
  });
});

function validateInput(input) {
  if (input.disabled || !input.classList.contains("required")) return;

  if (input.type === "tel") {
    validatePhone(input);
  }
  if (input.type === "text") {
    validateInputText(input);
  }
  if (input.type === "email") {
    validateEmail(input);
  }
}

// #endregion validators

// #region form
const forms = document.querySelectorAll(".form");
forms.forEach((form) => {
  // Validate on Blur
  form.querySelectorAll("input").forEach((input) => {
    input.addEventListener("blur", () => {
      validateInput(input);
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    form.querySelectorAll("input").forEach((input) => {
      validateInput(input);
    });

    let invalidInputs = [...form.querySelectorAll(".input--invalid")];
    if (invalidInputs.length === 0) {
      console.log("valid");
      document.querySelector(".modal-callback__form").classList.add("_sent");
      document.querySelector(".modal-callback__thanks").classList.add("_sent");
      document.querySelector(".modal-callback").classList.add("_sent");
    } else {
      console.log("invalid");
    }
  });
});
// #endregion form

const caseHeroFull = document.querySelector(".case-hero--full");
if (caseHeroFull) {
  const movableContainer = caseHeroFull.querySelector(".container");
  const story = document.querySelector(".case__story");

  // if current scroll less then height of the screen

  function moveCaseHero() {
    if (window.pageYOffset < story.offsetTop / 2) {
      // movableContainer.style.transform =
      //   "translateY(" + window.pageYOffset / 10 + "px)";
      story.style.transform = "translateY(-" + window.pageYOffset + "px)";
      story.style.marginBottom = "-" + window.pageYOffset + "px";
    } else {
      // movableContainer.style.transform = "translateY(0)";
    }
    console.log("scrooool");
  }

  window.addEventListener("scroll", moveCaseHero, {
    capture: true,
    passive: true,
  });
}
