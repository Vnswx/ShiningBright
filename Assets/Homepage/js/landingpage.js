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




// FITUR SEARCH (DESKTOP + MOBILE)
const searchIcons = document.querySelectorAll('.search');
const searchOverlay = document.querySelector('.search-overlay');
const closeSearch = document.querySelector('.close-search');
const navbar =
  document.querySelector('.navbar') ||
  document.querySelector('nav');


if (searchIcons.length && searchOverlay && closeSearch && navbar) {

    // buka search
    searchIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            searchOverlay.classList.add('active');
            navbar.classList.add('search-active');
        });
    });

    // tutup search (X)
    closeSearch.addEventListener('click', () => {
        searchOverlay.classList.remove('active');
        navbar.classList.remove('search-active');
    });

    // klik di luar konten (overlay)
    searchOverlay.addEventListener('click', (e) => {
        if (e.target === searchOverlay) {
            searchOverlay.classList.remove('active');
            navbar.classList.remove('search-active');
        }
    });

    // ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchOverlay.classList.remove('active');
            navbar.classList.remove('search-active');
        }
    });

} else {
    console.warn('Search element / navbar tidak ditemukan');
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


//SUARA VIDEO LANDINGPAGE COLLABORATION
const video = document.getElementById("collabVideo");

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Video terlihat
                video.muted = false;
                video.play();
            } else {
                // Video keluar layar
                video.muted = true;
                video.pause();
            }
        });
    }, {
        threshold: 0.5, // 50% video terlihat
    }
);

observer.observe(video);


//BAHASA INDO X INGGRIS


// // ================= CATEGORY SEARCH (AMAN & TIDAK BENTROK) =================
// document.addEventListener("DOMContentLoaded", function () {

//     const categoryButtons = document.querySelectorAll(".search-tags button");
//     const filterCategory = document.getElementById("filterCategory");
//     const searchOverlay = document.querySelector(".search-overlay");

//     // Cegah error kalau elemen belum ada
//     if (!categoryButtons.length || !filterCategory || !searchOverlay) {
//         console.warn("Category search element tidak ditemukan");
//         return;
//     }

//     categoryButtons.forEach((btn) => {
//         btn.addEventListener("click", function () {
//             const category = this.dataset.category;

//             if (!category) return;

//             // set value dropdown category
//             filterCategory.value = category;

//             // trigger event filter category (WAJIB)
//             filterCategory.dispatchEvent(new Event("change"));

//             // tutup overlay search
//             searchOverlay.classList.remove("active");

//             // scroll ke product section
//             const productSection = document.querySelector(".product-section");
//             if (productSection) {
//                 productSection.scrollIntoView({
//                     behavior: "smooth",
//                     block: "start",
//                 });
//             }
//         });
//     });

// });