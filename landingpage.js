// FITUR HAMBURGER CLICK
document.addEventListener("DOMContentLoaded", function () {
    const toggle = document.getElementById("menu-toggle");
    const navLinks = document.querySelector(".nav-links");
    const searchIcons = document.querySelectorAll(".search"); // untuk semua ikon search

    // Klik hamburger → toggle menu
    toggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");

        // Ubah ikon hamburger jadi "X" ketika menu terbuka
        if (navLinks.classList.contains("active")) {
            toggle.textContent = "✕";
        } else {
            toggle.textContent = "☰";
        }
    });

    // Klik ikon search → tutup menu (kalau terbuka)
    searchIcons.forEach((search) => {
        search.addEventListener("click", () => {
            navLinks.classList.remove("active");
            toggle.textContent = "☰"; // pastikan ikon kembali ke hamburger
        });
    });
});




//FITUR SEARCH
const searchIcon = document.querySelector('.search'); // sesuai class di HTML
const searchOverlay = document.querySelector('.search-overlay');
const closeSearch = document.querySelector('.close-search');

if (searchIcon && searchOverlay && closeSearch) {
    // buka search overlay
    searchIcon.addEventListener('click', () => {
        searchOverlay.classList.add('active');
    });

    // tutup dengan tombol X
    closeSearch.addEventListener('click', () => {
        searchOverlay.classList.remove('active');
    });

    // klik di luar kotak juga menutup
    searchOverlay.addEventListener('click', (e) => {
        if (e.target === searchOverlay) {
            searchOverlay.classList.remove('active');
        }
    });

    // tutup dengan tombol ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchOverlay.classList.remove('active');
        }
    });
} else {
    console.warn('Elemen search, overlay, atau close-search tidak ditemukan.');
}


const scrollBtn = document.getElementById("scrollTopBtn");

// Tampilkan tombol kalau user scroll ke bawah
window.onscroll = function () {
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        scrollBtn.style.display = "block";
    } else {
        scrollBtn.style.display = "none";
    }
};

// Scroll ke atas kalau tombol diklik
scrollBtn.onclick = function () {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
};