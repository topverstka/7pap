
// Служебные переменные
const d = document;
const body = document.querySelector('body');

// Служебные функции
function find(selector) {
	return document.querySelector(selector)
}

function findAll(selectors) {
	return document.querySelectorAll(selectors)
}

// Удаляет у всех элементов items класс itemClass
function removeAll(items,itemClass) {   
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
		}
		else {
			body.classList.remove('_lock')
		}
	} else {
		console.error('Неопределенный аргумент у функции bodyLock()')
	}
}

// Мобильное меню
const hamburger = document.querySelector('.hamburger');
const modalMobile = document.querySelector('.modal-mobile');
const modalMobileWrapper = modalMobile.querySelector('.modal-mobile__wrapper');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('_toggle');
    body.classList.toggle('_lock');

    if (modalMobile.classList.contains('_show')) {
        modalMobile.classList.remove('_show');
    } else {
        modalMobile.classList.add('_show');
    }

    document.addEventListener('click', (e) => {
        const target = e.target
        if (modalMobile && target.classList.contains('modal-mobile__wrapper')) {
            hamburger.classList.remove('_toggle');
            modalMobile.classList.remove('_show')
            body.classList.remove('_lock');
        };
    })
});

// Слайдер на главной
const sliderOurServices = document.querySelector('.slider-our-services__slider');

let ourServicesSlider;

function desktopSlider() {
    if (window.innerWidth > 767 && sliderOurServices.dataset.desktop == 'false') {
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

    if (window.innerWidth < 768) {
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

// Анимацию про скролле
// const casesItem1 = document.querySelector('.cases__list li:first-child');
// const casesItem2 = document.querySelector('.cases__list li:nth-child(2)');
// const casesSection = document.querySelector('.cases');

// if (window.matchMedia('(min-width: 1220px)').matches) {
//     window.addEventListener('scroll', () => {
//         const heightWindows = window.scrollY;

//         if (heightWindows > 100) {
//             casesItem1.style.transform = 'translate(0) scale(1)';
//             casesItem2.style.transform = 'translate(0) scale(1)';
//         }
//     });   
// }

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
                }
                else {
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
		}
		else {
			menu.style.paddingTop = 0
		}
	})

	burger.addEventListener('click', (e) => {
		burger.classList.toggle('burger_close')
		menu.classList.toggle('_show')
		bodyLock()
	})
}

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