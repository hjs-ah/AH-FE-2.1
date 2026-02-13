// Firebase services are already declared globally by firebase-config.js
// Just verify they exist
if (typeof auth === 'undefined' || typeof db === 'undefined' || typeof storage === 'undefined') {
    console.error('Firebase services not found! Make sure firebase-config.js loads first.');
    alert('Error: Firebase not initialized properly');
}

console.log('Admin panel loaded - Firebase services:', { auth: !!auth, db: !!db, storage: !!storage });

// DOM Elements
const loginScreen = document.getElementById('loginScreen');
const adminDashboard = document.getElementById('adminDashboard');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');
const userEmail = document.getElementById('userEmail');

// Auth State Observer
auth.onAuthStateChanged(user => {
    if (user) {
        // User is signed in
        loginScreen.style.display = 'none';
        adminDashboard.style.display = 'block';
        userEmail.textContent = user.email;
        loadAllData();
    } else {
        // User is signed out
        loginScreen.style.display = 'flex';
        adminDashboard.style.display = 'none';
    }
});

// Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    console.log('Login attempt for:', email);
    loginError.textContent = 'Signing in...';
    loginError.style.color = 'var(--text-secondary)';
    
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        console.log('Login successful!', userCredential.user.email);
        loginError.textContent = '';
    } catch (error) {
        console.error('Login error:', error.code, error.message);
        loginError.textContent = error.message;
        loginError.style.color = 'var(--error)';
    }
});

// Logout
logoutBtn.addEventListener('click', () => {
    auth.signOut();
});

// Navigation
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        const section = item.dataset.section;
        
        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        // Update active section
        document.querySelectorAll('.admin-section').forEach(sec => sec.classList.remove('active'));
        document.getElementById(`${section}Section`).classList.add('active');
    });
});

// ===== PROFILE SECTION =====

const profileForm = document.getElementById('profileForm');
const profileSuccess = document.getElementById('profileSuccess');
const profileImageUpload = document.getElementById('profileImageUpload');

// Load Profile Data
async function loadProfile() {
    try {
        const doc = await db.collection('portfolio').doc('profile').get();
        if (doc.exists) {
            const data = doc.data();
            document.getElementById('profileName').value = data.name || '';
            document.getElementById('profileTitle').value = data.title || '';
            document.getElementById('profileLocation').value = data.location || '';
            document.getElementById('profileEmail').value = data.email || '';
            document.getElementById('profileImage').value = data.profileImageUrl || '';
            document.getElementById('mediumUrl').value = data.socialLinks?.medium || '';
            document.getElementById('linkedinUrl').value = data.socialLinks?.linkedin || '';
            document.getElementById('behanceUrl').value = data.socialLinks?.behance || '';
        }
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

// Upload Profile Image
profileImageUpload.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
        const storageRef = storage.ref(`profile/${file.name}`);
        await storageRef.put(file);
        const url = await storageRef.getDownloadURL();
        document.getElementById('profileImage').value = url;
        profileSuccess.textContent = 'Image uploaded successfully!';
        setTimeout(() => profileSuccess.textContent = '', 3000);
    } catch (error) {
        console.error('Error uploading image:', error);
        alert('Error uploading image: ' + error.message);
    }
});

// Save Profile
profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const profileData = {
        name: document.getElementById('profileName').value,
        title: document.getElementById('profileTitle').value,
        location: document.getElementById('profileLocation').value,
        email: document.getElementById('profileEmail').value,
        profileImageUrl: document.getElementById('profileImage').value,
        socialLinks: {
            medium: document.getElementById('mediumUrl').value,
            linkedin: document.getElementById('linkedinUrl').value,
            behance: document.getElementById('behanceUrl').value
        }
    };
    
    try {
        await db.collection('portfolio').doc('profile').set(profileData, { merge: true });
        profileSuccess.textContent = 'Profile saved successfully!';
        setTimeout(() => profileSuccess.textContent = '', 3000);
    } catch (error) {
        console.error('Error saving profile:', error);
        alert('Error saving profile: ' + error.message);
    }
});

// ===== ARTICLES SECTION =====

const articlesList = document.getElementById('articlesList');
const addArticleBtn = document.getElementById('addArticleBtn');
const articleModal = document.getElementById('articleModal');
const articleForm = document.getElementById('articleForm');

