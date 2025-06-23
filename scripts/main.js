// تهيئة المتغيرات العامة
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// تهيئة الموقع
function initializeWebsite() {
    initNavigation();
    initScrollEffects();
    initContactForm();
    initAnimations();
    initBackToTop();
    initResponsiveNavigation();
}

// تهيئة التنقل
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    
    // إضافة مستمع أحداث لكل رابط في القائمة
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // التمرير السلس للقسم المطلوب
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // تحديث الرابط النشط
                updateActiveNavLink(this);
                
                // إغلاق القائمة في الموبايل
                closeNavMenu();
            }
        });
    });
    
    // تحديث الرابط النشط عند التمرير
    window.addEventListener('scroll', throttle(updateActiveNavOnScroll, 100));
}

// تحديث الرابط النشط
function updateActiveNavLink(activeLink) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

// تحديث الرابط النشط عند التمرير
function updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach((section, index) => {
        if (scrollPosition >= section.offsetTop && 
            scrollPosition < section.offsetTop + section.offsetHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            const correspondingLink = document.querySelector(`a[href="#${section.id}"]`);
            if (correspondingLink) {
                correspondingLink.classList.add('active');
            }
        }
    });
}

// تأثيرات التمرير
function initScrollEffects() {
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', throttle(function() {
        // تأثير شريط التنقل عند التمرير
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // تحريك العناصر عند ظهورها
        animateOnScroll();
        
    }, 10));
}

// تحريك العناصر عند ظهورها في منطقة العرض
function animateOnScroll() {
    const elements = document.querySelectorAll('.fade-in, .service-card, .feature-card');
    
    elements.forEach(element => {
        if (isElementInViewport(element) && !element.classList.contains('animated')) {
            element.classList.add('animated');
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// التحقق من وجود العنصر في منطقة العرض
function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// تهيئة نموذج الاتصال
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission();
        });
        
        // التحقق من صحة البيانات أثناء الكتابة
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
    }
}

// التعامل مع إرسال النموذج
function handleFormSubmission() {
    const form = document.getElementById('contact-form');
    const formData = new FormData(form);
    const formStatus = document.getElementById('form-status');
    
    // إخفاء رسائل الخطأ السابقة
    clearFormErrors();
    
    // التحقق من صحة جميع الحقول
    if (!validateForm()) {
        return;
    }
    
    // عرض رسالة التحميل
    showFormStatus('جاري إرسال الرسالة...', 'loading');
    
    // محاكاة إرسال النموذج (في التطبيق الحقيقي سيتم إرسال البيانات للخادم)
    setTimeout(() => {
        // محاكاة نجاح الإرسال
        const success = Math.random() > 0.2; // 80% نسبة نجاح
        
        if (success) {
            showFormStatus('تم إرسال رسالتكم بنجاح! سنتواصل معكم قريباً.', 'success');
            form.reset();
        } else {
            showFormStatus('عذراً، حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.', 'error');
        }
    }, 2000);
}

// التحقق من صحة النموذج
function validateForm() {
    const form = document.getElementById('contact-form');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// التحقق من صحة حقل واحد
function validateField(field) {
    const fieldContainer = field.parentElement;
    const errorElement = fieldContainer.querySelector('.error-message');
    let isValid = true;
    let errorMessage = '';
    
    // إزالة حالة الخطأ السابقة
    fieldContainer.classList.remove('error');
    
    // التحقق من الحقول المطلوبة
    if (field.hasAttribute('required') && !field.value.trim()) {
        isValid = false;
        errorMessage = 'هذا الحقل مطلوب';
    }
    
    // التحقق من البريد الإلكتروني
    if (field.type === 'email' && field.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value.trim())) {
            isValid = false;
            errorMessage = 'يرجى إدخال بريد إلكتروني صحيح';
        }
    }
    
    // التحقق من رقم الهاتف
    if (field.type === 'tel' && field.value.trim()) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(field.value.trim())) {
            isValid = false;
            errorMessage = 'يرجى إدخال رقم هاتف صحيح';
        }
    }
    
    // التحقق من طول الرسالة
    if (field.name === 'message' && field.value.trim()) {
        if (field.value.trim().length < 10) {
            isValid = false;
            errorMessage = 'يجب أن تكون الرسالة أكثر من 10 أحرف';
        }
    }
    
    // عرض رسالة الخطأ
    if (!isValid) {
        fieldContainer.classList.add('error');
        if (errorElement) {
            errorElement.textContent = errorMessage;
        }
    }
    
    return isValid;
}

