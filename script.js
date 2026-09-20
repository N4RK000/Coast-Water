(() => {
    "use strict";

    const $ = (selector, root = document) => root.querySelector(selector);
    const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

    const body = document.body;
    const navbar = $("#navbar");
    const loader = $("#loader");
    const hero = $(".hero");
    const cursor = $("#cursor");
    const progressBar = $("#scrollProgress");
    const mobileMenu = $("#mobileMenu");
    const menuToggle = $("#menuToggle");
    const contactModal = $("#contactModal");
    const contactForm = $("#contactForm");
    const toast = $("#toast");
    const toastMessage = $("#toastMessage");

    const prefersReducedMotion =
        window.matchMedia("(prefers-reduced-motion: reduce)");

    const finePointer =
        window.matchMedia("(pointer: fine)").matches;


    /* ------------------------------
       LOAD STATE
    ------------------------------ */

    const revealHero = () => {
        loader?.classList.add("loaded");
        hero?.classList.add("loaded");
    };

    if (document.readyState === "complete") {
        requestAnimationFrame(revealHero);
    } else {
        window.addEventListener("load", revealHero, { once: true });
    }


    /* ------------------------------
       SCROLL UI
    ------------------------------ */

    let scrollTicking = false;

    const updateScrollUI = () => {
        scrollTicking = false;

        const scrollTop = window.scrollY;

        const scrollHeight =
            document.documentElement.scrollHeight -
            window.innerHeight;

        const progress =
            scrollHeight > 0
                ? (scrollTop / scrollHeight) * 100
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
    };

    const requestScrollUpdate = () => {
        if (!scrollTicking) {
            scrollTicking = true;
            requestAnimationFrame(updateScrollUI);
        }
    };

    window.addEventListener(
        "scroll",
        requestScrollUpdate,
        { passive: true }
    );

    updateScrollUI();


    /* ------------------------------
       REVEALS
    ------------------------------ */

    const revealElements = $$(".reveal");

    if (prefersReducedMotion.matches) {

        revealElements.forEach((element) => {
            element.classList.add("visible");
        });

    } else if ("IntersectionObserver" in window) {

        const revealObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach((entry) => {

                        if (!entry.isIntersecting) {
                            return;
                        }

                        entry.target.classList.add("visible");

                        observer.unobserve(
                            entry.target
                        );

                    });

                },
                {
                    threshold: 0.12,
                    rootMargin: "0px 0px -40px 0px"
                }
            );

        revealElements.forEach((element) => {
            revealObserver.observe(element);
        });

    } else {

        revealElements.forEach((element) => {
            element.classList.add("visible");
        });

    }


    /* ------------------------------
       CUSTOM CURSOR
    ------------------------------ */

    if (
        cursor &&
        finePointer &&
        !prefersReducedMotion.matches
    ) {

        let mouseX = 0;
        let mouseY = 0;

        let cursorX = 0;
        let cursorY = 0;

        let cursorFrame = 0;

        window.addEventListener(
            "mousemove",
            (event) => {

                mouseX = event.clientX;
                mouseY = event.clientY;

                if (!cursorFrame) {

                    cursorFrame =
                        requestAnimationFrame(() => {

                            cursorX +=
                                (mouseX - cursorX) * 0.18;

                            cursorY +=
                                (mouseY - cursorY) * 0.18;

                            cursor.style.left =
                                `${cursorX}px`;

                            cursor.style.top =
                                `${cursorY}px`;

                            cursorFrame = 0;
                        });
                }

            },
            { passive: true }
        );

        document.addEventListener(
            "pointerover",
            (event) => {

                if (
                    event.target.closest(
                        "a, button, .service-card, .magnetic"
                    )
                ) {
                    cursor.classList.add("active");
                }

            }
        );

        document.addEventListener(
            "pointerout",
            (event) => {

                const from =
                    event.target.closest(
                        "a, button, .service-card, .magnetic"
                    );

                const to =
                    event.relatedTarget?.closest?.(
                        "a, button, .service-card, .magnetic"
                    );

                if (from && !to) {
                    cursor.classList.remove("active");
                }

            }
        );
    }


    /* ------------------------------
       MAGNETIC BUTTONS
    ------------------------------ */

    if (
        finePointer &&
        !prefersReducedMotion.matches
    ) {

        $$(".magnetic").forEach((element) => {

            let frame = 0;
            let x = 0;
            let y = 0;

            element.addEventListener(
                "mousemove",
                (event) => {

                    const rect =
                        element.getBoundingClientRect();

                    x =
                        (
                            event.clientX -
                            rect.left -
                            rect.width / 2
                        ) * 0.09;

                    y =
                        (
                            event.clientY -
                            rect.top -
                            rect.height / 2
                        ) * 0.09;

                    if (!frame) {

                        frame =
                            requestAnimationFrame(() => {

                                element.style.transform =
                                    `translate(${x}px, ${y}px)`;

                                frame = 0;
                            });
                    }

                },
                { passive: true }
            );

            element.addEventListener(
                "mouseleave",
                () => {

                    if (frame) {
                        cancelAnimationFrame(frame);
                    }

                    frame = 0;
                    element.style.transform = "";

                }
            );

        });

    }


    /* ------------------------------
       HERO PARALLAX
    ------------------------------ */

    if (
        hero &&
        finePointer &&
        !prefersReducedMotion.matches
    ) {

        const heroWater = $(".hero-water");
        const orbitOne = $(".orbit-one");
        const orbitTwo = $(".orbit-two");

        let frame = 0;
        let x = 0;
        let y = 0;

        hero.addEventListener(
            "mousemove",
            (event) => {

                const rect =
                    hero.getBoundingClientRect();

                x =
                    (event.clientX - rect.left) /
                    rect.width -
                    0.5;

                y =
                    (event.clientY - rect.top) /
                    rect.height -
                    0.5;

                if (!frame) {

                    frame =
                        requestAnimationFrame(() => {

                            if (heroWater) {
                                heroWater.style.transform =
                                    `translate(
                                        ${x * 35}px,
                                        ${y * 25}px
                                    )`;
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

                            frame = 0;
                        });
                }

            },
            { passive: true }
        );
    }


    /* ------------------------------
       SERVICE CARDS
    ------------------------------ */

    const serviceCards =
        $$(".service-card");

    serviceCards.forEach((card) => {

        card.addEventListener(
            "click",
            () => {

                serviceCards.forEach((item) => {
                    item.classList.remove("active");
                });

                card.classList.add("active");

            }
        );

    });

    if (
        finePointer &&
        !prefersReducedMotion.matches
    ) {

        serviceCards.forEach((card) => {

            let frame = 0;
            let rotateX = 0;
            let rotateY = 0;

            card.addEventListener(
                "mousemove",
                (event) => {

                    const rect =
                        card.getBoundingClientRect();

                    rotateX =
                        (
                            (event.clientY - rect.top) /
                            rect.height -
                            0.5
                        ) * -3;

                    rotateY =
                        (
                            (event.clientX - rect.left) /
                            rect.width -
                            0.5
                        ) * 3;

                    if (!frame) {

                        frame =
                            requestAnimationFrame(() => {

                                card.style.transform =
                                    `perspective(900px)
                                     rotateX(${rotateX}deg)
                                     rotateY(${rotateY}deg)`;

                                frame = 0;
                            });
                    }

                },
                { passive: true }
            );

            card.addEventListener(
                "mouseleave",
                () => {

                    if (frame) {
                        cancelAnimationFrame(frame);
                    }

                    frame = 0;
                    card.style.transform = "";

                }
            );

        });

    }


    /* ------------------------------
       PROCESS TIMELINE
    ------------------------------ */

    const processTimeline =
        $(".process-timeline");

    if (
        processTimeline &&
        "IntersectionObserver" in window
    ) {

        const processObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    if (
                        entries.some(
                            (entry) =>
                                entry.isIntersecting
                        )
                    ) {

                        processTimeline.classList.add(
                            "active"
                        );

                        observer.disconnect();
                    }

                },
                {
                    threshold: 0.2
                }
            );

        processObserver.observe(
            processTimeline
        );
    }


    /* ------------------------------
       MOBILE MENU
    ------------------------------ */

    const closeMobileMenu = () => {

        mobileMenu?.classList.remove("open");

        menuToggle?.classList.remove("open");

        menuToggle?.setAttribute(
            "aria-expanded",
            "false"
        );

        mobileMenu?.setAttribute(
            "aria-hidden",
            "true"
        );

        body.classList.remove("menu-open");
    };

    menuToggle?.addEventListener(
        "click",
        () => {

            const isOpen =
                mobileMenu.classList.toggle("open");

            menuToggle.classList.toggle(
                "open",
                isOpen
            );

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            mobileMenu.setAttribute(
                "aria-hidden",
                String(!isOpen)
            );

            body.classList.toggle(
                "menu-open",
                isOpen
            );

        }
    );

    $$(".mobile-menu a").forEach((link) => {

        link.addEventListener(
            "click",
            closeMobileMenu
        );

    });


    /* ------------------------------
       SMOOTH ANCHORS
    ------------------------------ */

    document.addEventListener(
        "click",
        (event) => {

            const link =
                event.target.closest(
                    'a[href^="#"]'
                );

            if (!link) return;

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

            if (!target) return;

            event.preventDefault();

            const offset =
                navbar?.offsetHeight || 0;

            window.scrollTo({

                top:
                    target.getBoundingClientRect().top +
                    window.scrollY -
                    offset,

                behavior:
                    prefersReducedMotion.matches
                        ? "auto"
                        : "smooth"

            });

        }
    );


    /* ------------------------------
       STATEMENT PARALLAX
    ------------------------------ */

    const statement =
        $(".statement");

    const statementLiquid =
        $(".statement-liquid");

    if (
        statement &&
        statementLiquid &&
        finePointer &&
        !prefersReducedMotion.matches
    ) {

        let frame = 0;

        const updateStatement = () => {

            frame = 0;

            const rect =
                statement.getBoundingClientRect();

            const movement =
                (
                    rect.top -
                    window.innerHeight / 2
                ) * -0.035;

            statementLiquid.style.transform =
                `translateY(${movement}px)`;
        };

        window.addEventListener(
            "scroll",
            () => {

                if (!frame) {
                    frame =
                        requestAnimationFrame(
                            updateStatement
                        );
                }

            },
            { passive: true }
        );
    }


    /* ------------------------------
       CONTACT ORB
    ------------------------------ */

    const contact =
        $(".contact");

    const contactOrb =
        $(".contact-orb");

    if (
        contact &&
        contactOrb &&
        finePointer &&
        !prefersReducedMotion.matches
    ) {

        let frame = 0;
        let x = 0;
        let y = 0;

        contact.addEventListener(
            "mousemove",
            (event) => {

                const rect =
                    contact.getBoundingClientRect();

                x =
                    (event.clientX - rect.left) /
                    rect.width -
                    0.5;

                y =
                    (event.clientY - rect.top) /
                    rect.height -
                    0.5;

                if (!frame) {

                    frame =
                        requestAnimationFrame(() => {

                            contactOrb.style.transform =
                                `translate(
                                    calc(-50% + ${x * 35}px),
                                    calc(-50% + ${y * 25}px)
                                )`;

                            frame = 0;
                        });
                }

            },
            { passive: true }
        );
    }


    /* ------------------------------
       DARK-SECTION CURSOR STATE
    ------------------------------ */

    if (
        cursor &&
        finePointer &&
        "IntersectionObserver" in window
    ) {

        const darkSections =
            $$(".about, .contact");

        const activeSections =
            new Set();

        const darkObserver =
            new IntersectionObserver(
                (entries) => {

                    entries.forEach((entry) => {

                        if (entry.isIntersecting) {
                            activeSections.add(
                                entry.target
                            );
                        } else {
                            activeSections.delete(
                                entry.target
                            );
                        }

                    });

                    cursor.classList.toggle(
                        "dark",
                        activeSections.size > 0
                    );

                },
                {
                    threshold: 0.35
                }
            );

        darkSections.forEach((section) => {
            darkObserver.observe(section);
        });

    }


    /* ------------------------------
       CONTACT MODAL + FORM
    ------------------------------ */

    const openContactModal =
        $("#openContactModal");

    const closeContactModal =
        $("#closeContactModal");

    const STORAGE_KEY =
        "coast-contact-draft";


    /* ------------------------------
       TOAST
    ------------------------------ */

    const showToast = (message) => {

        if (!toast || !toastMessage) {
            return;
        }

        toastMessage.textContent =
            message;

        toast.classList.add("show");

        clearTimeout(showToast.timer);

        showToast.timer =
            setTimeout(() => {

                toast.classList.remove("show");

            }, 3200);
    };


    /* ------------------------------
       MODAL
    ------------------------------ */

    const setModal = (open) => {

        if (!contactModal) {
            return;
        }

        contactModal.classList.toggle(
            "open",
            open
        );

        contactModal.setAttribute(
            "aria-hidden",
            String(!open)
        );

        body.classList.toggle(
            "modal-open",
            open
        );

        if (open) {

            setTimeout(
                () => {

                    $(
                        "input, select, textarea",
                        contactForm
                    )?.focus();

                },
                80
            );

        } else {

            openContactModal?.focus();

        }
    };


    openContactModal?.addEventListener(
        "click",
        () => setModal(true)
    );

    closeContactModal?.addEventListener(
        "click",
        () => setModal(false)
    );

    contactModal?.addEventListener(
        "click",
        (event) => {

            if (
                event.target.matches(
                    "[data-close-modal]"
                )
            ) {
                setModal(false);
            }

        }
    );


    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key !== "Escape") {
                return;
            }

            if (
                contactModal?.classList.contains(
                    "open"
                )
            ) {
                setModal(false);
            }

            if (
                mobileMenu?.classList.contains(
                    "open"
                )
            ) {
                closeMobileMenu();
            }

        }
    );


    /* ------------------------------
       CONTACT FORM
    ------------------------------ */

    if (contactForm) {

        const fields =
            $$(
                "input, select, textarea",
                contactForm
            );


        /* DRAFT SAVING */

        const saveDraft = () => {

            const data =
                Object.fromEntries(
                    new FormData(
                        contactForm
                    ).entries()
                );

            try {

                localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify(data)
                );

            } catch {}

        };


        /* FIELD ERRORS */

        const clearFieldError =
            (field) => {

                field.classList.remove(
                    "invalid"
                );

                const error =
                    field.parentElement.querySelector(
                        ".field-error"
                    );

                if (error) {
                    error.textContent = "";
                }
            };


        const setFieldError =
            (field, message) => {

                field.classList.add(
                    "invalid"
                );

                const error =
                    field.parentElement.querySelector(
                        ".field-error"
                    );

                if (error) {
                    error.textContent =
                        message;
                }
            };


        /* VALIDATION */

        const validateField =
            (field) => {

                clearFieldError(field);

                if (!field.value.trim()) {

                    setFieldError(
                        field,
                        "This field is required."
                    );

                    return false;
                }

                if (
                    field.name === "name" &&
                    field.value.trim().length < 2
                ) {

                    setFieldError(
                        field,
                        "Please enter your name."
                    );

                    return false;
                }

                if (
                    field.name === "email" &&
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
                        .test(field.value.trim())
                ) {

                    setFieldError(
                        field,
                        "Please enter a valid email."
                    );

                    return false;
                }

                if (
                    field.name === "message" &&
                    field.value.trim().length < 10
                ) {

                    setFieldError(
                        field,
                        "Please give us a little more detail."
                    );

                    return false;
                }

                return true;
            };


        /* RESTORE SAVED DRAFT */

        try {

            const saved =
                JSON.parse(
                    localStorage.getItem(
                        STORAGE_KEY
                    ) || "null"
                );

            if (saved) {

                fields.forEach((field) => {

                    if (
                        saved[field.name] !== undefined
                    ) {
                        field.value =
                            saved[field.name];
                    }

                });

            }

        } catch {}


        /* LIVE DRAFT SAVING */

        fields.forEach((field) => {

            field.addEventListener(
                "input",
                () => {

                    clearFieldError(field);
                    saveDraft();

                }
            );

            field.addEventListener(
                "change",
                saveDraft
            );

        });


        /* REAL FORM SUBMISSION */

        contactForm.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();


                /* Validate */

                const valid =
                    fields.every(
                        validateField
                    );

                if (!valid) {

                    showToast(
                        "Please check the highlighted fields."
                    );

                    return;
                }


                /* Get form data */

                const data =
                    Object.fromEntries(
                        new FormData(
                            contactForm
                        ).entries()
                    );


                /* Loading state */

                const submitButton =
                    contactForm.querySelector(
                        ".form-submit"
                    );

                const originalButtonHTML =
                    submitButton?.innerHTML;

                if (submitButton) {

                    submitButton.disabled = true;

                    submitButton.setAttribute(
                        "aria-busy",
                        "true"
                    );

                    submitButton.innerHTML =
                        `
                        <span>SENDING...</span>
                        <span>↗</span>
                        `;
                }


                try {

                    const response =
                        await fetch(
                            "/api/contact",
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json",

                                    "Accept":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify({
                                        name:
                                            data.name,

                                        email:
                                            data.email,

                                        type:
                                            data.type,

                                        message:
                                            data.message
                                    })
                            }
                        );


                    let result = null;

                    try {
                        result =
                            await response.json();
                    } catch {}


                    if (!response.ok) {

                        throw new Error(
                            result?.error ||
                            "Something went wrong."
                        );
                    }


                    /* Success */

                    try {

                        localStorage.removeItem(
                            STORAGE_KEY
                        );

                    } catch {}


                    contactForm.reset();

                    setModal(false);

                    showToast(
                        "Enquiry sent. We'll be in touch."
                    );


                } catch (error) {

                    console.error(
                        "COAST enquiry error:",
                        error
                    );

                    showToast(
                        error?.message ||
                        "Could not send the enquiry. Please try again."
                    );

                } finally {

                    if (submitButton) {

                        submitButton.disabled =
                            false;

                        submitButton.removeAttribute(
                            "aria-busy"
                        );

                        submitButton.innerHTML =
                            originalButtonHTML ||
                            `
                            <span>SEND ENQUIRY</span>
                            <span>↗</span>
                            `;

                    }

                }

            }
        );

    }


    /* ------------------------------
       FOOTER YEAR
    ------------------------------ */

    const currentYear =
        $("#currentYear");

    if (currentYear) {

        currentYear.textContent =
            new Date().getFullYear();

    }

})();