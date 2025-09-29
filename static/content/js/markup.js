// 미디어 뭐리
const mediaQuery = window.matchMedia(`(min-width: 768px)`)

// 스크롤바 width 값
const getScrollWidth = () => {
    return document.documentElement.style.setProperty('--scrollbar-width', (window.innerWidth - document.documentElement.clientWidth) + "px");
}
getScrollWidth();
mediaQuery.addEventListener('change', () => {
    return getScrollWidth();
})

// active 토글
const toggleActive = (btn, el, defaultText, afterText) => {
    btn.addEventListener('click', (e)=>{
        e.preventDefault();
        el.classList.toggle('active');
        if( el.classList.contains('active') ){
            btn.querySelector('span').innerHTML = afterText;
        } else {
            btn.querySelector('span').innerHTML = defaultText;
        }
    })
}


// 외부 클릭시 off 처리
const onClickOutside = (element, callback) => {
    document.addEventListener('click', e => {
        if( Array.isArray(element) ){
            let isIn = [];
            element.forEach((item)=>{
                isIn.push(item.contains(e.target));
            })
            if( !isIn.includes(true) ) callback();
        }
        else if (!element.contains(e.target)) callback();
    });
};

// navigation width check
const checkNavWidth = (el) => {
    let items = el.querySelectorAll('.swiper-slide'),
        elWidth = 0;
    items.forEach((item)=>{
        elWidth += item.clientWidth;
    })
    return el.style.setProperty("--nav-more-opacity", window.innerWidth < elWidth ? 1 : null);
}

// 마케팅 팝업
const modalMarketing = document.querySelector('.marketing-modal');
if( modalMarketing != null && modalMarketing.querySelectorAll('.swiper-slide').length > 1 ){
    let maketingSwiper = new Swiper(modalMarketing.querySelector('.swiper'), {
        slidesPerView: 1,
        observer: true,
        observeParents: true,
        pauseOnMouseEnter: true,
        loop: true,
        autoplay:  {
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
            delay: 10000,
        },
        pagination: modalMarketing.querySelector('.swiper-pagination') != null
            ? {
                el: modalMarketing.querySelector('.swiper-pagination'),
                type: "fraction",
                formatFractionCurrent: function (number) {
                    return ('0' + number).slice(-2);
                },
                formatFractionTotal: function (number) {
                    return ('0' + number).slice(-2);
                },
            }
            : false
        ,
        navigation: {
            // enabled: true,
            prevEl: modalMarketing.querySelector('.swiper-button-prev'),
            nextEl: modalMarketing.querySelector('.swiper-button-next'),
        },
    });
}

// banner width pause
const bannerSwiper = ( el, perview, pcGap, moGap, needLength = 2 ) => {
    if( el.querySelectorAll('.swiper-slide').length >= needLength ){
        let bannerSwiper = new Swiper(el, {
            slidesPerView: perview,
            spaceBetween: perview == 'auto' ? null : pcGap,
            observer: true,
            observeParents: true,
            centeredSlides: perview == 'auto' ? true : false,
            loop: true,
            autoplay:  {
                disableOnInteraction: false,
                delay: 10000,
            },
            pagination: el.querySelector('.swiper-pagination') != null
                ? {
                    el: el.querySelector('.swiper-pagination'),
                    type: "fraction",
                    formatFractionCurrent: function (number) {
                        return ('0' + number).slice(-2);
                    },
                    formatFractionTotal: function (number) {
                        return ('0' + number).slice(-2);
                    },
                }
                : false
            ,
            navigation: {
                // enabled: true,
                prevEl: el.querySelector('.swiper-button-prev'),
                nextEl: el.querySelector('.swiper-button-next'),
            },
            breakpoints: {
                280: {
                    slidesPerView: 1,
                    spaceBetween: moGap,
                },
                767: {
                    slidesPerView: perview,
                    spaceBetween: perview == 'auto' ? null : pcGap,
                }
            },
        });
        let isManuallyPaused = false;
        el.querySelector('.swiper-wrapper').addEventListener('mouseenter', () => {
            if (!isManuallyPaused) bannerSwiper.autoplay.stop();
        });

        el.querySelector('.swiper-wrapper').addEventListener('mouseleave', () => {
            if (!isManuallyPaused) bannerSwiper.autoplay.start();
        });

        el.querySelector('.icon-circle-pause')?.addEventListener("click", (e) => {
            e.preventDefault();
            let pauseBtn = e.target;
            if( !isManuallyPaused ) {
                bannerSwiper.autoplay.stop();
                isManuallyPaused = true;
                pauseBtn.querySelector('span').textContent = '재생';
            } else {
                bannerSwiper.autoplay.start();
                isManuallyPaused = false;
                pauseBtn.querySelector('span').textContent = '일시정지';
            }
            pauseBtn.classList.toggle('on');
        })
    }
}