// مسح أخطاء النموذج
function clearFormErrors() {
    const errorContainers = document.querySelectorAll('.form-group.error');
    errorContainers.forEach(container => {
        container.classList.remove('error');
    });
}

// عرض حالة النموذج
function showFormStatus(message, type) {
    const formStatus = document.getElementById('form-status');
    if (formStatus) {
        formStatus.textContent = message;
        formStatus.className = `form-status ${type}`;
        formStatus.style.display = 'block';
        
        // إخفاء الرسالة بعد 5 ثواني (ما عدا رسائل التحميل)
        if (type !== 'loading') {
            setTimeout(() => {
                formStatus.style.display = 'none';
            }, 5000);
        }
    }
}

// تهيئة الحركات والتأثيرات
function initAnimations() {
    // تحريك الأرقام في قسم الإحصائيات
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumber(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    statNumbers.forEach(stat => {
        // تحديد القيمة الأولية
        stat.textContent = '0';
        statsObserver.observe(stat);
    });
    
    // تهيئة تأثيرات التمرير للعناصر الأخرى
    initScrollAnimations();
}

// تحريك الأرقام
function animateNumber(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // مدة الحركة بالميلي ثانية
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, duration / steps);
}

// تهيئة تأثيرات التمرير
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.service-card, .feature-card');
    
    const animationObserver = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100); // تأخير تدريجي
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        animationObserver.observe(element);
    });
}

// تهيئة زر العودة للأعلى
function initBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');
    
    if (backToTopButton) {
        // عرض/إخفاء الزر عند التمرير
        window.addEventListener('scroll', throttle(function() {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        }, 100));
        
        // وظيفة العودة للأعلى
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// تهيئة التنقل المتجاوب
function initResponsiveNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // إغلاق القائمة عند النقر خارجها
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
        
        // إغلاق القائمة عند تغيير حجم النافذة
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

// إغلاق قائمة التنقل
function closeNavMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
}

// التمرير إلى قسم معين
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// دالة تحديد معدل استدعاء الوظائف (Throttle)
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// دالة تأخير استدعاء الوظائف (Debounce)
function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// وظائف مساعدة إضافية

// التحقق من دعم المتصفح للميزات الحديثة
function checkBrowserSupport() {
    const features = {
        intersectionObserver: 'IntersectionObserver' in window,
        smoothScroll: 'scrollBehavior' in document.documentElement.style,
        cssGrid: CSS.supports('display', 'grid'),
        flexbox: CSS.supports('display', 'flex')
    };
    
    // إضافة classes للجسم بناءً على الدعم
    Object.keys(features).forEach(feature => {
        if (features[feature]) {
            document.body.classList.add(`supports-${feature}`);
        } else {
            document.body.classList.add(`no-${feature}`);
        }
    });
    
    return features;
}

// تحسين الأداء - تحميل lazy للصور
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // بديل للمتصفحات القديمة
        images.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        });
    }
}

// إضافة مستمعات أحداث إضافية عند تحميل الصفحة
window.addEventListener('load', function() {
    // التحقق من دعم المتصفح
    checkBrowserSupport();
    
    // تهيئة التحميل البطيء للصور
    initLazyLoading();
    
    // إضافة تأثيرات إضافية
    addAccessibilityFeatures();
});

// إضافة ميزات الوصولية
function addAccessibilityFeatures() {
    // إضافة تنقل بلوحة المفاتيح
    document.addEventListener('keydown', function(e) {
        // التنقل بين الروابط باستخدام Tab
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
        
        // إغلاق النوافذ المنبثقة بـ Escape
        if (e.key === 'Escape') {
            closeNavMenu();
        }
    });
    
    // إزالة تأشير التنقل بلوحة المفاتيح عند استخدام الماوس
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // إضافة تلميحات للعناصر التفاعلية
    const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
    interactiveElements.forEach(element => {
        if (!element.getAttribute('title') && !element.getAttribute('aria-label')) {
            // إضافة تلميحات مناسبة بناءً على نوع العنصر
            if (element.type === 'submit') {
                element.setAttribute('title', 'إرسال النموذج');
            } else if (element.classList.contains('back-to-top')) {
                element.setAttribute('title', 'العودة إلى الأعلى');
            }
        }
    });
}

// معالجة الأخطاء العامة
window.addEventListener('error', function(e) {
    console.error('حدث خطأ في الموقع:', e.error);
});

// معالجة الوعود المرفوضة
window.addEventListener('unhandledrejection', function(e) {
    console.error('وعد مرفوض:', e.reason);
});

// تصدير الوظائف للاستخدام العام (إذا لزم الأمر)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        scrollToSection,
        validateField,
        throttle,
        debounce
    };
}
