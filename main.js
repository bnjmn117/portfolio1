// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Typing Animation (EVENT-BASED FEATURE)
const typingText = document.getElementById('typingText');
if (typingText) {
    const phrases = [
        "Front-End Developer",
        "UI/UX Enthusiast",
        "Problem Solver",
        "Code Artisan"
    ];
    
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let currentText = '';
    
    function typeEffect() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            currentText = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            currentText = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }
        
        typingText.textContent = currentText;
        
        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            setTimeout(typeEffect, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            setTimeout(typeEffect, 500);
        } else {
            setTimeout(typeEffect, isDeleting ? 50 : 100);
        }
    }
    
    typeEffect();
}

// FORM VALIDATION WITH DYNAMIC FEEDBACK
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        
        // Name validation
        const name = document.getElementById('name');
        const nameError = document.getElementById('nameError');
        if (name.value.trim().length < 2) {
            nameError.textContent = 'Name must be at least 2 characters';
            isValid = false;
        } else {
            nameError.textContent = '';
        }
        
        // Email validation
        const email = document.getElementById('email');
        const emailError = document.getElementById('emailError');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            emailError.textContent = 'Please enter a valid email address';
            isValid = false;
        } else {
            emailError.textContent = '';
        }
        
        // Subject validation
        const subject = document.getElementById('subject');
        const subjectError = document.getElementById('subjectError');
        if (subject.value === '') {
            subjectError.textContent = 'Please select a subject';
            isValid = false;
        } else {
            subjectError.textContent = '';
        }
        
        // Message validation
        const message = document.getElementById('message');
        const messageError = document.getElementById('messageError');
        if (message.value.trim().length < 10) {
            messageError.textContent = 'Message must be at least 10 characters';
            isValid = false;
        } else {
            messageError.textContent = '';
        }
        
        const formFeedback = document.getElementById('formFeedback');
        
        if (isValid) {
            formFeedback.className = 'form-feedback success';
            formFeedback.textContent = '✓ Message sent successfully! I\'ll get back to you soon.';
            
            // Reset form
            contactForm.reset();
            
            // Clear feedback after 5 seconds
            setTimeout(() => {
                formFeedback.style.display = 'none';
            }, 5000);
        } else {
            formFeedback.className = 'form-feedback error';
            formFeedback.textContent = '✗ Please fix the errors above before submitting.';
        }
        
        formFeedback.style.display = 'block';
    });
}

// Project Filtering (EVENT-BASED FEATURE)
const filterBtns = document.querySelectorAll('.filter-btn');
if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            if (typeof loadProjectsFromJSON === 'function') {
                loadProjectsFromJSON(filter);
            }
        });
    });
}

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Update active nav link
            updateActiveNav(this.getAttribute('href'));
        }
    });
});

// Update active navigation link
function updateActiveNav(activeHref) {
    document.querySelectorAll('.dashboard-nav a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === activeHref) {
            link.classList.add('active');
        }
    });
}

// Update active nav on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.pageYOffset >= sectionTop) {
            current = '#' + section.getAttribute('id');
        }
    });
    
    if (current) {
        updateActiveNav(current);
    }
});

// Load data when page loads
document.addEventListener('DOMContentLoaded', () => {
    if (typeof loadSkillsFromXML === 'function') {
        loadSkillsFromXML();
    }
    if (typeof loadProjectsFromJSON === 'function') {
        loadProjectsFromJSON('all');
    }
    
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.skill-card, .project-card, .about-content > div, .contact-wrapper > div').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
});