// header > search
const headSearchArea = document.querySelector('.searching-area');
if( headSearchArea != null ){
    let inputEl = headSearchArea.querySelector('input[type="search"]'),
        searchedList = document.querySelector('.searching-list'),
        closeBtn = searchedList.querySelector('.searching-list-close'),
        searchedListClassList = searchedList.classList;
    inputEl.addEventListener("focusin", (e)=>{
        return searchedListClassList.contains('hidden') ? searchedListClassList.remove('hidden') : null;
    })
    closeBtn.addEventListener("click", (e)=>{
        e.preventDefault();
        return !searchedListClassList.contains('hidden') ? searchedListClassList.add('hidden') : null;
    })
    onClickOutside([document.querySelector('.searching-area'), document.querySelector('.searching-list')], () => searchedList.classList.add('hidden'));

    // mobile
    let openSearchBtn = document.querySelector('.mobile-search-open'),
        headerEl = document.querySelector('.header'),
        headerClass = headerEl.classList;

    openSearchBtn.addEventListener('click', (e)=>{
        e.preventDefault();
        return headerClass.add('mobile-search-active');
    })
    document.querySelector('.searching-area .btn-close').addEventListener("click", (e)=>{
        e.preventDefault();
        return headerClass.remove('mobile-search-active');
    })
    mediaQuery.addEventListener('change', () => {
        if( window.innerWidth > 767 && headerClass.contains('mobile-search-active') ) {
            return headerClass.remove('mobile-search-active');
        }
        return null;
    })
}

// dropbox
const headerDropbox = document.querySelectorAll('.header .manager > button, .header .to-brand .btn, .header .btn-hamburger, .header .btn-selectbox, .snb-grid aside nav button');
if( headerDropbox.length > 0 ){
    headerDropbox.forEach((el)=>{
        el.addEventListener("click", (e) => {
            e.preventDefault();
            el.classList.toggle('active');
        })
        if( !el.closest('.snb-grid') ){
            onClickOutside(el.parentElement, () => el.classList.remove('active'));
        }
    })
}

// header(main) > hamberger & menu item
const gnbDropMenu = document.querySelectorAll('.gnb .menu-item');
if( gnbDropMenu.length > 0 ){
    gnbDropMenu.forEach((menuitem)=>{
        menuitem.querySelectorAll('li').forEach((itemEl) => {
            itemEl.addEventListener('mouseenter', (e) => {
                let menuEl = e.target,
                    // depthEl = menuEl.closest('div').classList,
                    parentEl = menuEl.closest('ul'),
                    innerDepthEl = menuEl.querySelector(':scope > div');

                parentEl
                    .querySelectorAll(':scope > li > div')
                    .forEach((depth) => depth.style.display = 'none');

                if( innerDepthEl ){
                    innerDepthEl.style.display = 'block';
                }
            });
        });
        menuitem.querySelector('.depth2').addEventListener('mouseleave', (e)=>{
            e.target
                .querySelectorAll('.depth3, .depth4')
                .forEach((depth) => depth.style.display = 'none');
            menuitem.className = "menu-item"
        })
        menuitem.querySelectorAll('.depth3').forEach((depthEl)=>{
            depthEl.addEventListener('mouseleave', (e)=>{
                depthEl
                    .querySelectorAll('div')
                    .forEach((depth) => depth.style.display = 'none');
            })
        })
    })
}

