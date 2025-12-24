document.addEventListener("DOMContentLoaded", () => {
  // ================= ELEMENT =================
  const searchInput = document.querySelector(".search-box input");
  const searchContent = document.getElementById("searchContent");
  const searchResult = document.getElementById("searchResult");
  const recentWrapper = document.getElementById("recentProducts");

  if (!searchInput) return; // safety

  // ================= RECENT CONFIG =================
  const RECENT_KEY = "recent_products";

  function getRecentProducts() {
    return JSON.parse(localStorage.getItem(RECENT_KEY)) || [];
  }

  function renderRecent() {
    const recent = getRecentProducts();

    if (!recent.length) {
      recentWrapper.innerHTML =
        "<p class='empty'>No recent viewed products</p>";
      return;
    }

    recentWrapper.innerHTML = "";

    recent.forEach((product) => {
      const div = document.createElement("div");
      div.className = "recent-item";

      div.innerHTML = `
          <img src="${product.images[0]}" />
          <div>
            <h5>${product.name}</h5>
            <span>Rp ${product.newPrice.toLocaleString()}</span>
          </div>
        `;

      div.addEventListener("click", () => {
        window.location.href = `detailProduct.html?id=${product.id}`;
      });

      recentWrapper.appendChild(div);
    });
  }

  // ================= LIVE SEARCH =================
  searchInput.addEventListener("input", function () {
    const keyword = this.value.trim().toLowerCase();

    if (!keyword) {
      searchContent.style.display = "block";
      searchResult.style.display = "none";
      searchResult.innerHTML = "";
      renderRecent();
      return;
    }

    searchContent.style.display = "none";
    searchResult.style.display = "block";
    searchResult.innerHTML = "<h4>Products</h4>";

    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(keyword)
    );

    if (!filtered.length) {
      searchResult.innerHTML += `
          <p class="empty">
            0 Results Found <br />
            Ups, sorry no results for "${keyword}"
          </p>`;
      return;
    }

    filtered.forEach((product) => {
      const div = document.createElement("div");
      div.className = "search-item";

      div.innerHTML = `
          <img src="${product.images[0]}" />
          <div>
            <h5>${product.name}</h5>
            <span>Rp ${product.newPrice.toLocaleString()}</span>
          </div>
        `;

      div.addEventListener("click", () => {
        const isAllProduct = window.location.pathname.includes("allProduct");

        if (isAllProduct) {
          // filter di halaman ini
          const filtered = products.filter(p =>
            p.id === product.id
          );
          renderProducts(filtered);
          searchOverlay.classList.remove("active");
        } else {
          // halaman lain → ke detail
          window.location.href = `detailProduct.html?id=${product.id}`;
        }
      });


      searchResult.appendChild(div);
    });
  });

  // ================= ENTER → ALL PRODUCT =================
  searchInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      const keyword = this.value.trim();
      if (keyword) {
        window.location.href =
          "allProduct.html?search=" + encodeURIComponent(keyword);
      }
    }
  });

  // ================= SEARCH TAG =================
  document.querySelectorAll(".search-tags button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const category = btn.dataset.category;
      window.location.href = `allProduct.html?category=${category}`;
    });
  });

  // ================= INIT =================
  renderRecent();
});