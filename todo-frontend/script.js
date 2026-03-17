/* ============================================================
   DOTO — script.js
   All JavaScript logic:
   - Auth (login, signup, logout)
   - Todo CRUD (create, read, update, delete)
   - UI rendering
   - API helper
   ============================================================ */

/* ============================================================
   ⚙️  CONFIG — Apna backend URL yahan daalo
   Local development ke liye: http://localhost:5000
   Deploy karne ke baad: https://your-app.onrender.com
   ============================================================ */
const API_BASE = 'https://todo-backend-0i8s.onrender.com';

/* ============================================================
   STATE — App ka saara data yahan store hoga
   ============================================================ */
let token  = localStorage.getItem('doto_token') || null;
let user   = JSON.parse(localStorage.getItem('doto_user') || 'null');
let todos  = [];      // todos array (backend se aata hai)
let filter = 'all';   // 'all' | 'active' | 'done'
let editId = null;    // currently editing todo ka id

/* ============================================================
   INIT — Page load hone par check karo
   ============================================================ */
(function init() {
  if (token && user) {
    // Already logged in — seedha app dikhao
    showPage('app');
    populateUserUI();
    loadTodos();
  } else {
    // Logged in nahi — auth page dikhao
    showPage('auth');
  }
})();

/* ============================================================
   PAGE SWITCH
   ============================================================ */
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(`page-${name}`).classList.add('active');
}

/* ============================================================
   AUTH — TAB SWITCH (Login <=> Signup)
   ============================================================ */
function switchTab(tab) {
  // Forms toggle
  document.getElementById('form-login').classList.toggle('visible', tab === 'login');
  document.getElementById('form-signup').classList.toggle('visible', tab === 'signup');

  // Tab buttons
  document.getElementById('tab-login').classList.toggle('active', tab === 'login');
  document.getElementById('tab-signup').classList.toggle('active', tab === 'signup');

  // Error clear
  document.getElementById('login-err').style.display  = 'none';
  document.getElementById('signup-err').style.display = 'none';
}

/* ============================================================
   LOGIN
   ============================================================ */
async function login() {
  const email    = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-pass').value;
  const errEl    = document.getElementById('login-err');
  const btn      = document.getElementById('btn-login');

  // Basic validation
  if (!email || !password) {
    showError(errEl, 'Please fill in all fields');
    return;
  }

  setLoading(btn, 'Signing in...');
  errEl.style.display = 'none';

  try {
    // POST /auth/login to backend
    const data = await apiFetch('/auth/login', 'POST', { email, password });

    // Token save karo
    token = data.token;
    user  = data.user || { name: email.split('@')[0], email };
    saveSession();

    showPage('app');
    populateUserUI();
    loadTodos();
    showToast('Welcome back! 👋');
  } catch (err) {
    showError(errEl, err.message);
  } finally {
    resetBtn(btn, 'Sign In');
  }
}

/* ============================================================
   SIGNUP
   ============================================================ */
async function signup() {
  const name     = document.getElementById('signup-name').value.trim();
  const email    = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-pass').value;
  const errEl    = document.getElementById('signup-err');
  const btn      = document.getElementById('btn-signup');

  // Validation
  if (!name || !email || !password) {
    showError(errEl, 'Please fill in all fields');
    return;
  }
  if (password.length < 6) {
    showError(errEl, 'Password must be at least 6 characters');
    return;
  }

  setLoading(btn, 'Creating account...');
  errEl.style.display = 'none';

  try {
    // POST /auth/signup to backend
    const data = await apiFetch('/auth/signup', 'POST', { name, email, password });

    token = data.token;
    user  = data.user || { name, email };
    saveSession();

    showPage('app');
    populateUserUI();
    loadTodos();
    showToast('Account created! 🚀');
  } catch (err) {
    showError(errEl, err.message);
  } finally {
    resetBtn(btn, 'Create Account');
  }
}

/* ============================================================
   LOGOUT
   ============================================================ */
function logout() {
  // State clear karo
  token = null;
  user  = null;
  todos = [];
  localStorage.removeItem('doto_token');
  localStorage.removeItem('doto_user');

  showPage('auth');
  showToast('Signed out. See you soon!');
}

/* ============================================================
   POPULATE USER INFO in sidebar
   ============================================================ */
