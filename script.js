/* =========================================================
   COAST WATER
   Production interaction layer
========================================================= */

(() => {
    "use strict";

    const $ = (selector, parent = document) =>
        parent.querySelector(selector);

    const $$ = (selector, parent = document) =>
        [...parent.querySelectorAll(selector)];

    const body = document.body;
    const html = document.documentElement;

    const loader = $("#loader");
    const hero = $(".hero");
    const navbar = $("#navbar");
    const cursor = $("#cursor");
    const progressBar = $("#scrollProgress span");

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const finePointer = window.matchMedia(
        "(pointer: fine)"
    ).matches;


    /* =====================================================
       LOAD STATE
    ===================================================== */

    function finishLoading() {
        loader?.classList.add("loaded");
        hero?.classList.add("loaded");
        body.classList.add("loaded");
    }

    if (document.readyState === "complete") {
        finishLoading();
    } else {
        window.addEventListener(
            "load",
            finishLoading,
            { once: true }
        );
    }


    /* =====================================================
       SCROLL STATE
    ===================================================== */

    let scrollTicking = false;

    function updateScrollState() {

        const scrollTop = window.scrollY;

        const scrollHeight =
            html.scrollHeight - window.innerHeight;

        const progress =
            scrollHeight > 0
                ? Math.min(
                    100,
                    Math.max(
                        0,
                        (scrollTop / scrollHeight) * 100
                    )
                )
                : 0;

        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }

        if (navbar) {
            navbar.classList.toggle(
                "scrolled",
                scrollTop > 50
            );
        }

        scrollTicking = false;
    }

    function requestScrollUpdate() {

        if (!scrollTicking) {
            window.requestAnimationFrame(
                updateScrollState
            );

            scrollTicking = true;
        }
    }

    window.addEventListener(
        "scroll",
        requestScrollUpdate,
        { passive: true }
    );

    updateScrollState();


    /* =====================================================
       REVEAL ON SCROLL
    ===================================================== */

    const revealElements = $$(".reveal");

    if (
        reducedMotion ||
        !("IntersectionObserver" in window)
    ) {
        revealElements.forEach(
            element => element.classList.add("visible")
        );
    } else {

        const revealObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (!entry.isIntersecting) {
                            return;
                        }

                        entry.target.classList.add(
                            "visible"
                        );

                        revealObserver.unobserve(
                            entry.target
                        );

                    });

                },
                {
                    threshold: 0.12,
                    rootMargin:
                        "0px 0px -40px 0px"
                }
            );

        revealElements.forEach(
            element =>
                revealObserver.observe(element)
        );
    }


    /* =====================================================
       CUSTOM CURSOR
    ===================================================== */

    if (
        cursor &&
        finePointer &&
        !reducedMotion
    ) {

        let mouseX = 0;
        let mouseY = 0;

        let cursorX = 0;
        let cursorY = 0;

        window.addEventListener(
            "mousemove",
            event => {
                mouseX = event.clientX;
                mouseY = event.clientY;
            },
            { passive: true }
        );

        function animateCursor() {

            cursorX +=
                (mouseX - cursorX) * 0.18;

            cursorY +=
                (mouseY - cursorY) * 0.18;

            cursor.style.left =
                `${cursorX}px`;

            cursor.style.top =
                `${cursorY}px`;

            window.requestAnimationFrame(
                animateCursor
            );
        }

        animateCursor();

        const interactiveElements =
            $$(
                "a, button, summary, .service-card"
            );

        interactiveElements.forEach(
            element => {

                element.addEventListener(
                    "mouseenter",
                    () =>
                        cursor.classList.add(
                            "active"
                        )
                );

                element.addEventListener(
                    "mouseleave",
                    () =>
                        cursor.classList.remove(
                            "active"
                        )
                );
            }
        );
    }


    /* =====================================================
       MAGNETIC BUTTONS
    ===================================================== */

    if (finePointer && !reducedMotion) {

        $$(".magnetic").forEach(element => {

            element.addEventListener(
                "mousemove",
                event => {

                    const rect =
                        element.getBoundingClientRect();

                    const x =
                        event.clientX -
                        rect.left -
                        rect.width / 2;

                    const y =
                        event.clientY -
                        rect.top -
                        rect.height / 2;

                    element.style.transform =
                        `translate(
                            ${x * 0.09}px,
                            ${y * 0.09}px
                        )`;
                }
            );

            element.addEventListener(
                "mouseleave",
                () => {
                    element.style.transform = "";
                }
            );

        });
    }


    /* =====================================================
       HERO PARALLAX
    ===================================================== */

    const heroWater = $(".hero-water");
    const orbitOne = $(".orbit-one");
    const orbitTwo = $(".orbit-two");

    if (
        hero &&
        finePointer &&
        !reducedMotion
    ) {

        hero.addEventListener(
            "mousemove",
            event => {

                const rect =
                    hero.getBoundingClientRect();

                const x =
                    (event.clientX - rect.left) /
                    rect.width -
                    0.5;

                const y =
                    (event.clientY - rect.top) /
                    rect.height -
                    0.5;

                if (heroWater) {
                    heroWater.style.marginLeft =
                        `${x * 35}px`;

                    heroWater.style.marginTop =
                        `${y * 25}px`;
                }

                if (orbitOne) {
                    orbitOne.style.marginLeft =
                        `${x * 25}px`;

                    orbitOne.style.marginTop =
                        `${y * 15}px`;
                }

                if (orbitTwo) {
                    orbitTwo.style.marginLeft =
                        `${x * -20}px`;

                    orbitTwo.style.marginTop =
                        `${y * -12}px`;
                }

            },
            { passive: true }
        );
    }


    /* =====================================================
       SERVICE CARDS
    ===================================================== */

    const serviceCards =
        $$(".service-card");

    serviceCards.forEach(card => {

        card.addEventListener(
            "click",
            () => {

                serviceCards.forEach(
                    item =>
                        item.classList.remove(
                            "active"
                        )
                );

                card.classList.add("active");
            }
        );

        if (
            finePointer &&
            !reducedMotion
        ) {

            card.addEventListener(
                "mousemove",
                event => {

                    const rect =
                        card.getBoundingClientRect();

                    const x =
                        event.clientX - rect.left;

                    const y =
                        event.clientY - rect.top;

                    const rotateX =
                        ((y / rect.height) - 0.5) *
                        -3;

                    const rotateY =
                        ((x / rect.width) - 0.5) *
                        3;

                    card.style.transform =
                        `perspective(900px)
                         rotateX(${rotateX}deg)
                         rotateY(${rotateY}deg)`;
                }
            );

            card.addEventListener(
                "mouseleave",
                () => {
                    card.style.transform = "";
                }
            );
        }

    });


    /* =====================================================
       PROCESS TIMELINE
    ===================================================== */

    const processTimeline =
        $(".process-timeline");

    if (
        processTimeline &&
        "IntersectionObserver" in window
    ) {

        const processObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (
                            !entry.isIntersecting
                        ) {
                            return;
                        }

                        processTimeline.classList.add(
                            "active"
                        );

                        processObserver.unobserve(
                            processTimeline
                        );

                    });

                },
                {
                    threshold: 0.2
                }
            );

        processObserver.observe(
            processTimeline
        );
    }


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    const menuToggle =
        $("#menuToggle");

    const mobileMenu =
        $("#mobileMenu");

    const mobileLinks =
        $$(".mobile-menu a");

    function closeMobileMenu() {

        if (!menuToggle || !mobileMenu) {
            return;
        }

        mobileMenu.classList.remove("open");

        menuToggle.classList.remove("open");

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

        mobileMenu.setAttribute(
            "aria-hidden",
            "true"
        );

        body.classList.remove(
            "menu-open"
        );
    }

    function openMobileMenu() {

        if (!menuToggle || !mobileMenu) {
            return;
        }

        mobileMenu.classList.add("open");

        menuToggle.classList.add("open");

        menuToggle.setAttribute(
            "aria-expanded",
            "true"
        );

        mobileMenu.setAttribute(
            "aria-hidden",
            "false"
        );

        body.classList.add(
            "menu-open"
        );
    }

    menuToggle?.addEventListener(
        "click",
        () => {

            const isOpen =
                mobileMenu.classList.contains(
                    "open"
                );

            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }

        }
    );

    mobileLinks.forEach(
        link =>
            link.addEventListener(
                "click",
                closeMobileMenu
            )
    );


    /* =====================================================
       SMOOTH ANCHOR SCROLL
    ===================================================== */

    $$('a[href^="#"]').forEach(link => {

        link.addEventListener(
            "click",
            event => {

                const targetId =
                    link.getAttribute("href");

                if (
                    !targetId ||
                    targetId === "#"
                ) {
                    return;
                }

                const target =
                    document.querySelector(
                        targetId
                    );

                if (!target) {
                    return;
                }

                event.preventDefault();

                const navHeight =
                    navbar
                        ? navbar.offsetHeight
                        : 0;

                const targetPosition =
                    target.getBoundingClientRect()
                        .top +
                    window.scrollY -
                    navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior:
                        reducedMotion
                            ? "auto"
                            : "smooth"
                });

            }
        );

    });


    /* =====================================================
       ESCAPE KEY
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key !== "Escape") {
                return;
            }

            closeMobileMenu();

            if (
                contactModal &&
                contactModal.classList.contains(
                    "open"
                )
            ) {
                closeContactModal();
            }
        }
    );


    /* =====================================================
       STATEMENT PARALLAX
    ===================================================== */

    const statement =
        $(".statement");

    const statementLiquid =
        $(".statement-liquid");

    if (
        statement &&
        statementLiquid &&
        finePointer &&
        !reducedMotion
    ) {

        window.addEventListener(
            "scroll",
            () => {

                const rect =
                    statement.getBoundingClientRect();

                const viewportCenter =
                    window.innerHeight / 2;

                const distance =
                    rect.top -
                    viewportCenter;

                const movement =
                    distance * -0.035;

                statementLiquid.style.marginTop =
                    `${movement}px`;

            },
            { passive: true }
        );
    }


    /* =====================================================
       CONTACT ORB
    ===================================================== */

    const contact =
        $(".contact");

    const contactOrb =
        $(".contact-orb");

    if (
        contact &&
        contactOrb &&
        finePointer &&
        !reducedMotion
    ) {

        contact.addEventListener(
            "mousemove",
            event => {

                const rect =
                    contact.getBoundingClientRect();

                const x =
                    (event.clientX - rect.left) /
                    rect.width -
                    0.5;

                const y =
                    (event.clientY - rect.top) /
                    rect.height -
                    0.5;

                contactOrb.style.marginLeft =
                    `${x * 35}px`;

                contactOrb.style.marginTop =
                    `${y * 25}px`;

            },
            { passive: true }
        );
    }


    /* =====================================================
       DARK SECTION CURSOR
    ===================================================== */

    if (
        cursor &&
        finePointer &&
        "IntersectionObserver" in window
    ) {

        const darkSections =
            $$(".about, .contact");

        const darkObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (
                            entry.isIntersecting
                        ) {
                            cursor.classList.add(
                                "dark"
                            );
                        } else {
                            cursor.classList.remove(
                                "dark"
                            );
                        }

                    });

                },
                {
                    threshold: 0.35
                }
            );

        darkSections.forEach(
            section =>
                darkObserver.observe(section)
        );
    }


    /* =====================================================
       CONTACT MODAL
    ===================================================== */

    const contactModal =
        $("#contactModal");

    const openContactButton =
        $("#openContactModal");

    const closeContactButton =
        $("#closeContactModal");

    const modalBackdrop =
        $(".modal-backdrop");

    let lastFocusedElement = null;

    function openContactModal() {

        if (!contactModal) {
            return;
        }

        lastFocusedElement =
            document.activeElement;

        contactModal.classList.add(
            "open"
        );

        contactModal.setAttribute(
            "aria-hidden",
            "false"
        );

        body.classList.add(
            "modal-open"
        );

        window.setTimeout(
            () =>
                closeContactButton?.focus(),
            50
        );
    }

    function closeContactModal() {

        if (!contactModal) {
            return;
        }

        contactModal.classList.remove(
            "open"
        );

        contactModal.setAttribute(
            "aria-hidden",
            "true"
        );

        body.classList.remove(
            "modal-open"
        );

        lastFocusedElement?.focus();
    }

    openContactButton?.addEventListener(
        "click",
        openContactModal
    );

    closeContactButton?.addEventListener(
        "click",
        closeContactModal
    );

    modalBackdrop?.addEventListener(
        "click",
        closeContactModal
    );


    /* =====================================================
       CONTACT FORM
    ===================================================== */

    const contactForm =
        $("#contactForm");

    const formSubmit =
        $("#formSubmit");

    const STORAGE_KEY =
        "coast-contact-draft";

    function showToast(
        message,
        type = "success"
    ) {

        const toast =
            $("#toast");

        const toastMessage =
            $("#toastMessage");

        if (!toast || !toastMessage) {
            return;
        }

        toastMessage.textContent =
            message;

        toast.dataset.type =
            type;

        toast.classList.add(
            "show"
        );

        window.setTimeout(
            () =>
                toast.classList.remove(
                    "show"
                ),
            3500
        );
    }


    function saveDraft() {

        if (!contactForm) {
            return;
        }

        const data =
            Object.fromEntries(
                new FormData(
                    contactForm
                ).entries()
            );

        delete data["form-name"];
        delete data["bot-field"];

        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(data)
            );
        } catch {
            /* Storage may be disabled. */
        }
    }


    function loadDraft() {

        if (!contactForm) {
            return;
        }

        try {

            const raw =
                localStorage.getItem(
                    STORAGE_KEY
                );

            if (!raw) {
                return;
            }

            const data =
                JSON.parse(raw);

            Object.entries(data).forEach(
                ([name, value]) => {

                    const field =
                        contactForm.elements[name];

                    if (field) {
                        field.value =
                            value;
                    }
                }
            );

        } catch {
            /* Ignore corrupt storage. */
        }
    }


    function clearDraft() {

        try {
            localStorage.removeItem(
                STORAGE_KEY
            );
        } catch {
            /* Ignore storage errors. */
        }
    }


    function clearFieldError(field) {

        const wrapper =
            field.closest("label");

        if (!wrapper) {
            return;
        }

        wrapper.classList.remove(
            "invalid"
        );

        const error =
            $(".field-error", wrapper);

        if (error) {
            error.textContent = "";
        }
    }


    function setFieldError(
        field,
        message
    ) {

        const wrapper =
            field.closest("label");

        if (!wrapper) {
            return;
        }

        wrapper.classList.add(
            "invalid"
        );

        const error =
            $(".field-error", wrapper);

        if (error) {
            error.textContent =
                message;
        }
    }


    function validateField(field) {

        clearFieldError(field);

        if (
            field.hasAttribute("required") &&
            !field.value.trim()
        ) {

            setFieldError(
                field,
                "This field is required."
            );

            return false;
        }

        if (
            field.type === "email" &&
            field.value
        ) {

            const validEmail =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                    .test(
                        field.value.trim()
                    );

            if (!validEmail) {

                setFieldError(
                    field,
                    "Enter a valid email address."
                );

                return false;
            }
        }

        const minimum =
            Number(
                field.getAttribute(
                    "minlength"
                )
            );

        if (
            minimum &&
            field.value.trim().length <
            minimum
        ) {

            setFieldError(
                field,
                `Please enter at least ${minimum} characters.`
            );

            return false;
        }

        return true;
    }


    if (contactForm) {

        loadDraft();

        $$(
            "input, select, textarea",
            contactForm
        ).forEach(field => {

            field.addEventListener(
                "input",
                () => {

                    clearFieldError(
                        field
                    );

                    saveDraft();
                }
            );

            field.addEventListener(
                "change",
                saveDraft
            );

        });


        contactForm.addEventListener(
            "submit",
            event => {

                let valid = true;

                $$(
                    "input:not([type='hidden']), select, textarea",
                    contactForm
                ).forEach(field => {

                    if (
                        !validateField(
                            field
                        )
                    ) {
                        valid = false;
                    }

                });

                if (!valid) {

                    event.preventDefault();

                    showToast(
                        "Please check the highlighted fields.",
                        "error"
                    );

                    const firstInvalid =
                        $(".invalid input, .invalid select, .invalid textarea");

                    firstInvalid?.focus();

                    return;
                }

                /*
                    Netlify handles the actual submission.

                    We intentionally do not fake a successful
                    backend response here.
                */

                if (formSubmit) {

                    formSubmit.disabled =
                        true;

                    const spans =
                        $$(
                            "span",
                            formSubmit
                        );

                    if (spans[0]) {
                        spans[0].textContent =
                            "SENDING...";
                    }
                }

                clearDraft();
            }
        );
    }


    /* =====================================================
       FOOTER YEAR
    ===================================================== */

    const currentYear =
        $("#currentYear");

    if (currentYear) {
        currentYear.textContent =
            new Date().getFullYear();
    }


    /* =====================================================
       MOBILE / MODAL ACCESSIBILITY
    ===================================================== */

    window.addEventListener(
        "resize",
        () => {

            if (
                window.innerWidth > 900
            ) {
                closeMobileMenu();
            }

        },
        { passive: true }
    );

})();