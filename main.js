document.addEventListener('DOMContentLoaded', () => {
    // Check login status on protected pages
    const protectedPages = ['dashboard.html', 'note-view.html', 'admin.html'];
    const currentPage = window.location.pathname.split('/').pop();

    if (protectedPages.includes(currentPage) && !localStorage.getItem('isLoggedIn')) {
        window.location.href = 'index.html';
    }

    // --- Data Handling with localStorage ---
    let notesData;
    const initialNotes = [
        {
            id: 1,
            title: 'Operating Systems Concepts',
            summary: 'A comprehensive summary of process scheduling algorithms including FCFS, SJF, and Round Robin. Explores memory management techniques like paging and segmentation.',
            tags: ['OS', 'Scheduling', 'Memory', 'Computer Science'],
            comments: [
                { user: 'Alice', text: 'This summary was a lifesaver for my exam!' },
                { user: 'Bob', text: 'Great explanation of paging.' }
            ],
            status: 'Approved'
        },
        {
            id: 2,
            title: 'Database Normalization',
            summary: 'Detailed notes on database normalization forms (1NF, 2NF, 3NF, BCNF). Includes examples and use cases for designing efficient database schemas.',
            tags: ['Database', 'SQL', 'Normalization', '3NF'],
            comments: [
                { user: 'Charlie', text: 'Finally understand BCNF, thank you!' }
            ],
            status: 'Approved'
        },
        {
            id: 3,
            title: 'AI Language Models',
            summary: 'An overview of transformer architectures and their impact on Natural Language Processing. Discusses models like BERT and GPT.',
            tags: ['AI', 'NLP', 'Transformers', 'Machine Learning'],
            comments: [],
            status: 'Approved'
        }
    ];

    const savedNotes = localStorage.getItem('notesData');
    if (savedNotes) {
        notesData = JSON.parse(savedNotes);
    } else {
        notesData = initialNotes;
        localStorage.setItem('notesData', JSON.stringify(notesData));
    }
    
    const saveNotes = () => {
        localStorage.setItem('notesData', JSON.stringify(notesData));
    };

    // --- Theme Toggler ---
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>`;
    const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>`;
    const toggleTheme = () => {
        document.documentElement.classList.toggle('dark');
        const isDark = document.documentElement.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        if (themeIcon) themeIcon.innerHTML = isDark ? sunIcon : moonIcon;
    };
    if (localStorage.getItem('theme') === 'dark') { document.documentElement.classList.add('dark'); }
    if (themeIcon) { themeIcon.innerHTML = document.documentElement.classList.contains('dark') ? sunIcon : moonIcon; }
    if (themeToggle) { themeToggle.addEventListener('click', toggleTheme); }

    // --- Login Logic ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const email = document.getElementById('email').value;
            localStorage.setItem('isLoggedIn', 'true');
            if (email.toLowerCase() === 'admin@notehive.com') {
                localStorage.setItem('userRole', 'admin');
                window.location.href = 'admin.html';
            } else {
                localStorage.setItem('userRole', 'student');
                window.location.href = 'dashboard.html';
            }
        });
    }

    // --- Logout Logic ---
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userRole');
            window.location.href = 'index.html';
        });
    }

    // --- Page Specific Logic ---
    if (currentPage === 'dashboard.html') {
        const notesGrid = document.getElementById('notes-grid');
        
        const renderNoteCard = (note) => {
            const card = document.createElement('a');
            card.href = `note-view.html?id=${note.id}`;
            card.className = 'bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow';
            card.innerHTML = `
                <h3 class="text-xl font-bold mb-2">${note.title}</h3>
                <p class="text-gray-600 dark:text-gray-300 mb-4 text-sm">${note.summary.substring(0, 100)}...</p>
                <div class="flex flex-wrap gap-2">
                    ${note.tags.map(tag => `<span class="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 text-xs font-medium px-2.5 py-0.5 rounded-full">${tag}</span>`).join('')}
                </div>
            `;
            return card;
        };
        
        const displayNotes = (notesToDisplay) => {
            notesGrid.innerHTML = '';
            notesToDisplay.forEach(note => {
                if (note.status === 'Approved') {
                     const card = renderNoteCard(note);
                     notesGrid.appendChild(card);
                }
            });
        };

        displayNotes(notesData);
        
        const searchBar = document.getElementById('search-bar');
        searchBar.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredNotes = notesData.filter(note => {
                const titleMatch = note.title.toLowerCase().includes(searchTerm);
                const summaryMatch = note.summary.toLowerCase().includes(searchTerm);
                const tagsMatch = note.tags.join(' ').toLowerCase().includes(searchTerm);
                return titleMatch || summaryMatch || tagsMatch;
            });
            displayNotes(filteredNotes);
        });

        const uploadBtn = document.getElementById('upload-btn');
        const uploadModal = document.getElementById('upload-modal');
        const cancelUpload = document.getElementById('cancel-upload');
        uploadBtn.addEventListener('click', () => uploadModal.classList.remove('hidden'));
        cancelUpload.addEventListener('click', () => uploadModal.classList.add('hidden'));

        const uploadForm = document.getElementById('upload-form');
        if (uploadForm) {
            const dropZone = document.getElementById('drop-zone');
            const fileInput = document.getElementById('file-input');
            const fileNameDisplay = document.getElementById('file-name-display');
            dropZone.addEventListener('click', () => fileInput.click());
            dropZone.addEventListener('dragover', (e) => { e.preventDefault(); e.stopPropagation(); dropZone.classList.add('border-indigo-500', 'bg-gray-50', 'dark:bg-gray-700'); });
            dropZone.addEventListener('dragleave', (e) => { e.preventDefault(); e.stopPropagation(); dropZone.classList.remove('border-indigo-500', 'bg-gray-50', 'dark:bg-gray-700'); });
            dropZone.addEventListener('drop', (e) => {
                e.preventDefault(); e.stopPropagation();
                dropZone.classList.remove('border-indigo-500', 'bg-gray-50', 'dark:bg-gray-700');
                const files = e.dataTransfer.files;
                if (files.length) { fileInput.files = files; fileNameDisplay.textContent = `Selected: ${files[0].name}`; }
            });
            fileInput.addEventListener('change', () => {
                if (fileInput.files.length) { fileNameDisplay.textContent = `Selected: ${fileInput.files[0].name}`; }
            });
            uploadForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const title = document.getElementById('note-title').value;
                const description = document.getElementById('note-desc').value;
                const tagsInput = document.getElementById('note-tags').value;
                const file = fileInput.files[0];
                if (!title || !file) { alert('Please provide a title and select a file.'); return; }
                const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
                const newNote = { id: Date.now(), title: title, summary: description || `Note about ${title}`, tags: tags.length > 0 ? tags : ['Untagged'], comments: [], status: 'Pending' };
                notesData.push(newNote);
                saveNotes();
                alert('Note uploaded successfully! It will be visible after admin approval.');
                uploadModal.classList.add('hidden');
                fileNameDisplay.innerHTML = `Drag & drop or <span class="text-indigo-500 font-semibold">browse</span>`;
                uploadForm.reset();
            });
        }
    }

    if (currentPage === 'note-view.html') {
        const params = new URLSearchParams(window.location.search);
        const noteId = parseInt(params.get('id'));
        const note = notesData.find(n => n.id === noteId);
        
        if (note) {
            const noteContent = document.getElementById('note-content');
            noteContent.innerHTML = `
                <h2 class="text-3xl font-bold mb-2">${note.title}</h2>
                <div class="flex flex-wrap gap-2 mb-4">
                    ${note.tags.map(tag => `<span class="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 text-xs font-medium px-2.5 py-0.5 rounded-full">${tag}</span>`).join('')}
                </div>
                <p class="text-gray-600 dark:text-gray-300">${note.summary}</p>
                <div class="mt-6 flex items-center space-x-4">
                     <button id="download-btn" class="flex items-center space-x-2 px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600">
                        <i data-feather="download"></i> <span>Download</span>
                     </button>
                     <button id="qrcode-btn" class="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600">
                        <i data-feather="grid"></i> <span>Get QR Code</span>
                     </button>
                </div>
            `;
            
            const commentsList = document.getElementById('comments-list');
            const renderComment = (comment) => {
                const commentEl = document.createElement('div');
                commentEl.className = 'bg-gray-50 dark:bg-gray-700 p-4 rounded-lg';
                commentEl.innerHTML = `<p class="font-semibold">${comment.user}</p><p class="text-sm">${comment.text}</p>`;
                return commentEl;
            };

            if (note.comments.length > 0) {
                note.comments.forEach(comment => {
                    commentsList.appendChild(renderComment(comment));
                });
            }

            const commentInput = document.getElementById('comment-input');
            const postCommentBtn = document.getElementById('post-comment-btn');
            postCommentBtn.addEventListener('click', () => {
                const commentText = commentInput.value.trim();
                if (commentText === '') { return; }
                const newComment = { user: 'Student', text: commentText };
                note.comments.push(newComment);
                saveNotes();
                commentsList.appendChild(renderComment(newComment));
                commentInput.value = '';
            });

            const downloadBtn = document.getElementById('download-btn');
            const qrCodeBtn = document.getElementById('qrcode-btn');
            const qrModal = document.getElementById('qr-modal');
            const closeQrModal = document.getElementById('close-qr-modal');
            const qrCodeContainer = document.getElementById('qrcode-container');
            downloadBtn.addEventListener('click', () => {
                const textContent = `Title: ${note.title}\n\nSummary:\n${note.summary}`;
                const blob = new Blob([textContent], { type: 'text/plain' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `NoteHive - ${note.title}.txt`;
                link.click();
                URL.revokeObjectURL(link.href);
            });
            qrCodeBtn.addEventListener('click', () => {
                qrCodeContainer.innerHTML = '';
                const qr = qrcode(0, 'L');
                qr.addData(window.location.href);
                qr.make();
                qrCodeContainer.innerHTML = qr.createImgTag(5, 20);
                qrModal.classList.remove('hidden');
            });
            closeQrModal.addEventListener('click', () => {
                qrModal.classList.add('hidden');
            });
        }
    }

    if (currentPage === 'admin.html') {
        const allNotesList = document.getElementById('all-notes-list');
        const renderAdminNote = (note) => {
            const noteEl = document.createElement('div');
            noteEl.className = 'flex justify-between items-center border-b dark:border-gray-700 pb-4 pt-2';
            noteEl.id = `note-${note.id}`;
            const statusColor = note.status === 'Approved' ? 'text-green-500' : 'text-yellow-500';
            noteEl.innerHTML = `
                <div>
                    <p class="font-bold">${note.title}</p>
                    <p class="text-sm font-semibold ${statusColor}">${note.status}</p>
                </div>
                <div class="flex space-x-2">
                    <button data-id="${note.id}" class="approve-btn px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 ${note.status === 'Approved' ? 'opacity-50 cursor-not-allowed' : ''}" ${note.status === 'Approved' ? 'disabled' : ''}>Approve</button>
                    <button data-id="${note.id}" class="remove-btn px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600">Remove</button>
                </div>
            `;
            return noteEl;
        };

        notesData.forEach(note => {
            allNotesList.appendChild(renderAdminNote(note));
        });

        allNotesList.addEventListener('click', (e) => {
            if (!e.target.dataset.id) return;
            const noteId = parseInt(e.target.dataset.id);

            if (e.target.classList.contains('remove-btn')) {
                notesData = notesData.filter(note => note.id !== noteId);
                saveNotes();
                document.getElementById(`note-${noteId}`).remove();
            }

            if (e.target.classList.contains('approve-btn') && !e.target.disabled) {
                const noteToUpdate = notesData.find(note => note.id === noteId);
                noteToUpdate.status = 'Approved';
                saveNotes();
                const noteEl = document.getElementById(`note-${noteId}`);
                const statusEl = noteEl.querySelector('.text-sm.font-semibold');
                statusEl.classList.replace('text-yellow-500', 'text-green-500');
                statusEl.textContent = 'Approved';
                e.target.disabled = true;
                e.target.classList.add('opacity-50', 'cursor-not-allowed');
            }
        });
    }
    
    if(typeof feather !== 'undefined') {
        feather.replace();
    }
});