function populateUserUI() {
  if (!user) return;

  const name  = user.name  || 'User';
  const email = user.email || '';
  const hour  = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  document.getElementById('user-name-text').textContent  = name;
  document.getElementById('user-email-text').textContent = email;
  document.getElementById('user-avatar').textContent     = name.charAt(0).toUpperCase();
  document.getElementById('main-title').textContent      = `${greet}, ${name.split(' ')[0]}`;
}

/* ============================================================
   LOAD TODOS — Backend se fetch karo
   ============================================================ */
async function loadTodos() {
  // Loading spinner dikhao
  document.getElementById('todo-list').innerHTML = `
    <div class="loader">
      <div class="loader-dot"></div>
      <div class="loader-dot"></div>
      <div class="loader-dot"></div>
    </div>`;

  try {
    // GET /todos — backend apne aap token check karega
    const data = await apiFetch('/todos');

    // Backend array return kare ya { todos: [...] } — dono handle
    todos = Array.isArray(data) ? data : (data.todos || []);
    render();
  } catch (err) {
    document.getElementById('todo-list').innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <h3>Cannot connect to backend</h3>
        <p>Make sure your server is running at <strong>${API_BASE}</strong></p>
      </div>`;
  }
}

/* ============================================================
   ADD TODO
   ============================================================ */
async function addTodo() {
  const input = document.getElementById('new-todo-input');
  const title = input.value.trim();

  if (!title) {
    input.focus();
    return;
  }

  input.value = '';

  try {
    // POST /todos
    const data = await apiFetch('/todos', 'POST', { title });

    // Backend todo object return karta hai
    const newTodo = data.todo || data;
    todos.unshift(newTodo);   // list ke upar add karo
    render();
    showToast('Task added ✓');
  } catch (err) {
    showToast(err.message, true);
  }
}

/* ============================================================
   TOGGLE COMPLETE
   ============================================================ */
async function toggleTodo(id) {
  const todo = todos.find(t => t._id === id);
  if (!todo) return;

  try {
    // PUT /todos/:id — completed ka opposite bhejo
    const data    = await apiFetch(`/todos/${id}`, 'PUT', { completed: !todo.completed });
    const updated = data.todo || data;

    // Local state update karo
    todos = todos.map(t => t._id === id ? { ...t, completed: updated.completed } : t);
    render();
    showToast(updated.completed ? 'Marked complete ✓' : 'Marked active');
  } catch (err) {
    showToast(err.message, true);
  }
}

/* ============================================================
   DELETE TODO
   ============================================================ */
async function deleteTodo(id) {
  try {
    // DELETE /todos/:id
    await apiFetch(`/todos/${id}`, 'DELETE');

    todos = todos.filter(t => t._id !== id);
    render();
    showToast('Task deleted');
  } catch (err) {
    showToast(err.message, true);
  }
}

/* ============================================================
   EDIT TODO — inline editing start karo
   ============================================================ */
function startEdit(id) {
  editId = id;
  render();

  // Input focus karo
  const inp = document.getElementById(`edit-input-${id}`);
  if (inp) { inp.focus(); inp.select(); }
}

/* ============================================================
   SAVE EDIT
   ============================================================ */
async function saveEdit(id) {
  const inp   = document.getElementById(`edit-input-${id}`);
  const title = inp ? inp.value.trim() : '';

  if (!title) return;

  try {
    // PUT /todos/:id — sirf title update
    const data    = await apiFetch(`/todos/${id}`, 'PUT', { title });
    const updated = data.todo || data;

    todos = todos.map(t => t._id === id ? { ...t, title: updated.title } : t);
    editId = null;
    render();
    showToast('Task updated');
  } catch (err) {
    showToast(err.message, true);
  }
}

/* ============================================================
   SET FILTER
   ============================================================ */
function setFilter(f, btn) {
  filter = f;

  // Nav items update karo
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  // Title update
  const titles = { all: 'All Tasks', active: 'Active Tasks', done: 'Completed Tasks' };
  document.getElementById('main-title').textContent = titles[f];

  render();
}

/* ============================================================
   RENDER — Poori list dobara draw karo
   ============================================================ */
function render() {
  // Stats update
  const total = todos.length;
  const done  = todos.filter(t => t.completed).length;

  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-done').textContent  = done;
  document.getElementById('stat-left').textContent  = total - done;

  // Filter apply karo
  const visible = todos.filter(t => {
    if (filter === 'done')   return t.completed;
    if (filter === 'active') return !t.completed;
    return true;
  });

  // Subtitle
  document.getElementById('main-sub').textContent =
    `${visible.length} task${visible.length !== 1 ? 's' : ''}`;

  const list = document.getElementById('todo-list');

  // Empty state
  if (visible.length === 0) {
    const msgs = {
      all:    ['No tasks yet', 'Add your first task above!'],
      active: ['All done!', 'You have no pending tasks 🎉'],
      done:   ['Nothing completed yet', 'Start checking off tasks!']
    };
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
            ${filter === 'done'
              ? '<polyline points="20 6 9 17 4 12"/>'
              : '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2 2 0 0 1 3 3L12 15l-4 1 1-4z"/>'
            }
          </svg>
        </div>
        <h3>${msgs[filter][0]}</h3>
        <p>${msgs[filter][1]}</p>
      </div>`;
    return;
  }

  // Render todos
  list.innerHTML = visible.map(todo => {
    const isEditing = editId === todo._id;
    const safeTitle = escapeHtml(todo.title);

    return `
    <div class="todo-card ${todo.completed ? 'is-done' : ''}" id="card-${todo._id}">

      <!-- Checkbox -->
      <div class="todo-check" onclick="toggleTodo('${todo._id}')">
        <svg viewBox="0 0 12 12" fill="none">
          <polyline points="1.5,6 4.5,9.5 10.5,2.5"
            stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>

      <!-- Title or Edit Input -->
      ${isEditing
        ? `<input
             class="todo-edit-input"
             id="edit-input-${todo._id}"
             value="${safeTitle}"
             onkeydown="
               if(event.key==='Enter')  saveEdit('${todo._id}');
               if(event.key==='Escape') { editId=null; render(); }
             "
           />`
        : `<span class="todo-text">${safeTitle}</span>`
      }

      <!-- Action Buttons -->
      <div class="todo-actions">
        ${isEditing
          ? `<button class="action-btn save" onclick="saveEdit('${todo._id}')" title="Save">
               <svg viewBox="0 0 14 14" fill="none"><polyline points="1,7 5,11 13,3"
                 stroke-linecap="round" stroke-linejoin="round"/></svg>
             </button>`
          : `<button class="action-btn" onclick="startEdit('${todo._id}')" title="Edit">
               <svg viewBox="0 0 14 14" fill="none">
                 <path d="M9.5,1.5l3,3L4,13H1v-3L9.5,1.5z" stroke-linecap="round" stroke-linejoin="round"/>
               </svg>
             </button>`
        }
        <button class="action-btn del" onclick="deleteTodo('${todo._id}')" title="Delete">
          <svg viewBox="0 0 14 14" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="2,4 12,4"/>
            <path d="M5.5,4V2.5h3V4"/>
            <rect x="3" y="4" width="8" height="8" rx="1"/>
            <line x1="5.5" y1="7" x2="5.5" y2="10"/>
            <line x1="8.5" y1="7" x2="8.5" y2="10"/>
          </svg>
        </button>
      </div>

    </div>`;
  }).join('');
}

