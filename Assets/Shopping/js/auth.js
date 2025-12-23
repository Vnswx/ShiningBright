/* ================= STORAGE KEYS ================= */
const AUTH_KEY = "SB_AUTH";
const USER_KEY = "SB_USERS";
const RESET_KEY = "SB_RESET";

/* ================= DATABASE CLASS ================= */
class Database {
    constructor() {
        this.users = JSON.parse(localStorage.getItem(USER_KEY)) || [];
    }
    save() { localStorage.setItem(USER_KEY, JSON.stringify(this.users)); }
    
    addUser(user) {
        user.id = Date.now();
        user.isNewUser = true;
        user.discountCode = "NEW30-" + Math.random().toString(36).slice(2, 8).toUpperCase();
        this.users.push(user);
        this.save();
        return user;
    }
    
    findUser(email) { return this.users.find(u => u.email === email); }
    
    updatePassword(email, password) {
        const user = this.findUser(email);
        if (user) { 
            user.password = password; 
            user.isNewUser = false; // Anggap bukan user baru lagi jika sudah reset
            this.save(); 
        }
    }
    
    validate(email, password) {
        const user = this.findUser(email);
        return user && user.password === password ? user : null;
    }
}
const db = new Database();

/* ================= UTILS & AUTH ================= */
function validateEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }

function saveAuth(user, guest = false) {
    localStorage.setItem(AUTH_KEY, JSON.stringify({
        isLogin: true,
        isGuest: guest,
        name: user.name || "Guest",
        email: user.email || "Guest Mode",
        discountCode: user.discountCode || null,
        loginTime: new Date().toISOString()
    }));
}

function logout() {
    localStorage.removeItem(AUTH_KEY);
    window.location.href = "login.html";
}

/* ================= SOLUSI ERROR ANDA: GUEST & NAVIGATION ================= */

// Tambahkan fungsi ini agar onclick="continueAsGuest()" berfungsi
function continueAsGuest() {
    const guestUser = { name: "Guest", email: "guest@shinningbright.com" };
    saveAuth(guestUser, true);
    window.location.href = "index.html";
}

function hideAllForms() {
    const forms = ["loginForm", "registerForm", "forgotPasswordForm", "resetPasswordForm", "dashboard"];
    forms.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add("hidden");
    });
}

// Fungsi navigasi form (Pastikan dipanggil global agar bisa diakses onclick)
window.showLogin = () => { hideAllForms(); document.getElementById("loginForm")?.classList.remove("hidden"); };
window.showRegister = () => { hideAllForms(); document.getElementById("registerForm")?.classList.remove("hidden"); };
window.showForgotPassword = () => { hideAllForms(); document.getElementById("forgotPasswordForm")?.classList.remove("hidden"); };
window.showResetPassword = () => { hideAllForms(); document.getElementById("resetPasswordForm")?.classList.remove("hidden"); };

/* ================= DOM CONTENT LOADED ================= */
document.addEventListener("DOMContentLoaded", () => {
    
    const regForm = document.getElementById("registerFormElement");
    const logForm = document.getElementById("loginFormElement");
    const forgotForm = document.getElementById("forgotPasswordFormElement");
    const resetForm = document.getElementById("resetPasswordFormElement");

    // 1. REGISTER
    if (regForm) {
        regForm.addEventListener("submit", e => {
            e.preventDefault();
            const name = document.getElementById("registerName").value;
            const email = document.getElementById("registerEmail").value;
            const pass = document.getElementById("registerPassword").value;
            const conf = document.getElementById("registerConfirmPassword").value;

            if (!validateEmail(email)) return alert("Email tidak valid");
            if (db.findUser(email)) return alert("Email sudah terdaftar");
            if (pass.length < 8) return alert("Password minimal 8 karakter");
            if (pass !== conf) return alert("Password tidak sama");

            db.addUser({ name, email, password: pass });
            alert("Registrasi berhasil! Gunakan kode", user.discountCode, "untuk diskon pertama Anda.");
            window.showLogin();
        });

        document.getElementById('registerPassword')?.addEventListener('input', function() {
            checkPasswordStrength(this.value, 'strengthMeter', 'strengthText');
        });
    }

    // 2. LOGIN
    if (logForm) {
        logForm.addEventListener("submit", e => {
            e.preventDefault();
            const email = document.getElementById("loginEmail").value;
            const pass = document.getElementById("loginPassword").value;
            const user = db.validate(email, pass);
            
            if (!user) return alert("Email atau password salah");
            
            saveAuth(user);
            window.location.href = "index.html";
        });
    }

    // 3. FORGOT PASSWORD (Kirim Kode)
    if (forgotForm) {
        forgotForm.addEventListener("submit", e => {
            e.preventDefault();
            const email = document.getElementById("forgotEmail").value;
            const user = db.findUser(email);

            if (!user) return alert("Email tidak terdaftar");

            const code = Math.floor(100000 + Math.random() * 900000).toString();
            localStorage.setItem(RESET_KEY, JSON.stringify({
                email,
                code,
                expires: Date.now() + 600000 // 10 menit
            }));

            alert(`KODE RESET ANDA: ${code}\n(Dalam sistem nyata, kode dikirim ke email)`);
            window.showResetPassword();
        });
    }

    // 4. RESET PASSWORD (Verifikasi Kode)
    if (resetForm) {
        resetForm.addEventListener("submit", e => {
            e.preventDefault();
            const data = JSON.parse(localStorage.getItem(RESET_KEY));
            const code = document.getElementById("resetCode").value;
            const newPass = document.getElementById("newPassword").value;
            const confPass = document.getElementById("confirmNewPassword").value;

            if (!data || Date.now() > data.expires) return alert("Kode reset kadaluarsa");
            if (code !== data.code) return alert("Kode reset salah");
            if (newPass.length < 8) return alert("Password minimal 8 karakter");
            if (newPass !== confPass) return alert("Password tidak sama");

            db.updatePassword(data.email, newPass);
            localStorage.removeItem(RESET_KEY);
            alert("Password berhasil diperbarui!");
            window.showLogin();
        });

        document.getElementById('newPassword')?.addEventListener('input', function() {
            checkPasswordStrength(this.value, 'strengthMeterReset', 'strengthTextReset');
        });
    }
});

/* ================= UI FUNCTIONS ================= */

function checkPasswordStrength(password, meterId, textId) {
    const meter = document.getElementById(meterId);
    const text = document.getElementById(textId);
    if (!meter || !text) return;

    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[a-z]+/)) strength += 25;
    if (password.match(/[A-Z]+/)) strength += 25;
    if (password.match(/[0-9]+/)) strength += 25;

    const config = {
        0: { bg: '#ddd', text: 'None' },
        25: { bg: '#ff4757', text: 'Weak' },
        50: { bg: '#ffa502', text: 'Fair' },
        75: { bg: '#3498db', text: 'Good' },
        100: { bg: '#2ecc71', text: 'Strong' }
    };

    meter.style.width = strength + '%';
    meter.style.background = config[strength].bg;
    text.textContent = config[strength].text;
    text.style.color = config[strength].bg;
}

function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const icon = field?.parentElement.querySelector('.toggle-password i');
    if (!field || !icon) return;

    if (field.type === 'password') {
        field.type = 'text';
        icon.className = 'bi bi-eye-slash';
    } else {
        field.type = 'password';
        icon.className = 'bi bi-eye';
    }
}