// Load Articles
async function loadArticles() {
    try {
        const snapshot = await db.collection('portfolio').doc('content').collection('articles')
            .orderBy('date', 'desc').get();
        
        articlesList.innerHTML = '';
        
        if (snapshot.empty) {
            articlesList.innerHTML = '<p style="color: var(--text-secondary);">No articles yet. Click "Add Article" to create one.</p>';
            return;
        }
        
        snapshot.forEach(doc => {
            const article = doc.data();
            const card = document.createElement('div');
            card.className = 'item-card';
            card.innerHTML = `
                <div class="item-info">
                    <h3>${article.title}</h3>
                    <p>${article.description.substring(0, 100)}...</p>
                    <small style="color: var(--text-muted);">${new Date(article.date).toLocaleDateString()}</small>
                </div>
                <div class="item-actions">
                    <button class="btn-icon edit-article" data-id="${doc.id}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button class="btn-icon delete delete-article" data-id="${doc.id}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            `;
            articlesList.appendChild(card);
        });
        
        // Add event listeners
        document.querySelectorAll('.edit-article').forEach(btn => {
            btn.addEventListener('click', () => editArticle(btn.dataset.id));
        });
        
        document.querySelectorAll('.delete-article').forEach(btn => {
            btn.addEventListener('click', () => deleteArticle(btn.dataset.id));
        });
    } catch (error) {
        console.error('Error loading articles:', error);
    }
}

// Open Article Modal
addArticleBtn.addEventListener('click', () => {
    document.getElementById('articleModalTitle').textContent = 'Add Article';
    articleForm.reset();
    document.getElementById('articleId').value = '';
    articleModal.classList.add('active');
});

// Edit Article
async function editArticle(id) {
    try {
        const doc = await db.collection('portfolio').doc('content').collection('articles').doc(id).get();
        if (doc.exists) {
            const article = doc.data();
            document.getElementById('articleModalTitle').textContent = 'Edit Article';
            document.getElementById('articleId').value = id;
            document.getElementById('articleTitle').value = article.title;
            document.getElementById('articleDescription').value = article.description;
            document.getElementById('articleUrl').value = article.url;
            document.getElementById('articleDate').value = article.date;
            articleModal.classList.add('active');
        }
    } catch (error) {
        console.error('Error loading article:', error);
    }
}

// Save Article
articleForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const articleData = {
        title: document.getElementById('articleTitle').value,
        description: document.getElementById('articleDescription').value,
        url: document.getElementById('articleUrl').value,
        date: document.getElementById('articleDate').value
    };
    
    const articleId = document.getElementById('articleId').value;
    
    try {
        if (articleId) {
            // Update existing
            await db.collection('portfolio').doc('content').collection('articles').doc(articleId).update(articleData);
        } else {
            // Create new
            await db.collection('portfolio').doc('content').collection('articles').add(articleData);
        }
        
        articleModal.classList.remove('active');
        loadArticles();
    } catch (error) {
        console.error('Error saving article:', error);
        alert('Error saving article: ' + error.message);
    }
});

// Delete Article
async function deleteArticle(id) {
    if (!confirm('Are you sure you want to delete this article?')) return;
    
    try {
        await db.collection('portfolio').doc('content').collection('articles').doc(id).delete();
        loadArticles();
    } catch (error) {
        console.error('Error deleting article:', error);
        alert('Error deleting article: ' + error.message);
    }
}

// ===== CREATIONS SECTION =====

const creationsList = document.getElementById('creationsList');
const addCreationBtn = document.getElementById('addCreationBtn');
const creationModal = document.getElementById('creationModal');
const creationForm = document.getElementById('creationForm');
const creationImage = document.getElementById('creationImage');
const creationPreview = document.getElementById('creationPreview');

// Load Creations
async function loadCreations() {
    try {
        const snapshot = await db.collection('portfolio').doc('content').collection('creations')
            .orderBy('order').get();
        
        creationsList.innerHTML = '';
        
        if (snapshot.empty) {
            creationsList.innerHTML = '<p style="color: var(--text-secondary);">No creations yet. Click "Add Creation" to upload one.</p>';
            return;
        }
        
        snapshot.forEach(doc => {
            const creation = doc.data();
            const card = document.createElement('div');
            card.className = 'gallery-card';
            card.innerHTML = `
                <img src="${creation.imageUrl}" alt="${creation.title || 'Creation'}" class="gallery-image">
                ${creation.title ? `<div class="gallery-info"><h4>${creation.title}</h4></div>` : ''}
                <div class="gallery-actions">
                    <button class="btn-icon delete delete-creation" data-id="${doc.id}" data-url="${creation.imageUrl}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            `;
            creationsList.appendChild(card);
        });
        
        document.querySelectorAll('.delete-creation').forEach(btn => {
            btn.addEventListener('click', () => deleteCreation(btn.dataset.id, btn.dataset.url));
        });
    } catch (error) {
        console.error('Error loading creations:', error);
    }
}

// Preview Creation Image
creationImage.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            creationPreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    }
});

// Open Creation Modal
addCreationBtn.addEventListener('click', () => {
    creationForm.reset();
    creationPreview.innerHTML = '';
    creationModal.classList.add('active');
});