// header >> gnb
// const headGnb = document.querySelectorAll('.header .swiper');
// if( headGnb.length > 0 ){
//     const buildGnbSlider = (el) => {
//         checkNavWidth(el);
//         return new Swiper(el, {
//             slidesPerView: 'auto',
//             speed: 500,
//             observer: true,
//             observeParents: true,
//             initialSlide: el.getAttribute('data-active-num') ?? 0,
//             mousewheel: {
//                 forceToAxis: true,
//             },
//         });
//     }
//     headGnb.forEach((item)=>{
//         buildGnbSlider(item);
//     })

//     const gnbD2Items = document.querySelectorAll('.depth2swiper button, .depth3swiper button');
//     if( gnbD2Items.length > 0 ){
//         gnbD2Items.forEach((btn)=>{
//             btn.addEventListener('click', (e)=>{
//                 e.preventDefault();
//                 const swiperParent = e.target.parentElement.parentElement;
//                 const nodes = [...swiperParent.children];
//                 const index = nodes.indexOf(e.target.parentElement);

//                 if( swiperParent.parentElement.classList.contains('depth3swiper') ){
//                     // 3뎁스
//                     let depth2Index = e.target.closest('.swiper').id.replace('depth3', 'depth4'),
//                         classTarget = document.querySelector(`#${depth2Index}-${index}`);

//                     if( classTarget.classList.contains('show') ){ // toggle
//                         classTarget.classList.remove('show');
//                     } else {
//                         document.querySelectorAll('.inner-nav .depth4swiper').forEach((swi)=>{ // clear
//                             swi.classList.contains('show') && swi.classList.remove('show');
//                         })
//                         classTarget.classList.add('show'); // show
//                     }


//                 } else {
//                     // 2뎁스
//                     let classListTarget2 = document.querySelector('#depth3-' + index);
//                     if( classListTarget2.classList.contains('show') ){
//                         document.querySelectorAll('.inner-nav .swiper').forEach((swi)=>{ // clear
//                             if (swi.classList.contains('show')) {
//                                 swi.classList.remove('show')
//                             };
//                         })

//                     } else {
//                         document.querySelectorAll('.inner-nav .swiper').forEach((swi)=>{ // clear
//                             swi.classList.contains('show') && swi.classList.remove('show');
//                         })
//                         classListTarget2.classList.add('show'); // show
//                     }
//                 }

//                 headGnb.forEach((item)=>{
//                     checkNavWidth(item);
//                 });
//             })
//         })
//     }
// }


// 상품리스트
const productListEls = document.querySelectorAll('.item-swiper:not(.ad-item-swiper):not(.talk-item-swiper)');
if( productListEls.length > 0 ){
    let itemInit = false;
    let itemSwiperArray = [];
    let itemSlideLength = [];

    const isMain = document.querySelector('.main') != null || document.querySelector('.brand-main-page') != null ? true : false;
    const makeProductSwiper = () => {
        const buildSlider = (el) => {
            return new Swiper(el.querySelector('.swiper'), {
                loop: true,
                slidesPerView: 5,
                spaceBetween: 20,
                speed: 500,
                observer: true,
                observeParents: true,
                simulateTouch: false,
                // noSwiping: true, // mo도 막는 코드, 홀드
                // noSwipingClass: 'prd-ctrl',
                navigation: {
                    enabled: true,
                    prevEl: el.querySelector('.swiper-button-prev'),
                    nextEl: el.querySelector('.swiper-button-next'),
                },
                breakpoints: {
                    280: {
                        slidesPerView: 2,
                        spaceBetween: 10,
                    },
                    767: {
                        slidesPerView: 5,
                        spaceBetween: 20,
                    }
                }
            });
        }

        if ( !itemInit ) {
            itemInit = true;
            productListEls.forEach((item, i)=>{
                itemSlideLength.push(item.querySelectorAll('.swiper-slide').length);
                if( itemSlideLength[i] > (window.innerWidth < 768 ? 2 : 5) ) {
                    const slider = buildSlider(item);
                    itemSwiperArray.push(slider);
                } else {
                    itemSwiperArray.push(false);
                }
            })
        // after build
        } else {
            // 일반 swiper 모두 뿌시기
            if( !isMain &&  window.innerWidth < 768 ) {
                if ( itemSwiperArray.length === 0 ) return;
                for (let i = 0; i < itemSwiperArray.length; i++) {
                    itemSwiperArray[i] != false && itemSwiperArray[i].destroy(true, true);
                }
                itemSwiperArray = [];
                itemInit = false;

            // 메인 swiper로 갯수에 따라 뿌시기
            } else if( isMain ) {
                // 모바일이 될 때
                if ( window.innerWidth < 768 ) {
                    for (let i = 0; i < productListEls.length; i++) {
                        if( itemSlideLength[i] <= 5 && itemSlideLength[i] > 2 ) {
                            itemSwiperArray[i] = buildSlider(productListEls[i]);
                        }
                    }

                // pc가 될때
                } else {
                    for ( let i=0; i<productListEls.length; i++ ) {
                        if( itemSlideLength[i] < 6 ) {
                            itemSwiperArray[i] != false && itemSwiperArray[i].destroy(true, true);
                        }
                    }
                }
            }
        }
    }
    makeProductSwiper();
    mediaQuery.addEventListener('change', () => {
        makeProductSwiper();
    })
}

