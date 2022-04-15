// Служебные переменные
const d = document;
const body = document.querySelector('body');

// Служебные функции
function find(selector) {
    return document.querySelector(selector);
}

function findAll(selectors) {
    return document.querySelectorAll(selectors);
}

// Удаляет у всех элементов items класс itemClass
function removeAll(items, itemClass) {
    if (typeof items == 'string') {
        items = document.querySelectorAll(items)
    }
    for (let i = 0; i < items.length; i++) {
        const item = items[i]
        item.classList.remove(itemClass)
    }
}

function bodyLock(con) {
    if (con === true) {
        body.classList.add('_lock');
    } else if (con === false) {
        body.classList.remove('_lock');
    } else if (con === undefined) {
        if (!body.classList.contains('_lock')) {
            body.classList.add('_lock');
        } else {
            body.classList.remove('_lock')
        }
    } else {
        console.error('Неопределенный аргумент у функции bodyLock()')
    }
}

// Мобильное меню
const header = document.querySelector('.header');
const hamburger = document.querySelector('.menu-wrapper');
const hamburgerLine = document.querySelector('.hamburger-menu');
const modalMobile = document.querySelector('.modal-mobile');
const modalMobileWrapper = modalMobile.querySelector('.modal-mobile__wrapper');
const modalMobileMenu = document.querySelector('.modal-mobile__menu');
const modalMobileFooterMenu = document.querySelector('.modal-mobile__footer-menu');

hamburger.addEventListener('click', () => {
    body.classList.toggle('_lock');

    if (modalMobile.classList.contains('_show')) {
        modalMobile.classList.remove('_show');
        hamburgerLine.classList.remove('animate');
        setTimeout(() => {
            header.classList.remove('no-fixed');
            modalMobile.classList.add('opacity');
        }, 350);

        setTimeout(() => {
            modalMobileWrapper.classList.add('active_wrap')
        }, 450);

    } else {
        header.classList.add('no-fixed');
        modalMobile.classList.add('_show');
        hamburgerLine.classList.add('animate');
        modalMobile.classList.remove('opacity');
        modalMobileWrapper.classList.remove('active_wrap');
    }

    document.addEventListener('click', (e) => {
        const target = e.target
        if (modalMobile && target.classList.contains('modal-mobile__wrapper')) {
            modalMobile.classList.remove('_show');
            hamburgerLine.classList.remove('animate');
            setTimeout(() => {
                header.classList.remove('no-fixed');
                modalMobile.classList.add('opacity');
            }, 350);

            setTimeout(() => {
                modalMobileWrapper.classList.add('active_wrap')
            }, 450);
            setTimeout(() => {

                body.classList.remove('_lock');
            }, 10)
        };
    })
});

// Слайдер Наши услуги на главной
const sliderOurServices = find('.slider-our-services__slider');

let ourServicesSlider;

function desktopSlider() {
    if (window.innerWidth < 993 && sliderOurServices.dataset.desktop === 'false') {
        ourServicesSlider = new Swiper(sliderOurServices, {
            slidesPerView: 3,
            spaceBetween: 52,

            breakpoints: {
                1190: {
                    slidesPerView: 3
                },

                768: {
                    slidesPerView: 2
                }
            },
        });

        sliderOurServices.dataset.desktop = 'true';
    }

    if (window.innerWidth < 993) {
        sliderOurServices.dataset.desktop = 'false';

        if (sliderOurServices.classList.contains('swiper-initialized')) {
            ourServicesSlider.destroy();
        }
    }
}

if (sliderOurServices) desktopSlider();

window.addEventListener('resize', () => {
    desktopSlider();
});

const $scrollElem = $('.js-horizontal')

const WINDOW_HEIGHT = $(window).height()
const WINDOW_WIDTH = $(window).width()

// export
function horizontalBlocksScroll() {
  if ($scrollElem.length === 0) return;

  $scrollElem.each((i, scrollItem) => {
    $(scrollItem).addClass('horizontal_initialized')
    const $blocks = $(scrollItem).find('.js-horizontal-block')
    const $track = $(scrollItem).find('.js-horizontal-track')

    const length = $blocks.length
    const itemWidth = 100 / length

    $track.attr('id', `horizontal-track-${i}`)

    // Ширина трэка и слайдов
    $track.css('width', `${100 * length}%`)
    $blocks.each((i, block) => $(block).css('width', `${itemWidth}%`))

    let wipeAnimation = new TimelineMax()
    for (let i = 1; i < length; i++) {
      wipeAnimation.to($track, 0.2, { x: `-${itemWidth * i}%` })
    }

    const controller = new ScrollMagic.Controller()

    // Инициализация сцены
    new ScrollMagic.Scene({
      triggerElement: scrollItem,
      triggerHook: 'onLeave',
      duration: '200%',
      offset: 100,
    })
      .setPin(scrollItem)
      .setTween(wipeAnimation)
      .addTo(controller)
  })
}