// Save Creation
creationForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const file = creationImage.files[0];
    if (!file) {
        alert('Please select an image');
        return;
    }
    
    try {
        // Upload image
        const storageRef = storage.ref(`creations/${Date.now()}_${file.name}`);
        await storageRef.put(file);
        const imageUrl = await storageRef.getDownloadURL();
        
        // Get current max order
        const snapshot = await db.collection('portfolio').doc('content').collection('creations').get();
        const maxOrder = snapshot.empty ? 0 : Math.max(...snapshot.docs.map(doc => doc.data().order || 0));
        
        // Save to Firestore
        await db.collection('portfolio').doc('content').collection('creations').add({
            title: document.getElementById('creationTitle').value || '',
            imageUrl: imageUrl,
            order: maxOrder + 1
        });
        
        creationModal.classList.remove('active');
        loadCreations();
    } catch (error) {
        console.error('Error saving creation:', error);
        alert('Error saving creation: ' + error.message);
    }
});

// Delete Creation
async function deleteCreation(id, imageUrl) {
    if (!confirm('Are you sure you want to delete this creation?')) return;
    
    try {
        // Delete from Storage
        const imageRef = storage.refFromURL(imageUrl);
        await imageRef.delete();
        
        // Delete from Firestore
        await db.collection('portfolio').doc('content').collection('creations').doc(id).delete();
        
        loadCreations();
    } catch (error) {
        console.error('Error deleting creation:', error);
        alert('Error deleting creation: ' + error.message);
    }
}

// ===== BOOKS SECTION =====

const booksList = document.getElementById('booksList');
const addBookBtn = document.getElementById('addBookBtn');
const bookModal = document.getElementById('bookModal');
const bookForm = document.getElementById('bookForm');
const bookCoverImage = document.getElementById('bookCoverImage');
const bookPreview = document.getElementById('bookPreview');

// Load Books
async function loadBooks() {
    try {
        const snapshot = await db.collection('portfolio').doc('content').collection('books')
            .orderBy('order').get();
        
        booksList.innerHTML = '';
        
        if (snapshot.empty) {
            booksList.innerHTML = '<p style="color: var(--text-secondary);">No books yet. Click "Add Book" to add one.</p>';
            return;
        }
        
        snapshot.forEach(doc => {
            const book = doc.data();
            const card = document.createElement('div');
            card.className = 'gallery-card';
            card.innerHTML = `
                <img src="${book.coverImageUrl}" alt="${book.title}" class="gallery-image">
                <div class="gallery-info">
                    <h4 style="font-size: 0.875rem; margin-bottom: 0.25rem;">${book.title}</h4>
                    <p style="font-size: 0.75rem; color: var(--text-secondary); margin: 0;">${book.author}</p>
                </div>
                <div class="gallery-actions">
                    <button class="btn-icon delete delete-book" data-id="${doc.id}" data-url="${book.coverImageUrl}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            `;
            booksList.appendChild(card);
        });
        
        document.querySelectorAll('.delete-book').forEach(btn => {
            btn.addEventListener('click', () => deleteBook(btn.dataset.id, btn.dataset.url));
        });
    } catch (error) {
        console.error('Error loading books:', error);
    }
}

// Preview Book Cover
bookCoverImage.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            bookPreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    }
});

// Open Book Modal
addBookBtn.addEventListener('click', () => {
    bookForm.reset();
    bookPreview.innerHTML = '';
    bookModal.classList.add('active');
});

// Save Book
bookForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const file = bookCoverImage.files[0];
    if (!file) {
        alert('Please select a book cover image');
        return;
    }
    
    try {
        // Upload image
        const storageRef = storage.ref(`books/${Date.now()}_${file.name}`);
        await storageRef.put(file);
        const coverImageUrl = await storageRef.getDownloadURL();
        
        // Get current max order
        const snapshot = await db.collection('portfolio').doc('content').collection('books').get();
        const maxOrder = snapshot.empty ? 0 : Math.max(...snapshot.docs.map(doc => doc.data().order || 0));
        
        // Save to Firestore
        await db.collection('portfolio').doc('content').collection('books').add({
            title: document.getElementById('bookTitle').value,
            author: document.getElementById('bookAuthor').value,
            amazonUrl: document.getElementById('bookAmazonUrl').value,
            coverImageUrl: coverImageUrl,
            order: maxOrder + 1
        });
        
        bookModal.classList.remove('active');
        loadBooks();
    } catch (error) {
        console.error('Error saving book:', error);
        alert('Error saving book: ' + error.message);
    }
});

// Delete Book
async function deleteBook(id, imageUrl) {
    if (!confirm('Are you sure you want to delete this book?')) return;
    
    try {
        // Delete from Storage
        const imageRef = storage.refFromURL(imageUrl);
        await imageRef.delete();
        
        // Delete from Firestore
        await db.collection('portfolio').doc('content').collection('books').doc(id).delete();
        
        loadBooks();
    } catch (error) {
        console.error('Error deleting book:', error);
        alert('Error deleting book: ' + error.message);
    }
}

// ===== MODAL CONTROLS =====

// Close modals
document.querySelectorAll('.modal-close, .modal-cancel').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
    });
});

// Close modal on outside click
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
});

// ===== LOAD ALL DATA =====

function loadAllData() {
    loadProfile();
    loadArticles();
    loadCreations();
    loadBooks();
}