// 메인 비주얼 스와이퍼
const mainVSSwiperEl = document.querySelector('.main .main-banner');
if( mainVSSwiperEl != null ){
    bannerSwiper(mainVSSwiperEl.querySelector('.swiper'), 1, 16, 0, 1 );
}
// 메인 공지사항 옆 미니 스와이퍼
const mainMiniBnSwiperEl = document.querySelector('.main .ad-banner-mini-wrap');
if( mainMiniBnSwiperEl != null ){
    bannerSwiper(mainMiniBnSwiperEl.querySelector('.swiper'), 1, 0, 0) ;
}
// 메인 사이드 스와이퍼
const mainSideBannder = document.querySelector('.side-right-top .swiper');
if( mainSideBannder != null ){
    bannerSwiper(mainSideBannder, 1, 0, 0);
}
// 메인 베너 스와이퍼
const mainSwipers = document.querySelectorAll('.main-banner-swiper-wrap, .brand-ad-banner');
if( mainSwipers.length > 0 ){
    let mainSwiperInit = false;
    let mainSwiperArray = [];
    let mainSlideMinLength = [];
    let mainSlideLength = [];
    let mainSlideMoGap = [];
    let mainSlidePcGap = [];

    const makeMainSwiper = () => {
        const buildSlider = (el, min, pcGap, moGap) => {
            return new Swiper(el.querySelector('.swiper'), {
                loop: true,
                slidesPerView: min,
                spaceBetween: pcGap,
                speed: 500,
                observer: true,
                observeParents: true,
                simulateTouch: el.classList.contains('ranking-swiper') || el.classList.contains('recommend-swiper') ? false : true,
                navigation: {
                    enabled: true,
                    prevEl: el.querySelector('.swiper-button-prev'),
                    nextEl: el.querySelector('.swiper-button-next'),
                },
                breakpoints: {
                    280: {
                        slidesPerView: 1,
                        spaceBetween: moGap,
                    },
                    767: {
                        slidesPerView: min,
                        spaceBetween: pcGap,
                    }
                }
            });
        }
        const buildCheck = () => {
            mainSwipers.forEach((item, id)=>{
                const min = item.classList.contains('ranking-swiper') || item.classList.contains('ad-banner-wrap') || item.classList.contains('brand-ad-banner') ? 2
                            : item.classList.contains('recommend-swiper') ? 1
                            : 3,
                    pcGap = item.classList.contains('ranking-swiper') ? 30
                            : item.classList.contains('brand-ad-banner') ? 20
                            : item.classList.contains('recommend-swiper') ? 0
                            : 24,
                    moGap = item.classList.contains('recommend-swiper') || item.classList.contains('brand-ad-banner') ? 0
                            : 16;

                mainSlideLength.push(item.querySelectorAll('.swiper-slide').length);
                mainSlideMinLength.push(min);
                mainSlideMoGap.push(moGap);
                mainSlidePcGap.push(pcGap);

                if( item.querySelectorAll('.swiper-slide').length > (window.innerWidth < 768 ? 1 : min) ) {
                    const slider = buildSlider(item, min, pcGap, moGap);
                    mainSwiperArray.push(slider);
                } else {
                    mainSwiperArray.push(false);
                }
            })
        }

        if( mainSwiperInit ) {
            // 모바일이 될 때
            if( window.innerWidth < 768 ) {
                for (let i = 0; i < mainSwipers.length; i++) {
                    if( mainSlideLength[i] <= mainSlideMinLength[i] && mainSlideLength[i] > 1 ) {
                        mainSwiperArray[i] = buildSlider(mainSwipers[i], mainSlideMinLength[i], mainSlidePcGap[i], mainSlideMoGap[i]);
                    }
                }
            } else {
                // PC가 될 때
                for (let i = 0; i < mainSwipers.length; i++) {
                    if( mainSlideLength[i] <= mainSlideMinLength[i] ) {
                        mainSwiperArray[i] != false && mainSwiperArray[i].destroy(true, true);
                    }
                }
            }
        } else {
            mainSwiperInit = true;
            buildCheck();
        }
    }
    makeMainSwiper();
    mediaQuery.addEventListener('change', () => {
        makeMainSwiper();
    })
}