if (window.matchMedia('(min-width: 993px)').matches) {
    horizontalBlocksScroll();
}

// Секция Наша сила
const ourStrengthCounterPlus = find('.our-strength__item.counter--plus');
const ourStrengthCounterMinus = find('.our-strength__item.counter--minus');
const ourStrengthItemsHidden = findAll('.our-strength__item.hidden');

if (ourStrengthCounterPlus && ourStrengthItemsHidden) {
    ourStrengthCounterPlus.addEventListener('click', () => {
        ourStrengthCounterPlus.style.display = 'none';
        ourStrengthCounterMinus.classList.add('active');

        ourStrengthCounterMinus.addEventListener('click', () => {
            ourStrengthCounterMinus.classList.remove('active');
            ourStrengthCounterPlus.style.display = 'block';

            ourStrengthItemsHidden.forEach(item => {
                item.classList.add('hidden');
            });
        });

        ourStrengthItemsHidden.forEach(item => {
            item.classList.remove('hidden');
        });
    });
}

// Слайдер с отзывами на главной
const sliderReviews = find('.slider-reviews__slider');

const reviewsSlider = new Swiper(sliderReviews, {
    pagination: {
        el: ".slider-reviews__pagination",
        type: "fraction",
    },
    navigation: {
        nextEl: ".slider-reviews__next",
        prevEl: ".slider-reviews__prev",
    },
});

// Анимация для блока с кейсами при скролле
if (window.matchMedia('(min-width: 992px)').matches) {
    let flage = false;
    let ulList = document.querySelector('.cases__list');
    let elementObserver = document.querySelector('.promo__text');
    ulList.insertAdjacentHTML('beforebegin', '<ul class="cases__list-preview"></ul>')
    ulList.querySelectorAll('li').forEach((i, index) => {
        if (index < 2) {
            i.remove();
            document.querySelector('.cases__list-preview').insertAdjacentHTML('afterbegin', i.outerHTML);
        }
    });
    document.querySelectorAll('.cases__list-preview li > div').forEach(i => i.removeAttribute('class'));

    let indent = 27;
    let indicator = new WheelIndicator({
        elem: document.querySelector('body'),
        callback: function(e) {
            if (e.direction === 'down') {
                window.scrollTo({
                    top: elementObserver.offsetTop - indent,
                    left: 0,
                    behavior: 'smooth'
                });
                document.querySelector('.cases__list-preview').classList.add('_width');
                indicator.turnOff();
            }

            if (e.direction === 'up') {
                window.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: 'smooth'
                });
                document.querySelector('.cases__list-preview').classList.remove('_width');
            }
        }
    });

    window.addEventListener('wheel', function(e) {
        if (Math.sign(e.deltaY) === 1) {
            if (window.pageYOffset >= elementObserver.offsetTop - indent) {
                indicator.turnOff();
            }
        }
    });

    window.addEventListener('scroll', function(e) {
        if (elementObserver.offsetTop <= window.pageYOffset) {
            flage = true;
            indicator.turnOff();
            document.querySelector('.cases__list-preview').classList.add('_width');
        } else {
            indicator.turnOn();

            if (flage) {
                window.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: 'smooth'
                });

                flage = false;
                document.querySelector('.cases__list-preview').classList.remove('_width');
            }
        }
    });
}

// Прокрутка страницы вверх
const scrollTop = find('.scroll-top');

scrollTop.addEventListener('click', (event) => {
    event.preventDefault();

    const id = scrollTop.getAttribute('href').substring(1);
    const section = d.getElementById(id);

    if (section) {
        seamless.scrollIntoView(section, {
            behavior: "smooth",
            block: "start",
            inline: "center",
        });
    }
});

/*
const swiper = new Swiper('.swiper-container', {
  
  slidesPerView: 1, // Кол-во показываемых слайдов
  spaceBetween: 0, // Расстояние между слайдами
  loop: true, // Бесконечный слайдер
  freeMode: true, // Слайдеры не зафиксированны
  centeredSlides: false, // Размещать слайдеры по центру

  autoplay: { // автопрокрутка
      delay: 5000, // задержка
  },

  breakpoints: {
    1200: {

    },
    700: {

    },
    400: {

    }
  },

  pagination: {
    el: '.swiper-pagination',
  },

  navigation: {
    nextEl: '.swiper__arrow-next',
    prevEl: '.swiper__arrow-prev',
  },

  scrollbar: {
    el: '.swiper-scrollbar',
  },
});
*/

