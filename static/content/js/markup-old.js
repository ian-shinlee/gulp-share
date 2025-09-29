

window.addEventListener("load", ()=> {
    // swiper
    let className = {
        mainSwiperPc: $(".main-visual.pc"),
        mainSwiperPauseBtn: $(".main-visual.pc .main-swiper-pagination-wrap > button"),
    };

    // visual swiper
    const visualSwiperOption = {
        slidesPerView: "1",
        loop: true,
        centeredSlides: true,
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        },
        pagination: {
            clickable: true,
            el: ".main-swiper-pagination",
            type: "custom",
            renderCustom: function (swiper, current, total) {
                return current + " - " + total;
            },
        },
        navigation: {
            enabled: true,
            prevEl: ".main-visual .swiper-prev",
            nextEl: ".main-visual .swiper-next",
        },
        watchSlidesProgress: true,
    };

    let visualSwiper = new Swiper(".main-visual.pc", visualSwiperOption);

    // swiper auto play control
    className.mainSwiperPauseBtn.on("click", function (e) {
        e.preventDefault();
        if ($(this).hasClass("btn-pause")) {
            console.log('Pasue!')
            $(this).removeClass("btn-pause").addClass("btn-play");
            visualSwiper.autoplay.stop();
        } else {
            //console.log('Play!')
            $(this).removeClass("btn-play").addClass("btn-pause");
            visualSwiper.autoplay.start();
        }
    });

    // timesale swiper
    const timesaleSwiperOption = {
        slidesPerView: "1",
        loop: false,
        pagination: {
            clickable: true,
            el: ".timesale-swiper-pagination",
        },
        navigation: {
            enabled: true,
            prevEl: ".main-timesale-area .swiper-prev",
            nextEl: ".main-timesale-area .swiper-next",
        },
    };

    let timesaleSwiper = new Swiper(".main-timesale", timesaleSwiperOption);

    // main-tab-swiper
    const mainTabSwiperOption = {
        slidesPerView: "auto",
        loop: false,
        spaceBetween: 10,
    };

    let mainTabSwiper = new Swiper(".main-tab-swiper", mainTabSwiperOption);

    // main-bestItem-area
    const bestItemSwiperOption = {
        slidesPerView: "11",
        loop: false,
        breakpoints: {
            320: {
                slidesPerView: 5,
                spaceBetween: 10,
            },
            767: {
                slidesPerView: 8,
                spaceBetween: 10,
            },
            1194: {
                slidesPerView: 11,
                spaceBetween: 10,
            },
        },
        navigation: {
            enabled: true,
            prevEl: ".main-bestItem-area .swiper-prev",
            nextEl: ".main-bestItem-area .swiper-next",
        },
    };

    let bestItemSwiper = new Swiper(".main-bestitem", bestItemSwiperOption);

    let classBrandName = {
        brandList: $(".brand-list"),
        brandListItem: $(".brand-list .swiper-slide"),
    };
    // main brand
    const brandListSwiperOption = {
        slidesPerView: "11",
        spaceBetween: 30,
        loop: false,
        breakpoints: {
            320: {
                slidesPerView: 2,
                spaceBetween: 14,
            },
            767: {
                slidesPerView: 4,
                spaceBetween: 10,
            },
            1194: {
                slidesPerView: 6,
                spaceBetween: 10,
            },
        },
    };

    let brandListSwiper = new Swiper(".brand-list", brandListSwiperOption);

    classBrandName.brandListItem.on("click", function (e) {
        e.preventDefault();

        $(this).addClass("on").siblings().removeClass("on");
    });

    let timer, current, totalIdx;
    let nextIdx = 1;
    function setTime() {
        timer = setInterval(function () {
            current = $(".brand-list").find(".on").index();
            totalIdx = parseInt(classBrandName.brandListItem.length);

            if (current === 0) {
                current = totalIdx - 1;
            } else {
                current = nextIdx - 1;
            }
            nextIdx = current;

            $(".brand-list .swiper-slide").removeClass("on");
            $(".brand-list .swiper-slide").eq(nextIdx).addClass("on");
        }, 3000);
    }
    setTime();

    classBrandName.brandListItem.hover(
        function (e) {
            e.preventDefault();
            clearInterval(timer);
            //console.log("pause");
        },
        function (e) {
            e.preventDefault();
            setTime();
            //console.log("mouseout");
        }
    );

    // thumbnail Swiper
    let thumSwiper = new Swiper(".thumbnail-list-swiper", {
        spaceBetween: 10,
        slidesPerView: 5,
        freeMode: true,
        watchSlidesProgress: true,
    });
    let listSwiper = new Swiper(".thumbnail-main-swiper", {
        spaceBetween: 10,
        navigation: {
            nextEl: ".thumbnail-list-swiper .swiper-next",
            prevEl: ".thumbnail-list-swiper .swiper-prev",
        },
        thumbs: {
            swiper: thumSwiper,
        },
    });

    // board
    $('.board').on('click', 'li', function (e) {
        e.preventDefault();

        $('.board').find('li').removeClass('open');
        $(this).addClass('open');
    });


})