// main > 프로모션 배너
const promoBnBtn = document.querySelector('.promo-btn');
if( promoBnBtn !== null ){
    const promoSideEl = promoBnBtn.closest('.side'),
        promoBts = document.querySelectorAll('.promo-pop-wrap .icon-close, .promo-btn');

    const promoToggleFun = () => {
        promoSideEl.classList.toggle('promo-active');
    }
    promoBts.forEach((el) => {
        el.addEventListener('click', promoToggleFun)
    });
}

const adProductListEl = document.querySelectorAll('.ad-item-swiper');
if( adProductListEl.length > 0 ){
    const makeAdProductSwiper = (el) => {
        let elSwiper = el.querySelector('.swiper'),
            elSwiperItem = elSwiper.querySelectorAll('.swiper-slide');

        if ( elSwiperItem.length > 3 ) {
            let adProductSwiper = new Swiper(elSwiper, {
                slidesPerView: el.closest(".modal") ? 5  : 3.1239,
                spaceBetween: 12,
                speed: 500,
                observer: true,
                observeParents: true,
            });
        }
    }
    adProductListEl.forEach((el) => {
        makeAdProductSwiper(el);
    });

}

// ad banner 스와이퍼
const adBannerSwiper = document.querySelectorAll('.banner, .ad-banner:not(.brand-ad-banner)');
if( adBannerSwiper.length > 0 ){
    adBannerSwiper.forEach((el) => {
        bannerSwiper(el.querySelector('.swiper'), 1, 0, 0 );
    })
}

// tab
const tabButtons = document.querySelectorAll('.tab-item');
if (tabButtons.length > 0) {
    tabButtons.forEach((tab) => {
        tab.addEventListener('click', (e) => {
            let targetTab = e.target,
                tabList = targetTab.closest('.tabs'),
                tabGroup = tabList.closest('.tab');

            tabList
                .querySelectorAll(':scope > [aria-selected="true"]')
                .forEach((t) => t.setAttribute("aria-selected", false));

            targetTab.setAttribute("aria-selected", true);

            tabGroup
                .querySelectorAll(':scope > [role="tabpanel"]')
                .forEach((p) => p.setAttribute("aria-hidden", true));

            tabGroup
                .querySelector(`#${targetTab.getAttribute("aria-controls")}`)
                .removeAttribute("aria-hidden");
        });
    });
}

// accordion
const accordion = document.querySelectorAll('.accordion .icon-chevron-down, .accordion button.title-wrap');
if( accordion.length > 0 ) {
    accordion.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            btn.closest('li').classList.toggle('open');
        })
    });
}

// input[type="password"]
const showPasswordBtn = document.querySelector('.show-password-btn');
if ( showPasswordBtn !== null ) {
    showPasswordBtn.addEventListener("click", (e) => {
        e.preventDefault();
        showPasswordBtn.classList.toggle('active');

        let inputEl = e.target.nextElementSibling;
        if ( showPasswordBtn.classList.contains('active') ) {
            inputEl.setAttribute("type", "text");
        } else {
            inputEl.setAttribute("type", "password");
        }
    });
}


