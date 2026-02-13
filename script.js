// Theme Toggle Functionality
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Load saved theme preference or default to dark
const savedTheme = localStorage.getItem('theme') || 'dark';
body.classList.toggle('dark-theme', savedTheme === 'dark');

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    const isDark = body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Medium Articles - Using static content for reliability
function loadMediumArticles() {
    const articlesContainer = document.getElementById('medium-articles');
    
    // Display your recent articles directly (more reliable than RSS feed)
    articlesContainer.innerHTML = `
        <a href="https://medium.com/@antoneh/beyond-individual-achievement-reimagining-education-as-community-liberation-5c593699525f" target="_blank" class="article-link">
            <article class="article-item">
                <h3 class="article-title">Beyond Individual Achievement: Reimagining Education as Community Liberation</h3>
                <p class="article-description">Photo by Muhammad-Taha Ibrahim on Unsplash. Frederick Douglass understood what modern neuroscience now confirms: the mind under duress cannot fully embrace learning...</p>
                <div class="article-meta">
                    <div style="display: flex; align-items: center; gap: 0.25rem;">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M8 2v4"></path>
                            <path d="M16 2v4"></path>
                            <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                            <path d="M3 10h18"></path>
                        </svg>
                        <span>2/11/2026</span>
                    </div>
                    <div class="article-read-more" style="display: flex; align-items: center; gap: 0.25rem;">
                        <span>Read Article</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M5 12h14"></path>
                            <path d="m12 5 7 7-7 7"></path>
                        </svg>
                    </div>
                </div>
            </article>
        </a>
        <a href="https://medium.com/@antoneh/surviving-the-pain-patience-bond-through-peace-13f45a23b565" target="_blank" class="article-link">
            <article class="article-item">
                <h3 class="article-title">Surviving the Pain-Patience Bond through Peace</h3>
                <p class="article-description">I've come to the realization that pain is the byproduct of patience. They are inseparable. Like instruments in a symphony, they blend into a harmonious whole...</p>
                <div class="article-meta">
                    <div style="display: flex; align-items: center; gap: 0.25rem;">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M8 2v4"></path>
                            <path d="M16 2v4"></path>
                            <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                            <path d="M3 10h18"></path>
                        </svg>
                        <span>12/29/2024</span>
                    </div>
                    <div class="article-read-more" style="display: flex; align-items: center; gap: 0.25rem;">
                        <span>Read Article</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M5 12h14"></path>
                            <path d="m12 5 7 7-7 7"></path>
                        </svg>
                    </div>
                </div>
            </article>
        </a>
        <a href="https://medium.com/transforming-the-mans-mind/4-words-to-traverse-stress-paralysis-31184d7cfbf9" target="_blank" class="article-link">
            <article class="article-item">
                <h3 class="article-title">4 Words to Traverse Stress Paralysis</h3>
                <p class="article-description">Stress — that unwelcome life companion — may be nature's most potent medicine: bitter yet transformative. Repeatedly paralyzed by its grip, I discovered that breaking free is vital...</p>
                <div class="article-meta">
                    <div style="display: flex; align-items: center; gap: 0.25rem;">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M8 2v4"></path>
                            <path d="M16 2v4"></path>
                            <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                            <path d="M3 10h18"></path>
                        </svg>
                        <span>12/27/2024</span>
                    </div>
                    <div class="article-read-more" style="display: flex; align-items: center; gap: 0.25rem;">
                        <span>Read Article</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M5 12h14"></path>
                            <path d="m12 5 7 7-7 7"></path>
                        </svg>
                    </div>
                </div>
            </article>
        </a>
    `;
}

// Load Medium articles immediately when page loads
loadMediumArticles();

// Trigger fade-in animations on page load
window.addEventListener('DOMContentLoaded', () => {
    // Add animate class to all fade-in elements
    document.querySelectorAll('.fade-in-left').forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('animate');
        }, 50); // Small delay to ensure CSS is loaded
    });
});

// Smooth Scroll
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

// Gallery item click handlers (placeholder for V2 backend integration)
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', function() {
        console.log('Gallery item clicked - ready for backend integration');
    });
});

// Image Modal functionality for "Recent Creations" section only
const imageModal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalClose = document.getElementById('modalClose');

// Get all gallery items in "Recent Creations" section (not "What I'm Reading")
const recentCreationsSection = document.querySelectorAll('.section-two-col')[2]; // 3rd section is Recent Creations
const creationItems = recentCreationsSection ? recentCreationsSection.querySelectorAll('.gallery-item') : [];

creationItems.forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        const img = this.querySelector('img');
        if (img) {
            modalImage.src = img.src;
            imageModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
        }
    });
});

// Close modal when clicking the X button
modalClose.addEventListener('click', function() {
    imageModal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
});

// Close modal when clicking outside the image
imageModal.addEventListener('click', function(e) {
    if (e.target === imageModal) {
        imageModal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && imageModal.classList.contains('active')) {
        imageModal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Admin login click handler
const adminLogin = document.getElementById('admin-login');
if (adminLogin) {
    adminLogin.addEventListener('click', function(e) {
        console.log('Admin login clicked - ready for Firebase integration');
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateX(0)';
        }
    });
}, observerOptions);

// Observe fade-in elements
document.querySelectorAll('.fade-in-left').forEach(element => {
    observer.observe(element);
});

// Lazy loading for images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}