// Валидация формы
function validationForm() {
    const name = find('#user_name')
    const phone = find('#user_phone')
    const email = find('#user_email')

    let con = true

    for (let i = 0; i < [name, phone, email].length; i++) {
        const elem = [name, phone, email][i];
        const elemValue = elem.value.trim()

        if (elemValue === '') {
            elem.classList.add('_error')
            con = false
        } else {
            elem.classList.remove('_error')
            con = true
        }
    }

    return con
}

// Отправка формы
// sumbitForm()

function sumbitForm() {
    const form = find('.modal__form')

    form.addEventListener('submit', async e => {
        const modal = find('.modal._show')
        const btnSend = form.querySelector('[type=submit]')
        btnSend.classList.add('send-preloader')

        e.preventDefault()

        let con = validationForm()

        if (con === true) {
            const formData = new FormData()
            const action = form.getAttribute('action')

            let response = await fetch(action, {
                method: 'POST',
                body: formData
            })

            // settimeout здесь для того, чтобы показать работу отправки формы. В дальнейшем это нужно убрать
            setTimeout(() => {
                if (response.ok) {
                    console.log('Successful')
                    form.reset()

                    modal.classList.remove('_show')
                    find('#send-done').classList.add('_show')
                    btnSend.classList.remove('send-preloader')
                } else {
                    console.log('Error')
                    form.reset()

                    modal.classList.remove('_show')
                    find('#send-error').classList.add('_show')
                    btnSend.classList.remove('send-preloader')
                }
            }, 2000)

        }
    })
}

// Мобильное меню
// menu()
function menu() {
    const burger = find('.burger')
    const menu = find('.menu');

    // Высота меню
    window.addEventListener('resize', () => {
        const headerHeight = find('.header').clientHeight

        if (window.innerWidth <= 768) {
            menu.style.paddingTop = headerHeight + 'px'
        } else {
            menu.style.paddingTop = 0
        }
    })

    burger.addEventListener('click', (e) => {
        burger.classList.toggle('burger_close')
        menu.classList.toggle('_show')
        bodyLock()
    })
}

// Функции для модальных окон
modal()

function modal() {
    // Открытие модальных окон при клике по кнопке
    openModalWhenClickingOnBtn()

    function openModalWhenClickingOnBtn() {
        const btnsOpenModal = document.querySelectorAll('[data-modal-open]');

        for (let i = 0; i < btnsOpenModal.length; i++) {
            const btn = btnsOpenModal[i];

            btn.addEventListener('click', (e) => {
                const dataBtn = btn.dataset.modalOpen;
                const modal = document.querySelector(`#${dataBtn}`)

                openModal(modal)
                window.location.hash = dataBtn
            });
        }
    }

    // Открытие модального окна, если в url указан его id
    openModalHash()

    function openModalHash() {
        if (window.location.hash) {
            const hash = window.location.hash.substring(1)
            const modal = document.querySelector(`.modal#${hash}`)

            if (modal) openModal(modal)
        }
    }

    // Показываем/убираем модальное окно при изменения хеша в адресной строке
    checkHash()

    function checkHash() {
        window.addEventListener('hashchange', e => {
            const hash = window.location.hash
            const modal = document.querySelector(`.modal${hash}`)

            if (find('.modal._show')) find('.modal._show').classList.remove('_show')
            if (modal && hash != '') openModal(modal)
        })
    }

    // Закрытие модального окна при клике по заднему фону
    closeModalWhenClickingOnBg()

    function closeModalWhenClickingOnBg() {
        document.addEventListener('click', (e) => {
            const target = e.target
            const modal = document.querySelector('.modal._show')

            if (modal && target.classList.contains('modal__body')) closeModal(modal)
        })
    }

    // Закрытие модальных окон при клике по крестику
    closeModalWhenClickingOnCross()

    function closeModalWhenClickingOnCross() {
        const modalElems = document.querySelectorAll('.modal')
        for (let i = 0; i < modalElems.length; i++) {
            const modal = modalElems[i];
            const closeThisModal = modal.querySelector('.modal__close')

            closeThisModal.addEventListener('click', () => {
                closeModal(modal)
            })
        }
    }

    // Закрытие модальных окон при нажатии по клавише ESC
    closeModalWhenClickingOnESC()

    function closeModalWhenClickingOnESC() {
        const modalElems = document.querySelectorAll('.modal')
        for (let i = 0; i < modalElems.length; i++) {
            const modal = modalElems[i];

            document.addEventListener('keydown', e => {
                if (e.key === 'Escape') closeModal(modal)
            })
        }
    }

    // Сброс id модального окна в url
    function resetHash() {
        const windowTop = window.pageYOffset
        window.location.hash = ''
        window.scrollTo(0, windowTop)
    }

    // Открытие модального окна
    function openModal(modal) {
        modal.classList.add('_show')
        bodyLock(true)
    }

    // Закрытие модального окна
    function closeModal(modal) {
        modal.classList.remove('_show')
        bodyLock(false)
        resetHash()
    }
}