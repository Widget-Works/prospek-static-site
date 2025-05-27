// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) { // Check if question element exists
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                // Close all FAQ items
                faqItems.forEach(faqItem => {
                    faqItem.classList.remove('active');
                });
                
                // Open clicked item if it wasn't active
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });
    
    // Smooth Scrolling for Anchor Links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            // Check if it's a valid selector and not just "#"
            if (targetId && targetId.length > 1 && targetId.startsWith("#")) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault(); // Only prevent default if we found a target
                    const header = document.querySelector('.header');
                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Hide/Show Header on Scroll
    const header = document.querySelector('.header');
    if (header) { // Check if header exists
        let lastScrollTop = 0;
        let scrollTimeout;
        
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            clearTimeout(scrollTimeout);
            
            scrollTimeout = setTimeout(() => {
                if (scrollTop > lastScrollTop && scrollTop > 100) {
                    header.classList.add('hidden');
                } else {
                    header.classList.remove('hidden');
                }
                lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
            }, 10);
            
            if (scrollTop > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.backdropFilter = 'blur(20px)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            }
        });
    }
    
    // Scroll-triggered Animations
    const animatedSections = document.querySelectorAll('.section');
    if (animatedSections.length > 0) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const elements = entry.target.querySelectorAll('.animate-element');
                    elements.forEach((element, index) => {
                        setTimeout(() => {
                            element.classList.add('animate');
                        }, index * 150); 
                    });
                    // observer.unobserve(entry.target); // Optional: unobserve after animation
                }
            });
        }, observerOptions);
        
        animatedSections.forEach(section => {
            observer.observe(section);
        });
    }
    
    const heroSection = document.querySelector('.hero');
    if (heroSection && heroSection.querySelectorAll('.animate-element').length > 0) { // Check if hero has animatable elements
        const heroObserverOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
        const heroObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const elements = entry.target.querySelectorAll('.animate-element');
                    elements.forEach((element, index) => {
                        setTimeout(() => { element.classList.add('animate'); }, index * 150);
                    });
                    // heroObserver.unobserve(entry.target); // Optional
                }
            });
        }, heroObserverOptions);
        heroObserver.observe(heroSection);
    }
    
    // Button Hover Effects (Removed as it's handled by CSS :hover now)
    // const buttons = document.querySelectorAll('.btn');
    // buttons.forEach(button => {
    //     button.addEventListener('mouseenter', function() { this.style.transform = 'scale(1.05)'; });
    //     button.addEventListener('mouseleave', function() { this.style.transform = 'scale(1)'; });
    // });
    
    // Feature cards scroll animation
    function handleFeatureCardAnimation() {
        const featureCards = document.querySelectorAll('.feature-card');
        if (featureCards.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });

        featureCards.forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.2}s`;
            observer.observe(card);
        });
    }
    handleFeatureCardAnimation();

    // Set current year in footer
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // ===== REGISTRATION FORM VALIDATION =====
    const registrationForm = document.getElementById('registrationForm');

    if (registrationForm) {
        const WEBHOOK_URL = "https://control.widgetworks.id/webhook/registration-form";
        const formState = {
            isValid: false,
            buttonState: "Disabled", // "Disabled", "Default", "Loading", "Error", "Success"
        };
        const touched = new Map(); // Map<string, boolean>

        const accountNameInput = document.querySelector("input[name='account_name']");
        const userNameInput = document.querySelector("input[name='user_name']");
        const phoneInput = document.querySelector("input[name='phone']");
        const emailInput = document.querySelector("input[name='email']"); // Already used in Framer script
        // const termsCheckbox = document.getElementById('terms'); // Removed
        const submitButton = document.getElementById('submitButton');
        const buttonTextSpan = submitButton ? submitButton.querySelector('.button-text') : null;
        const formServerMessage = document.getElementById('formServerMessage');


        if (!accountNameInput || !userNameInput || !phoneInput || !emailInput || !submitButton || !buttonTextSpan || /* !termsCheckbox || */ !formServerMessage) {
            console.error("One or more form elements for validation are missing (termsCheckbox removed).");
        } else {
            registrationForm.setAttribute("novalidate", "true");

            const getInput = (name) => document.querySelector(`input[name='${name}']`);

            const displayErrorMessage = (inputElement, message) => {
                const parentContainer = inputElement.parentElement; // Assumes error <p> is sibling
                if (!parentContainer) return;
                const errorMessageContainer = parentContainer.querySelector(".error-message");
                const label = registrationForm.querySelector(`label[for='${inputElement.id}']`);
                if (errorMessageContainer) {
                    errorMessageContainer.textContent = message;
                }
                inputElement.classList.add("error");
                if (label) label.classList.add("label-error");
            };

            const clearErrorMessage = (inputElement) => {
                const parentContainer = inputElement.parentElement;
                if (!parentContainer) return;
                const errorMessageContainer = parentContainer.querySelector(".error-message");
                const label = registrationForm.querySelector(`label[for='${inputElement.id}']`);
                if (errorMessageContainer) {
                    errorMessageContainer.textContent = "";
                }
                inputElement.classList.remove("error");
                if (label) label.classList.remove("label-error");
            };
            
            const validatePhoneNumber = () => {
                if (!phoneInput) return false;
                let value = phoneInput.value.trim();
                const originalValueForTouchedCheck = value; // For checking if user actually typed
                
                value = value.replace(/[^\d]/g, "");
                if (value.startsWith("0")) {
                    value = "62" + value.slice(1);
                }
                // Only update input value if it has changed through formatting
                if (phoneInput.value.trim() !== value && value.startsWith("62")) {
                     phoneInput.value = value;
                }


                if (touched.get("phone") && originalValueForTouchedCheck === "") {
                    displayErrorMessage(phoneInput, "Nomor Whatsapp harus diisi.");
                    return false;
                } else if (originalValueForTouchedCheck !== "" && !/^62\d{7,13}$/.test(value) && !/^\d{7,15}$/.test(originalValueForTouchedCheck.replace(/[^\d]/g, ""))) {
                     // Allow 08xxxx (becomes 628xxx) or direct 628xxx. Total digits after 62: 7-13. Original: 7-15.
                    displayErrorMessage(phoneInput, "Nomor Whatsapp harus valid (7-15 digit).");
                    return false;
                }
                if (originalValueForTouchedCheck !== "") clearErrorMessage(phoneInput); // Clear only if not empty and valid
                return originalValueForTouchedCheck === "" || (/^62\d{7,13}$/.test(value) || /^\d{7,15}$/.test(originalValueForTouchedCheck.replace(/[^\d]/g, "")));
            };

            const validateNameField = (fieldName, labelName) => {
                const input = getInput(fieldName);
                if (!input) return false;
                const value = input.value.trim();
                if (touched.get(fieldName) && value === "") {
                    displayErrorMessage(input, `${labelName} harus diisi.`);
                    return false;
                } else if (value !== "" && !/^[a-zA-Z0-9\s']+$/.test(value)) { // Allow apostrophe
                    displayErrorMessage(input, `${labelName} hanya boleh menggunakan huruf, angka, spasi, dan apostrof.`);
                    return false;
                }
                if (value !== "") clearErrorMessage(input);
                return value === "" || /^[a-zA-Z0-9\s']+$/.test(value);
            };

            const validateEmailField = () => {
                if (!emailInput) return false;
                const value = emailInput.value.trim();
                const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                if (touched.get("email") && value === "") {
                    displayErrorMessage(emailInput, "Email harus diisi.");
                    return false;
                } else if (value !== "" && !emailPattern.test(value)) {
                    displayErrorMessage(emailInput, "Email tidak valid.");
                    return false;
                }
                if (value !== "") clearErrorMessage(emailInput);
                return value === "" || emailPattern.test(value);
            };

            // const validateTerms = () => { // Removed
            //     if (!termsCheckbox.checked) {
            //         return false;
            //     }
            //     return true;
            // };

            const updateButtonUI = () => {
                submitButton.classList.remove("loading", "disabled", "success", "error-state");
                submitButton.disabled = false;
                buttonTextSpan.textContent = "Daftar"; // Default text

                switch (formState.buttonState) {
                    case "Disabled":
                        submitButton.classList.add("disabled");
                        submitButton.disabled = true;
                        break;
                    case "Loading":
                        submitButton.classList.add("loading");
                        buttonTextSpan.innerHTML = ""; // Clear text, spinner is shown via CSS
                        // Spinner span is already child of button: <span class="spinner"></span>
                        submitButton.disabled = true;
                        break;
                    case "Success":
                        submitButton.classList.add("success");
                        buttonTextSpan.textContent = "Berhasil"; // User feedback: "Berhasil"
                        break;
                    case "Error":
                        submitButton.classList.add("error-state");
                        buttonTextSpan.textContent = "Tidak Berhasil"; // User feedback
                        break;
                    case "Default":
                        // No specific class, relies on .btn-primary
                        break;
                }
            };
            
            const updateOverallFormState = () => {
                const isPhoneValid = validatePhoneNumber();
                const isAccountNameValid = validateNameField("account_name", "Nama Bisnis");
                const isUserNameValid = validateNameField("user_name", "Nama Pengguna");
                const isEmailValid = validateEmailField();
                // const isTermsChecked = validateTerms(); // Removed

                formState.isValid = isPhoneValid && isAccountNameValid && isUserNameValid && isEmailValid; // Removed isTermsChecked
                formState.buttonState = formState.isValid ? "Default" : "Disabled";
                
                // If any field was touched and is now empty, but form isn't fully valid yet for other reasons,
                // keep button disabled but don't switch to "Default" if it was already e.g. "Error" from server
                if (formState.buttonState === "Disabled" && submitButton.classList.contains('error-state')) {
                    // If it was a server error, and now client-side invalid, keep it looking like a server error until fixed
                } else {
                     updateButtonUI();
                }
            };

            const attachValidationListener = (inputElement, fieldName, validateFn) => {
                if (!inputElement) return;
                const handleEvent = () => {
                    if (formServerMessage && formServerMessage.textContent !== '') { // Clear server message on input
                        formServerMessage.textContent = '';
                        formServerMessage.className = '';
                    }
                    touched.set(fieldName, true);
                    validateFn(); // Individual validation might show/clear its own error
                    updateOverallFormState(); // Update overall state and button
                };
                inputElement.addEventListener("blur", handleEvent);
                inputElement.addEventListener("input", handleEvent);
            };

            attachValidationListener(phoneInput, "phone", validatePhoneNumber);
            attachValidationListener(accountNameInput, "account_name", () => validateNameField("account_name", "Nama Bisnis"));
            attachValidationListener(userNameInput, "user_name", () => validateNameField("user_name", "Nama Pengguna"));
            attachValidationListener(emailInput, "email", validateEmailField);
            // if(termsCheckbox) { // Removed
            //     termsCheckbox.addEventListener('change', updateOverallFormState);
            // }


            registrationForm.addEventListener("submit", async (event) => {
                event.preventDefault();
                touched.set("account_name", true); // Mark all as touched on submit attempt
                touched.set("user_name", true);
                touched.set("phone", true);
                touched.set("email", true);
                updateOverallFormState(); // Re-validate all and update UI

                if (!formState.isValid) return;

                formState.buttonState = "Loading";
                updateButtonUI();
                formServerMessage.textContent = ''; // Clear previous server messages
                formServerMessage.className = ''; // Clear classes

                try {
                    const formData = {
                        email: emailInput.value.trim(),
                        phone: phoneInput.value.trim(),
                        account_name: accountNameInput.value.trim(),
                        user_name: userNameInput.value.trim(),
                    };

                    const response = await fetch(WEBHOOK_URL, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(formData),
                    });
                    
                    const responseData = await response.json().catch(() => null); // Try to parse JSON, ignore if not JSON

                    if (response.ok) {
                        formState.buttonState = "Success";
                        updateButtonUI();
                        formServerMessage.textContent = responseData?.message || 'Pendaftaran berhasil!';
                        formServerMessage.classList.add('success');
                        setTimeout(() => {
                            window.location.href = "/thank-you"; // Make sure thank-you.html exists
                        }, 2000);
                    } else {
                        formState.buttonState = "Error";
                        updateButtonUI();
                        let errorMessage = "Terjadi kesalahan. Silakan coba lagi.";
                        if (responseData && responseData.message) {
                            errorMessage = responseData.message;
                        } else if (response.status === 409) { // Example: Conflict for existing email
                            errorMessage = "Email sudah terdaftar. Silakan login.";
                        }
                        formServerMessage.textContent = errorMessage;
                        formServerMessage.classList.add('error');
                    }
                } catch (error) {
                    console.error("Form submission error:", error);
                    formState.buttonState = "Error";
                    updateButtonUI();
                    formServerMessage.textContent = 'Tidak dapat terhubung ke server. Periksa koneksi Anda.';
                    formServerMessage.classList.add('error');
                }
            });
            updateOverallFormState(); // Initial state for the button
        }
    }
    // ===== END REGISTRATION FORM VALIDATION =====

});

// Utility Functions (Keep existing ones if they are used elsewhere, or remove if not)
// function debounce(func, wait, immediate) { ... }
// function throttle(func, limit) { ... }

// Console log for debugging
// console.log('Prospek website loaded successfully'); // Original log
