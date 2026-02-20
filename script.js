// DOM Elements
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navButtons = document.querySelector('.nav-buttons');

// DEBUG: Log element availability
console.log('=== script.js Debug ===');
console.log('Navbar:', navbar ? 'FOUND' : 'MISSING');
console.log('Hamburger:', hamburger ? 'FOUND' : 'MISSING');
console.log('NavLinks:', navLinks ? 'FOUND' : 'MISSING');
console.log('NavButtons:', navButtons ? 'FOUND' : 'MISSING');

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    navButtons.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu on click
            navLinks.classList.remove('active');
            navButtons.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
});

// Intersection Observer for Animations (Fade in on scroll)
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card, .hero-content, .hero-visual').forEach(el => {
    el.classList.add('fade-in'); // Add initial class
    observer.observe(el);
});


// Login/Signup Simulation
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');

if (loginBtn) {
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const username = prompt("Welcome Back! What's your explorer name?", "Kid Explorer");
        if (username) {
            const welcomeMsg = `Welcome back, ${username}! Let's continue our adventure!`;
            alert(welcomeMsg);
            speak(welcomeMsg);
            loginBtn.innerText = username;
            loginBtn.style.color = 'var(--secondary)';
        }
    });
}

if (signupBtn) {
    signupBtn.addEventListener('click', (e) => {
        e.preventDefault();
        alert("Yay! You're about to join the WonderKids club! Ask a parent to help you finish signing up. 🎉");
    });
}

// Add sound effects or visual feedback for kids
document.querySelectorAll('.btn-primary, .btn-secondary, .feature-card').forEach(el => {
    el.addEventListener('mousedown', () => {
        el.style.transform = 'scale(0.95)';
    });
    el.addEventListener('mouseup', () => {
        el.style.transform = 'scale(1)';
    });
});

console.log('WonderKids App Engine Started! 🚀');
