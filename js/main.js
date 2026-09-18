// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Active navigation on scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Contact form submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Message Sent!';
        submitBtn.disabled = true;
        contactForm.reset();
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 3000);
    });
}

// Project carousels (research page) — shows up to 4 cards, scrolls a page at a time
document.querySelectorAll('.project-carousel').forEach(carousel => {
    const track = carousel.querySelector('.project-track');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    if (!track || !prevBtn || !nextBtn) return;

    function visibleCardCount() {
        const card = track.querySelector('.project-card');
        if (!card) return 4;
        const style = getComputedStyle(track);
        const gap = parseFloat(style.columnGap || style.gap || '0');
        const cardWidth = card.getBoundingClientRect().width + gap;
        return Math.max(1, Math.round(track.clientWidth / cardWidth));
    }

    function pageScrollAmount() {
        const card = track.querySelector('.project-card');
        if (!card) return track.clientWidth;
        const style = getComputedStyle(track);
        const gap = parseFloat(style.columnGap || style.gap || '0');
        return (card.getBoundingClientRect().width + gap) * visibleCardCount();
    }

    function update() {
        const maxScroll = track.scrollWidth - track.clientWidth;
        const overflowing = maxScroll > 4;
        prevBtn.classList.toggle('is-hidden', !overflowing);
        nextBtn.classList.toggle('is-hidden', !overflowing);
        prevBtn.disabled = track.scrollLeft <= 4;
        nextBtn.disabled = track.scrollLeft >= maxScroll - 4;
    }

    prevBtn.addEventListener('click', () => {
        track.scrollBy({ left: -pageScrollAmount(), behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', () => {
        track.scrollBy({ left: pageScrollAmount(), behavior: 'smooth' });
    });
    track.addEventListener('scroll', update);
    window.addEventListener('resize', update);
    window.addEventListener('load', update);
    update();
});