// 회원가입 > 간편결제 수단 등록 || 주문 > 간편결제 선택
const payment  = document.querySelectorAll('.swiper-payment');
if( payment.length > 0 ) {
    const paySwiperFunc = (el) => {
        let item = el.querySelectorAll('.swiper-slide');
        if( item.length > 1 ) {

            let isOrderPage = document.querySelector('.order-page') != null;

            if( isOrderPage && ( item.length == 2 || item.length == 3 ) ){
                el.querySelector('.swiper-wrapper').classList.add('jc-center');
            }

            let paymentSwiper = new Swiper(el.querySelector('.swiper'), {
                slidesPerView: 'auto',
                // centeredSlides: false,
                spaceBetween: 8,
                observer: true,
                observeParents: true,
                navigation: {
                    // enabled: true,
                    prevEl: el.querySelector('.swiper-button-prev'),
                    nextEl: el.querySelector('.swiper-button-next'),
                },
            });
        }
    }
    payment.forEach((el)=>{
        paySwiperFunc(el);
    });
}

// 회원가입 > 동의
const hiddenOptions = document.querySelectorAll('.agreement .hidden-option');
if( hiddenOptions.length > 0 ){
    hiddenOptions.forEach((el)=>{
        let hOparent = el.closest('.grid-item'),
            hOcheck = hOparent.querySelector('.check-wrap:not(.hidden-option) input');

        hOcheck.addEventListener('change', () => {
            el.classList.toggle('hidden');
        })
    })
}

// 회원가입 > 약국정보 토글
const btnPharmacyToggle = document.querySelectorAll('.btn-pharmacy-toggle');
if( btnPharmacyToggle.length > 0 ){
    btnPharmacyToggle.forEach((btn)=>{
        btn.addEventListener("click", (e)=>{
            e.preventDefault();
            document.querySelector('.pharmacy-info-origin').classList.toggle('hidden');
            document.querySelector('.pharmacy-info-change').classList.toggle('hidden');
        })
    })
}

// 회원가입 > 대행서비스 토글
const purchasingAgency = document.querySelector('.ck-agency input');
if( purchasingAgency != null ){
    const purchasingAgencyList = document.querySelector('.checkbox-tab');
    purchasingAgency.addEventListener('change', (e)=>{
        if ( e.currentTarget.checked ){
            purchasingAgencyList.classList.remove('hidden');
        } else {
            purchasingAgencyList.classList.add('hidden');
        }
    })
}

// date
const setDatePicker = () => {
    $.datepicker.setDefaults({
        dateFormat: 'yy.mm.dd',
        prevText: '이전 달',
        nextText: '다음 달',
        monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        dayNames: ['일', '월', '화', '수', '목', '금', '토'],
        dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
        dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
        showMonthAfterYear: true,
        yearSuffix: '년'
    });
    $(()=>{
        $('input.date')?.datepicker();
    })
}
const inputDate = document.querySelectorAll('input.date');
if( inputDate.length > 0 ){
    setDatePicker();
}