/* ============================================================
   API HELPER — Ek hi jagah se sab API calls manage hongi
   ============================================================ */
async function apiFetch(path, method = 'GET', body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };

  // Agar token hai toh har request ke saath bhejo
  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  // Body sirf POST/PUT ke liye
  if (body) {
    options.body = JSON.stringify(body);
  }

  const res  = await fetch(`${API_BASE}${path}`, options);
  const data = await res.json();

  // 401 = token expire — logout
  if (res.status === 401) {
    logout();
    throw new Error('Session expired. Please login again.');
  }

  // Other errors
  if (!res.ok) {
    throw new Error(data.message || data.error || 'Something went wrong');
  }

  return data;
}

/* ============================================================
   SMALL HELPERS
   ============================================================ */

// LocalStorage mein save karo
function saveSession() {
  localStorage.setItem('doto_token', token);
  localStorage.setItem('doto_user', JSON.stringify(user));
}

// Button ko loading state mein daalo
function setLoading(btn, text) {
  btn.disabled     = true;
  btn.querySelector('span').textContent = text;
}

// Button reset karo
function resetBtn(btn, text) {
  btn.disabled     = false;
  btn.querySelector('span').textContent = text;
}

// Error message dikhao
function showError(el, msg) {
  el.textContent    = msg;
  el.style.display  = 'block';
}

// XSS se bachne ke liye HTML escape karo
function escapeHtml(str) {
  return str
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#39;');
}

// Toast notification
let toastTimer;
function showToast(msg, isError = false) {
  const toast       = document.getElementById('toast');
  toast.textContent = msg;
  toast.className   = 'toast show' + (isError ? ' error' : '');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}