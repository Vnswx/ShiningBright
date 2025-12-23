/* ================= STORAGE ================= */
const AUTH_KEY = "SB_AUTH";
const USER_KEY = "SB_USERS";
const RESET_KEY = "SB_RESET";

/* ================= DATABASE ================= */
class Database {
  constructor() {
    this.users = JSON.parse(localStorage.getItem(USER_KEY)) || [];
  }

  save() {
    localStorage.setItem(USER_KEY, JSON.stringify(this.users));
  }

  addUser(user) {
    user.id = Date.now();
    user.isNewUser = true;
    user.discountCode = "NEW30-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    this.users.push(user);
    this.save();
    return user;
  }

  findUser(email) {
    return this.users.find(u => u.email === email);
  }

  updatePassword(email, password) {
    const user = this.findUser(email);
    if (user) {
      user.password = password;
      this.save();
    }
  }

  validate(email, password) {
    const user = this.findUser(email);
    return user && user.password === password ? user : null;
  }
}

const db = new Database();

/* ================= UTIL ================= */
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function saveAuth(user, guest = false) {
  localStorage.setItem(AUTH_KEY, JSON.stringify({
    isLogin: true,
    isGuest: guest,
    name: user.name,
    email: user.email,
    discountCode: user.discountCode || null,
    loginTime: new Date().toISOString()
  }));
}

/* ================= FORM SWITCH ================= */
function hideAllForms() {
  ["loginForm","registerForm","forgotPasswordForm","resetPasswordForm"]
    .forEach(id => document.getElementById(id)?.classList.add("hidden"));
}

function showLogin() {
  hideAllForms();
  loginForm.classList.remove("hidden");
}

function showRegister() {
  hideAllForms();
  registerForm.classList.remove("hidden");
}

function showForgotPassword() {
  hideAllForms();
  forgotPasswordForm.classList.remove("hidden");
}

function showResetPassword() {
  hideAllForms();
  resetPasswordForm.classList.remove("hidden");
}

/* ================= REGISTER ================= */
registerFormElement.addEventListener("submit", e => {
  e.preventDefault();

  if (!validateEmail(registerEmail.value)) return alert("Email tidak valid");
  if (db.findUser(registerEmail.value)) return alert("Email sudah terdaftar");
  if (registerPassword.value.length < 8) return alert("Password minimal 8 karakter");
  if (registerPassword.value !== registerConfirmPassword.value) return alert("Password tidak sama");

  db.addUser({
    name: registerName.value,
    email: registerEmail.value,
    password: registerPassword.value
  });

  alert("Registrasi berhasil, silakan login");
  showLogin();
});

/* ================= LOGIN ================= */
loginFormElement.addEventListener("submit", e => {
  e.preventDefault();

  const user = db.validate(loginEmail.value, loginPassword.value);
  if (!user) return alert("Email atau password salah");

  saveAuth(user);
  window.location.href = "index.html";
});

/* ================= GUEST ================= */
function continueAsGuest() {
  saveAuth({ name: "Guest", email: "guest@local" }, true);
  window.location.href = "index.html";
}

/* ================= FORGOT PASSWORD ================= */
forgotPasswordFormElement.addEventListener("submit", e => {
  e.preventDefault();

  const email = forgotEmail.value;
  if (!validateEmail(email)) return alert("Email tidak valid");

  const user = db.findUser(email);
  if (!user) return alert("Email tidak ditemukan");

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  localStorage.setItem(RESET_KEY, JSON.stringify({
    email,
    code,
    expires: Date.now() + 10 * 60 * 1000
  }));

  alert(`Kode reset kamu: ${code}`);
  showResetPassword();
});

/* ================= RESET PASSWORD ================= */
resetPasswordFormElement.addEventListener("submit", e => {
  e.preventDefault();

  const data = JSON.parse(localStorage.getItem(RESET_KEY));
  if (!data) return alert("Kode reset tidak ditemukan");

  if (Date.now() > data.expires) {
    localStorage.removeItem(RESET_KEY);
    return alert("Kode reset expired");
  }

  if (resetCode.value !== data.code) return alert("Kode reset salah");
  if (newPassword.value.length < 8) return alert("Password minimal 8 karakter");
  if (newPassword.value !== confirmNewPassword.value) return alert("Password tidak sama");

  db.updatePassword(data.email, newPassword.value);
  localStorage.removeItem(RESET_KEY);

  alert("Password berhasil diubah, silakan login");
  showLogin();
});

/* ================= LOGOUT ================= */
function logout() {
  localStorage.removeItem(AUTH_KEY);
  location.reload();
}

function showResetPassword() {
    document.getElementById('forgotPasswordForm').classList.add('hidden');
    document.getElementById('resetPasswordForm').classList.remove('hidden');
}

function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const icon = field.nextElementSibling.querySelector('i');
    
    if (field.type === 'password') {
        field.type = 'text';
        icon.classList.remove('bi-eye');
        icon.classList.add('bi-eye-slash');
    } else {
        field.type = 'password';
        icon.classList.remove('bi-eye-slash');
        icon.classList.add('bi-eye');
    }
}

function checkPasswordStrength(password) {
    let strength = 0;
    const meter = document.getElementById('strengthMeter');
    const text = document.getElementById('strengthText');
    
    if (password.length >= 8) strength += 25;
    if (password.match(/[a-z]+/)) strength += 25;
    if (password.match(/[A-Z]+/)) strength += 25;
    if (password.match(/[0-9]+/)) strength += 25;
    
    meter.style.width = strength + '%';
    
    const colors = {
        25: { bg: '#ff4757', text: 'Weak' },
        50: { bg: '#ffa502', text: 'Fair' },
        75: { bg: '#3498db', text: 'Good' },
        100: { bg: '#2ecc71', text: 'Strong' }
    };
    
    const level = strength <= 25 ? 25 : strength <= 50 ? 50 : strength <= 75 ? 75 : 100;
    meter.style.background = colors[level].bg;
    text.textContent = colors[level].text;
    text.style.color = colors[level].bg;
}

document.getElementById('registerPassword').addEventListener('input', function() {
    checkPasswordStrength(this.value);
});

document.getElementById('newPassword').addEventListener('input', function() {
    checkPasswordStrengthReset(this.value);
});

function checkPasswordStrengthReset(password) {
    let strength = 0;
    const meter = document.getElementById('strengthMeterReset');
    const text = document.getElementById('strengthTextReset');
    
    if (password.length >= 8) strength += 25;
    if (password.match(/[a-z]+/)) strength += 25;
    if (password.match(/[A-Z]+/)) strength += 25;
    if (password.match(/[0-9]+/)) strength += 25;
    
    meter.style.width = strength + '%';
    
    const colors = {
        25: { bg: '#ff4757', text: 'Weak' },
        50: { bg: '#ffa502', text: 'Fair' },
        75: { bg: '#3498db', text: 'Good' },
        100: { bg: '#2ecc71', text: 'Strong' }
    };
    
    const level = strength <= 25 ? 25 : strength <= 50 ? 50 : strength <= 75 ? 75 : 100;
    meter.style.background = colors[level].bg;
    text.textContent = colors[level].text;
    text.style.color = colors[level].bg;
}