// gnb
const gnbCategoryBtn = document.querySelector('.m-category-open');
if( gnbCategoryBtn != null ){
    const gnbCategoryArea = document.querySelector('.m-gnb-wrap');
    // gnb 닫기
    const gnbCloseFunc = () => {
        document.body.classList.toggle('scrolllock');
        gnbCategoryBtn.classList.toggle('on');
        gnbCategoryArea.classList.toggle('on');
    }
    // gnb 카테고리 버튼
    gnbCategoryBtn.addEventListener("click", (e) => {
        e.preventDefault();
        gnbCloseFunc();
    })
    // gnb 카테고리 버튼 > 닫기 버튼
    gnbCategoryArea.querySelector('.m-gnb-close').addEventListener("click", (e) => {
        e.preventDefault();
        gnbCloseFunc();
    })
    // gnb 카테고리의 미디어 반응
    mediaQuery.addEventListener('change', () => {
        document.body.classList.remove('scrolllock');
        gnbCategoryBtn.classList.remove('on');
        gnbCategoryArea.classList.remove('on');
    })

    // gnb 카테고리 버튼 > item click
    const gnbCategoryItem = gnbCategoryArea.querySelectorAll('.menu-item, .submenu-item:not(:only-child)'),
        gnbDepth2 = gnbCategoryArea.querySelectorAll('.depth2 > ul'),
        gnbDepth3 = gnbCategoryArea.querySelectorAll('.depth3');

    gnbCategoryItem.forEach((el, i)=> {
        el.addEventListener('click', (e)=>{
            e.preventDefault();

            if( !e.target.classList.contains('on') ){
                if( e.target.classList.contains('menu-item') ) {
                    // reset
                    gnbCategoryItem
                        .forEach((t) => {
                            t.classList.contains('on') && t.classList.remove('on');
                        });
                    gnbDepth2
                        .forEach((t) => {
                            t.classList.contains('on') && t.classList.remove('on');
                        });
                    gnbDepth3
                        .forEach((t) => {
                            t.classList.contains('on') && t.classList.remove('on');
                        });

                    // active
                    gnbDepth2[i].classList.add('on');
                } else {
                    // reset
                    gnbCategoryArea.querySelectorAll('.submenu-item.on')
                        .forEach((t) => {
                            t.classList.remove('on');
                        });
                    gnbDepth3
                        .forEach((t) => {
                            t.classList.contains('on') && t.classList.remove('on');
                        });

                    // active
                    if( e.target.nextElementSibling ){
                        e.target.nextElementSibling.classList.add('on');
                    }
                }
                el.classList.add('on');
            } else if ( e.target.classList.contains('submenu-item') ) {
                el.classList.toggle('on');
                if( e.target.nextElementSibling ){
                    e.target.nextElementSibling.classList.toggle('on');
                }
            }

        })
    })
}

// to top
const toTopBtn = document.querySelector('.btn-top');
if( toTopBtn != null ){
    toTopBtn.addEventListener("click", (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            // behavior: 'smooth'
        });
    })
}

// 장바구니 하단 고정 영역 & 플로팅 바
const orderFixedBtn = document.querySelector('.btn-view-order-all');
if( orderFixedBtn != null ){
    const floatingEl = orderFixedBtn.closest('.floating-aside') || orderFixedBtn.closest('.floating-bar');

    toggleActive(orderFixedBtn, floatingEl, '상세내역 보기', '상세내역 접기');

    mediaQuery.addEventListener('change', () => {
        floatingEl.classList.remove('active');
    })
}

// 장바구니 입점업체 펼쳐보기
const orderCompanyBtn = document.querySelector('.seller-list .btn');
if( orderCompanyBtn != null ){
    toggleActive(orderCompanyBtn, orderCompanyBtn, '더보기', '접기');
}
// 장바구니 결제 상세내역 펼쳐보기
const orderlistBtn = document.querySelectorAll('.order-prd-table .btn');
if( orderlistBtn.length > 0 ){
    orderlistBtn.forEach((el)=>{
        toggleActive(el, el.closest('.th'), '상세내역 보기', '상세내역 접기');
    })
}
// 장바구니 배송지 변경
const deliveryCk = document.querySelectorAll('.delivery-info .check-wrap input');
if( deliveryCk.length > 0 ){
    deliveryCk.forEach((el)=>{
        el.addEventListener('change', (e) => {
            const targetEl = e.target.closest('.delivery-info');
            if(e.target.checked){
                targetEl.classList.add('active');
            } else {
                targetEl.classList.remove('active');
            }
        })
    })
}


// 주문 토글
// const orderToggleTitle = document.querySelectorAll('.order-page .toggle-title .icon-chevron-down, .order-page .toggle-title .toggle-arrow');
// if( orderToggleTitle.length > 0 ){
//     orderToggleTitle.forEach((el)=> {
//         el.addEventListener('click', (e)=>{
//             e.preventDefault();
//             el.closest('.toggle-title').classList.toggle('active');
//         })
//     })
// }

// 주문 > 결제 수단
const infoPaymentMethod = document.querySelectorAll('.payment-wrap');
if( infoPaymentMethod.length > 0 ){
    document.querySelectorAll('.payment-wrap .payment').forEach((el)=>{
        const paymentSelect = el.querySelector('input[type="radio"]');
        if( paymentSelect ) {
            let parentEl = el.closest('.toggle-content');
            paymentSelect.addEventListener('change', (e) => {
                if(e.target.checked){
                    const targetLi = e.target.closest('li');
                    parentEl.querySelectorAll('.payment').forEach((item)=>{
                        item.classList.remove('active');
                        targetLi.classList.add('active');
                    })
                }
            })
        }
    })
}

// 주문 > 결제 수단 > 신용카드
const creditList = document.querySelectorAll('.credit-list');
if( creditList.length > 0 ){
    let allCards = document.querySelectorAll('.credit-list .credit-item');
    allCards.forEach((el)=>{
        el.addEventListener('click', (e)=>{
            e.preventDefault();
            allCards.forEach((item)=>item.setAttribute("aria-selected", false))
            el.setAttribute("aria-selected", true);
        })
    })
}

// 기획전
const promoMainBanner = document.querySelector('.promo-main-page .main-banner');
if( promoMainBanner != null ){
    bannerSwiper(promoMainBanner.querySelector('.swiper'), 'auto', 24, 0, 1);
}
// 브랜드관
const brandMainBanner = document.querySelector('.brand-main-page .main-banner');
if( brandMainBanner != null ){
    bannerSwiper(brandMainBanner.querySelector('.swiper'), 1, 20, 0, 1);
}

const promoBundleBanner = document.querySelector('.bundle-banner');
if( promoBundleBanner != null && promoBundleBanner.querySelectorAll('.swiper-slide').length > 1 ){
    let promoBundleBannerSwiper = new Swiper(promoBundleBanner.querySelector('.swiper'), {
        slidesPerView: 1,
        spaceBetween: 0,
        observer: true,
        observeParents: true,
        loop: true,
        navigation: {
            prevEl: promoBundleBanner.querySelector('.swiper-button-prev'),
            nextEl: promoBundleBanner.querySelector('.swiper-button-next'),
        },
    });
}

// 알림
const notifySettingBtn = document.querySelector('.notify-modal .modal-header .btn');
if( notifySettingBtn != null ){
    notifySettingBtn.addEventListener("click", (e)=>{
        e.preventDefault();
        notifySettingBtn.classList.toggle('active');
        document.querySelector('.notify-modal .nofi-cover').classList.toggle('hidden');
        document.querySelector('.notify-modal .notify-setting').classList.toggle('hidden');
    })
}

// 약톡톡 메인
const talkMainListEl = document.querySelector('.lineup-swiper');
if( talkMainListEl != null && talkMainListEl.querySelectorAll('.swiper-slide').length > 12 ){
    let talkMainListSwiper = new Swiper(talkMainListEl.querySelector('.swiper'), {
        loop: false,
        slidesPerView: 12,
        spaceBetween: 18,
        speed: 500,
        observer: true,
        observeParents: true,
        navigation: {
            prevEl: talkMainListEl.querySelector('.swiper-button-prev'),
            nextEl: talkMainListEl.querySelector('.swiper-button-next'),
        }
    });
}

// 약톡톡 상품리스트
const talkProductListEl = document.querySelector('.talk-item-swiper');
if( talkProductListEl != null && talkProductListEl.querySelectorAll('.swiper-slide').length > 4 ){
    let talkProductListSwiper = new Swiper(talkProductListEl.querySelector('.swiper'), {
        loop: true,
        slidesPerView: 4,
        spaceBetween: 16,
        speed: 500,
        observer: true,
        observeParents: true,
        simulateTouch: false,
        navigation: {
            prevEl: talkProductListEl.querySelector('.swiper-button-prev'),
            nextEl: talkProductListEl.querySelector('.swiper-button-next'),
        }
    });
}

// 제품톡
const prodtalkTextarea = document.querySelector('.prodtalk-panel textarea');
if( prodtalkTextarea != null ){
    prodtalkTextarea.addEventListener('input', () => {
        let prodtalkBtn = document.querySelector('.prodtalk-panel .btn')
        if (prodtalkTextarea.value !== '') {
            prodtalkBtn.disabled = false;
        } else {
            prodtalkBtn.disabled = true;
        }
    });
}