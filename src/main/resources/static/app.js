const $ = (s, r = document) => r.querySelector(s),
  $$ = (s, r = document) => [...r.querySelectorAll(s)];
const money = (n) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    n || 0,
  );
const esc = (s) =>
  String(s ?? "").replace(
    /[&<>'"]/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[
        c
      ],
  );
const state = {
  products: [],
  cart: JSON.parse(localStorage.getItem("nova-cart") || "[]"),
  build: {},
  auth: JSON.parse(localStorage.getItem("nova-auth") || "null"),
  adminTab: "products",
};
const authHeader = () =>
  state.auth
    ? {
        Authorization: "Basic " + btoa(String.fromCharCode(...new TextEncoder().encode(`${state.auth.username}:${state.auth.password}`))),
      }
    : {};
async function api(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
      ...(options.headers || {}),
    },
  });
  if (res.status === 401) {
    login();
    throw new Error("Hãy đăng nhập để tiếp tục.");
  }
  if (!res.ok) {
    let e = {};
    try {
      e = await res.json();
    } catch {}
    throw new Error(e.message || "Không thể hoàn tất yêu cầu.");
  }
  return res.status === 204 ? null : res.json();
}
function toast(message, error = false) {
  const el = $("#toast");
  el.textContent = message;
  el.style.background = error ? "var(--color-error)" : "";
  el.classList.add("is-open");
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove("is-open"), 3200);
}
function route() {
  return location.hash.slice(2).split("?")[0] || "home";
}
function saveCart() {
  localStorage.setItem("nova-cart", JSON.stringify(state.cart));
  renderCart();
}
function productCard(p) {
  const sale =
    p.oldPrice > p.price ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
    return `<article class="product"><div class="product__visual"><img class="product__image" src="${esc(p.imageUrl || "")}" alt="${esc(p.name)}" loading="lazy" decoding="async" onerror="this.remove()">${sale ? `<span class="product__sale">-${sale}%</span>` : ""}<b aria-hidden="true">${esc(p.icon || p.category.slice(0, 3))}</b></div><div class="product__body"><small class="product__brand">${esc(p.brand)} · ${esc(p.category)}</small><h3>${esc(p.name)}</h3><p class="product__spec">${esc(p.specs)}</p><div><span class="price">${money(p.price)}</span> ${p.oldPrice ? `<span class="old-price">${money(p.oldPrice)}</span>` : ""}</div><span class="stock">${p.stock > 0 ? `Còn ${p.stock} sản phẩm` : "Tạm hết hàng"}</span><div class="product__actions"><button class="btn btn--primary" data-add="${p.id}" ${p.stock < 1 ? "disabled" : ""}>Thêm vào giỏ</button><button class="btn" data-build="${p.id}" aria-label="Đưa vào Build PC">＋</button><button class="btn product__3d" data-view3d="${p.id}" aria-label="Xem ${esc(p.name)} ở chế độ 3D">3D</button></div></div></article>`;
}
function bindProducts() {
  $$("[data-add]").forEach((b) => (b.onclick = () => addCart(+b.dataset.add)));
  $$("[data-build]").forEach(
    (b) =>
      (b.onclick = () => {
        const p = state.products.find((x) => x.id == b.dataset.build);
        state.build[p.category] = p;
        toast(`Đã chọn ${p.name} cho Build PC`);
        location.hash = "#/build";
      }),
  );
    $$(`[data-view3d]`).forEach((button) => {
      button.onclick = () => {
        const product = state.products.find((item) => item.id === Number(button.dataset.view3d));
        if (!product) return;
        if (window.showProductPreview) window.showProductPreview(product);
        else toast("Không tải được trình xem 3D. Kiểm tra kết nối rồi thử lại.", true);
      };
    });
}
function addCart(id) {
  const p = state.products.find((x) => x.id === id);
  const line = state.cart.find((x) => x.id === id);
  if (line) line.qty = Math.min(line.qty + 1, p.stock);
  else state.cart.push({ id, qty: 1 });
  saveCart();
  toast(`Đã thêm ${p.name}`);
}
function renderCart() {
  const rows = state.cart
    .map((line) => {
      const p = state.products.find((x) => x.id === line.id);
      if (!p) return "";
      return `<div class="cart-line"><div><strong>${esc(p.name)}</strong><p>${money(p.price)}</p></div><div class="cart-line__actions"><button data-dec="${p.id}">−</button><span>${line.qty}</span><button data-inc="${p.id}">＋</button></div></div>`;
    })
    .join("");
  $("#cartItems").innerHTML =
    rows ||
    '<div class="empty"><strong>Giỏ hàng đang trống</strong><span>Chọn một sản phẩm để bắt đầu.</span></div>';
  const total = state.cart.reduce(
    (s, l) =>
      s + (state.products.find((p) => p.id === l.id)?.price || 0) * l.qty,
    0,
  );
  $("#cartTotal").textContent = money(total);
  $("#cartCount").textContent = state.cart.reduce((s, l) => s + l.qty, 0);
  $$("[data-dec]").forEach(
    (b) => (b.onclick = () => changeQty(+b.dataset.dec, -1)),
  );
  $$("[data-inc]").forEach(
    (b) => (b.onclick = () => changeQty(+b.dataset.inc, 1)),
  );
}
function changeQty(id, n) {
  const l = state.cart.find((x) => x.id === id),
    p = state.products.find((x) => x.id === id);
  l.qty = Math.min(p.stock, l.qty + n);
  if (l.qty <= 0) state.cart = state.cart.filter((x) => x.id !== id);
  saveCart();
}
function openCart(open = true) {
  $("#cartDrawer").classList.toggle("is-open", open);
  $("#cartDrawer").setAttribute("aria-hidden", !open);
  $("#scrim").classList.toggle("is-active", open);
}
function home() {
  const featured = state.products.filter((p) => p.featured).slice(0, 8);
  const cats = [...new Set(state.products.map((p) => p.category))].slice(0, 6);
  $("#app").innerHTML =
    `<section class="shell hero"><div><small>PC · LINH KIỆN · GEAR</small><h1>Chọn đúng. Chạy mạnh.</h1></div><div class="hero__side"><p>Thông số rõ ràng, bộ lọc vừa đủ và công cụ dựng cấu hình giúp bạn mua đúng phần cứng ngay từ đầu.</p><div class="hero__actions"><a class="btn btn--primary" href="#/products">Xem sản phẩm</a><a class="btn" href="#/build">Tự build PC</a></div></div></section><section class="category-strip">${cats.map((c, i) => `<a class="category-tile" href="#/products?cat=${encodeURIComponent(c)}"><b>0${i + 1}</b><span>${esc(c)}</span><small>${state.products.filter((p) => p.category === c).length} SẢN PHẨM</small></a>`).join("")}</section><section class="shell section"><div class="section-head"><div><small>ĐÁNG CHÚ Ý</small><h2>Phần cứng được quan tâm</h2></div><p>Giá và tồn kho lấy trực tiếp từ Spring Boot API.</p></div><div class="product-grid">${featured.map(productCard).join("")}</div></section><section class="section section--dark"><div class="shell section-head"><div><small>PC BUILDER</small><h2>Một cấu hình. Không xung đột.</h2></div><div class="hero__actions"><a class="btn" href="#/build">Mở công cụ build</a><a class="btn" href="#/consult">Nhờ tư vấn</a></div></div></section>`;
  bindProducts();
}
function products() {
  const params = new URLSearchParams(location.hash.split("?")[1] || "");
  const selected = params.get("cat") || "";
  $("#app").innerHTML =
    `<section class="shell section"><div class="section-head"><div><small>KHO HÀNG · ${state.products.length} SKU</small><h1>Sản phẩm</h1></div><p>Lọc theo danh mục, thương hiệu hoặc mức giá.</p></div><div class="toolbar"><input id="productSearch" placeholder="Tìm theo tên hoặc thông số" value="${esc($("#globalSearch")?.value || "")}"><select id="categoryFilter"><option value="">Tất cả danh mục</option>${[...new Set(state.products.map((p) => p.category))].map((c) => `<option ${c === selected ? "selected" : ""}>${esc(c)}</option>`).join("")}</select><select id="sortFilter"><option value="featured">Nổi bật</option><option value="asc">Giá tăng dần</option><option value="desc">Giá giảm dần</option></select></div><div class="product-grid" id="productGrid"></div></section>`;
  const draw = () => {
    let list = state.products.filter(
      (p) =>
        (!$("#categoryFilter").value ||
          p.category === $("#categoryFilter").value) &&
        `${p.name} ${p.specs} ${p.brand}`
          .toLowerCase()
          .includes($("#productSearch").value.toLowerCase()),
    );
    if ($("#sortFilter").value === "asc")
      list.sort((a, b) => a.price - b.price);
    if ($("#sortFilter").value === "desc")
      list.sort((a, b) => b.price - a.price);
    $("#productGrid").innerHTML =
      list.map(productCard).join("") ||
      '<div class="empty"><strong>Không tìm thấy sản phẩm</strong><span>Thử từ khóa hoặc danh mục khác.</span></div>';
    bindProducts();
  };
  ["productSearch", "categoryFilter", "sortFilter"].forEach(
    (id) => ($(`#${id}`).oninput = draw),
  );
  draw();
}
function build() {
  const cats = ["CPU", "Mainboard", "VGA", "RAM", "SSD", "PSU", "Case"];
  const selected = Object.values(state.build);
  const total = selected.reduce((s, p) => s + p.price, 0);
  const cpu = state.build.CPU,
    mb = state.build.Mainboard;
  const compatible =
    !cpu || !mb || !cpu.socket || !mb.socket || cpu.socket === mb.socket;
  $("#app").innerHTML =
    `<section class="section section--dark"><div class="shell"><div class="section-head"><div><small>PC BUILDER</small><h1>Dựng máy theo cách bạn dùng.</h1></div><p>Chọn từng nhóm linh kiện. Hệ thống kiểm tra socket CPU và mainboard.</p></div><div class="builder"><div class="build-list">${cats
      .map((c, i) => {
        const p = state.build[c];
        return `<div class="build-slot"><span class="build-slot__no">0${i + 1}</span><strong>${c}</strong><span>${p ? esc(p.name) : "Chưa chọn linh kiện"}</span><button class="btn" data-pick="${c}">${p ? "Đổi" : "Chọn"}</button></div>`;
      })
      .join(
        "",
      )}</div><aside class="build-summary"><div><small>TÓM TẮT</small><h2>${selected.length}/7 linh kiện</h2></div><p class="status">${compatible ? "✓ Socket tương thích" : "⚠ CPU và mainboard khác socket"}</p><ul>${selected.map((p) => `<li>${esc(p.category)} · ${money(p.price)}</li>`).join("")}</ul><div class="build-summary__total"><span>Tổng</span><strong>${money(total)}</strong></div><button id="addBuild" class="btn btn--primary" ${!selected.length || !compatible ? "disabled" : ""}>Thêm cấu hình vào giỏ</button><a class="btn" href="#/consult">Nhờ kỹ thuật kiểm tra</a></aside></div></div></section>`;
  $$("[data-pick]").forEach(
    (b) => (b.onclick = () => pickForBuild(b.dataset.pick)),
  );
  $("#addBuild").onclick = () => {
    selected.forEach((p) => {
      if (!state.cart.some((x) => x.id === p.id))
        state.cart.push({ id: p.id, qty: 1 });
    });
    saveCart();
    toast("Đã thêm cấu hình vào giỏ");
    openCart();
  };
}
function pickForBuild(cat) {
  const choices = state.products.filter((p) => p.category === cat);
  if (!choices.length) return toast(`Chưa có sản phẩm ${cat}`, true);
  const current = state.build[cat];
  state.build[cat] =
    choices[(Math.max(0, choices.indexOf(current)) + 1) % choices.length];
  build();
}
function consult() {
  $("#app").innerHTML =
    `<section class="shell consult-grid"><div><small>TƯ VẤN KỸ THUẬT</small><h1>Nói nhu cầu. Chúng tôi cân cấu hình.</h1><p>Điền ngân sách và mục đích sử dụng. Yêu cầu sẽ xuất hiện ngay trong trang quản trị.</p></div><form class="consult-form" id="consultForm"><label>Họ và tên<input name="fullName" required></label><label>Số điện thoại<input name="phone" pattern="[0-9]{9,11}" required></label><label>Nhu cầu<select name="need"><option>Gaming</option><option>Đồ họa — dựng phim</option><option>Văn phòng — học tập</option><option>Nâng cấp máy hiện tại</option></select></label><label>Ngân sách<input name="budget" placeholder="Ví dụ: 25–30 triệu"></label><button class="btn btn--primary">Gửi yêu cầu tư vấn</button></form></section>`;
  $("#consultForm").onsubmit = async (e) => {
    e.preventDefault();
    try {
      await api("/api/consultations", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(new FormData(e.target))),
      });
      e.target.reset();
      toast("Đã ghi nhận yêu cầu. Kỹ thuật viên sẽ liên hệ.");
    } catch (err) {
      toast(err.message, true);
    }
  };
}
async function orders() {
  if (!state.auth) return login();
  try {
    const list = await api("/api/orders/mine");
    $("#app").innerHTML =
      `<section class="shell section"><div class="section-head"><div><small>TÀI KHOẢN</small><h1>Đơn hàng của bạn</h1></div><button class="btn" id="logout">Đăng xuất</button></div>${list.length ? `<table class="data-table"><thead><tr><th>MÃ</th><th>NGÀY</th><th>SẢN PHẨM</th><th>TỔNG</th><th>TRẠNG THÁI</th></tr></thead><tbody>${list.map((o) => `<tr><td data-label="Mã">#${o.id}</td><td data-label="Ngày">${new Date(o.createdAt).toLocaleDateString("vi-VN")}</td><td data-label="Sản phẩm">${o.lines.map((l) => `${esc(l.productName)} × ${l.quantity}`).join("<br>")}</td><td data-label="Tổng">${money(o.total)}</td><td data-label="Trạng thái"><span class="status">${esc(o.status)}</span></td></tr>`).join("")}</tbody></table>` : '<div class="empty"><strong>Chưa có đơn hàng</strong><span>Sản phẩm bạn đặt sẽ xuất hiện tại đây.</span><a class="btn" href="#/products">Chọn sản phẩm</a></div>'}</section>`;
    $("#logout").onclick = logout;
  } catch (e) {
    toast(e.message, true);
  }
}
function login() {
  closeAccountMenu();
  if (!$("#loginDialog").open) $("#loginDialog").showModal();
}
function openRegister() {
  closeAccountMenu();
  if ($("#loginDialog").open) $("#loginDialog").close();
  if (!$("#registerDialog").open) $("#registerDialog").showModal();
}
function closeAccountMenu() {
  $("#accountMenu").hidden = true;
  $("#accountBtn").setAttribute("aria-expanded", "false");
}
function renderAccountMenu() {
  const button = $("#accountBtn");
  const menu = $("#accountMenu");
  $(".account-button__label").textContent = state.auth?.fullName || "Đăng nhập / Đăng ký";
  button.setAttribute("aria-label", state.auth ? `Tài khoản ${state.auth.fullName}` : "Tài khoản");
  menu.innerHTML = state.auth
    ? `<strong>${esc(state.auth.fullName)}</strong><small>${state.auth.role === "ADMIN" ? "Quản trị viên" : "Khách hàng"}</small><button data-account-action="${state.auth.role === "ADMIN" ? "admin" : "orders"}">${state.auth.role === "ADMIN" ? "Quản trị cửa hàng" : "Đơn hàng của tôi"}</button><button data-account-action="logout">Đăng xuất</button>`
    : '<strong>Tài khoản NovaGear</strong><button data-account-action="login">Đăng nhập</button><button data-account-action="register">Tạo tài khoản</button>';
  menu.onclick = (event) => {
    const action = event.target.closest("[data-account-action]")?.dataset.accountAction;
    if (!action) return;
    closeAccountMenu();
    if (action === "login") login();
    else if (action === "register") openRegister();
    else if (action === "logout") logout();
    else location.hash = `#/${action}`;
  };
}
function logout() {
  state.auth = null;
  localStorage.removeItem("nova-auth");
  renderAccountMenu();
  closeAccountMenu();
  toast("Đã đăng xuất");
  location.hash = "#/home";
}
async function admin() {
  if (!state.auth || state.auth.role !== "ADMIN") {
    login();
    return;
  }
  try {
    const [ps, os, cs] = await Promise.all([
      api("/api/admin/products"),
      api("/api/admin/orders"),
      api("/api/admin/consultations"),
    ]);
    $("#app").innerHTML =
      `<section class="shell section"><div class="section-head"><div><small>ADMIN WORKSPACE</small><h1>Vận hành cửa hàng</h1></div><button class="btn" id="logout">Đăng xuất</button></div><div class="admin-tabs"><button data-tab="products">Sản phẩm (${ps.length})</button><button data-tab="orders">Đơn hàng (${os.length})</button><button data-tab="consults">Tư vấn (${cs.length})</button></div><div id="adminPanel"></div></section>`;
    const panel = () => {
      const el = $("#adminPanel");
      $$("[data-tab]").forEach((b) =>
        b.classList.toggle("active", b.dataset.tab === state.adminTab),
      );
      if (state.adminTab === "products")
        el.innerHTML = `<div class="button-row"><button class="btn btn--primary" id="newProduct">Thêm sản phẩm</button></div>${tableProducts(ps)}`;
      if (state.adminTab === "orders") el.innerHTML = tableOrders(os);
      if (state.adminTab === "consults") el.innerHTML = tableConsults(cs);
      bindAdmin(ps, os, cs, panel);
    };
    $$("[data-tab]").forEach(
      (b) =>
        (b.onclick = () => {
          state.adminTab = b.dataset.tab;
          panel();
        }),
    );
    $("#logout").onclick = logout;
    panel();
  } catch (e) {
    toast(e.message, true);
  }
}
const tableProducts = (ps) =>
  `<table class="data-table"><thead><tr><th>ID</th><th>SẢN PHẨM</th><th>DANH MỤC</th><th>GIÁ</th><th>KHO</th><th>THAO TÁC</th></tr></thead><tbody>${ps.map((p) => `<tr><td data-label="ID">${p.id}</td><td data-label="Sản phẩm"><strong>${esc(p.name)}</strong><br><small>${esc(p.brand)}</small></td><td data-label="Danh mục">${esc(p.category)}</td><td data-label="Giá">${money(p.price)}</td><td data-label="Kho">${p.stock}</td><td data-label="Thao tác"><button class="btn" data-edit="${p.id}">Sửa</button> <button class="btn" data-delete="${p.id}">Xóa</button></td></tr>`).join("")}</tbody></table>`;
const tableOrders = (os) =>
  `<table class="data-table"><thead><tr><th>MÃ</th><th>KHÁCH</th><th>TỔNG</th><th>TRẠNG THÁI</th></tr></thead><tbody>${os.map((o) => `<tr><td data-label="Mã">#${o.id}</td><td data-label="Khách">${esc(o.customerName)}<br>${esc(o.phone)}</td><td data-label="Tổng">${money(o.total)}</td><td data-label="Trạng thái"><select data-order="${o.id}">${["Mới", "Đang xử lý", "Đang giao", "Hoàn tất", "Đã hủy"].map((s) => `<option ${s === o.status ? "selected" : ""}>${s}</option>`).join("")}</select></td></tr>`).join("")}</tbody></table>`;
const tableConsults = (cs) =>
  `<table class="data-table"><thead><tr><th>ID</th><th>KHÁCH</th><th>NHU CẦU</th><th>NGÂN SÁCH</th><th>TRẠNG THÁI</th></tr></thead><tbody>${cs.map((c) => `<tr><td data-label="ID">#${c.id}</td><td data-label="Khách">${esc(c.fullName)}<br>${esc(c.phone)}</td><td data-label="Nhu cầu">${esc(c.need)}</td><td data-label="Ngân sách">${esc(c.budget)}</td><td data-label="Trạng thái"><select data-consult="${c.id}">${["Chờ liên hệ", "Đã liên hệ", "Đã chốt", "Đã đóng"].map((s) => `<option ${s === c.status ? "selected" : ""}>${s}</option>`).join("")}</select></td></tr>`).join("")}</tbody></table>`;
function bindAdmin(ps, os, cs, refresh) {
  $("#newProduct")?.addEventListener("click", () => openProduct());
  $$("[data-edit]").forEach(
    (b) =>
      (b.onclick = () => openProduct(ps.find((p) => p.id == b.dataset.edit))),
  );
  $$("[data-delete]").forEach(
    (b) =>
      (b.onclick = async () => {
        if (!confirm("Xóa sản phẩm này?")) return;
        await api(`/api/admin/products/${b.dataset.delete}`, {
          method: "DELETE",
        });
        toast("Đã xóa sản phẩm");
        admin();
      }),
  );
  $$("[data-order]").forEach(
    (s) =>
      (s.onchange = async () => {
        await api(`/api/admin/orders/${s.dataset.order}/status`, {
          method: "PATCH",
          body: JSON.stringify({ status: s.value }),
        });
        toast("Đã cập nhật đơn hàng");
      }),
  );
  $$("[data-consult]").forEach(
    (s) =>
      (s.onchange = async () => {
        await api(`/api/admin/consultations/${s.dataset.consult}`, {
          method: "PATCH",
          body: JSON.stringify({ status: s.value }),
        });
        toast("Đã cập nhật yêu cầu");
      }),
  );
}
function openProduct(p = {}) {
  const f = $("#productForm");
  f.reset();
  Object.entries(p).forEach(([k, v]) => {
    const el = f.elements[k];
    if (el) el.type === "checkbox" ? (el.checked = v) : (el.value = v ?? "");
  });
  if (!p.id) f.elements.active.checked = true;
  $("#productFormTitle").textContent = p.id ? "Sửa sản phẩm" : "Thêm sản phẩm";
  $("#productDialog").showModal();
}
async function load() {
  state.products = await api("/api/products");
  const cats = [...new Set(state.products.map((p) => p.category))];
  $("#megaContent").innerHTML = cats
    .map(
      (c) =>
        `<a href="#/products?cat=${encodeURIComponent(c)}"><strong>${esc(c)}</strong><span>${state.products.filter((p) => p.category === c).length} lựa chọn · xem danh mục</span></a>`,
    )
    .join("");
  renderCart();
  render();
}
function render() {
  const r = route();
  (({ home, products, build, consult, orders, admin })[r] || home)();
  closeMega();
  window.scrollTo({
    top: 0,
    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth",
  });
}
function closeMega() {
  const m = $("#megaMenu");
  m.classList.remove("is-open");
  m.setAttribute("aria-hidden", "true");
  $("#categoryTrigger").setAttribute("aria-expanded", "false");
  if (!$("#cartDrawer").classList.contains("is-open"))
    $("#scrim").classList.remove("is-active");
}
$("#categoryTrigger").onclick = () => {
  const open = !$("#megaMenu").classList.contains("is-open");
  $("#megaMenu").classList.toggle("is-open", open);
  $("#megaMenu").setAttribute("aria-hidden", !open);
  $("#categoryTrigger").setAttribute("aria-expanded", open);
  $("#scrim").classList.toggle("is-active", open);
};
$("#menuBtn").onclick = $("#categoryTrigger").onclick;
$("#scrim").onclick = () => {
  openCart(false);
  closeMega();
};
$("#cartBtn").onclick = () => openCart();
$("[data-close-cart]").onclick = () => openCart(false);
$$("[data-close-dialog]").forEach(
  (b) => (b.onclick = () => b.closest("dialog").close()),
);
$("#accountBtn").onclick = () => {
  const menu = $("#accountMenu");
  menu.hidden = !menu.hidden;
  $("#accountBtn").setAttribute("aria-expanded", String(!menu.hidden));
};
$$("[data-open-register]").forEach((button) => (button.onclick = openRegister));
$$("[data-open-login]").forEach((button) => {
  button.onclick = () => {
    $("#registerDialog").close();
    login();
  };
});
$("#globalSearch").onkeydown = (e) => {
  if (e.key === "Enter") location.hash = "#/products";
};
$("#loginForm").onsubmit = async (e) => {
  e.preventDefault();
  const d = Object.fromEntries(new FormData(e.target));
  state.auth = d;
  try {
    const me = await api("/api/me");
    state.auth = { ...d, ...me };
    localStorage.setItem("nova-auth", JSON.stringify(state.auth));
    $("#loginDialog").close();
    renderAccountMenu();
    toast(`Xin chào ${me.fullName}`);
    location.hash = me.role === "ADMIN" ? "#/admin" : "#/orders";
  } catch (err) {
    state.auth = null;
    toast("Tên đăng nhập hoặc mật khẩu không đúng.", true);
  }
};
$("#registerForm").onsubmit = async (e) => {
  e.preventDefault();
  const { confirmPassword, ...credentials } = Object.fromEntries(new FormData(e.target));
  if (credentials.password !== confirmPassword) {
    return toast("Hai mật khẩu chưa khớp.", true);
  }
  try {
    const user = await api("/api/register", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    state.auth = { ...credentials, ...user };
    localStorage.setItem("nova-auth", JSON.stringify(state.auth));
    e.target.reset();
    $("#registerDialog").close();
    renderAccountMenu();
    toast(`Chào mừng ${user.fullName}`);
    location.hash = "#/orders";
  } catch (err) {
    toast(err.message, true);
  }
};
$("#productForm").onsubmit = async (e) => {
  e.preventDefault();
  const d = Object.fromEntries(new FormData(e.target));
  ["price", "oldPrice", "stock"].forEach((k) => (d[k] = d[k] ? +d[k] : 0));
  d.featured = e.target.elements.featured.checked;
  d.active = e.target.elements.active.checked;
  const id = d.id;
  delete d.id;
  try {
    await api(id ? `/api/admin/products/${id}` : "/api/admin/products", {
      method: id ? "PUT" : "POST",
      body: JSON.stringify(d),
    });
    $("#productDialog").close();
    toast("Đã lưu sản phẩm");
    state.products = await api("/api/products");
    admin();
  } catch (err) {
    toast(err.message, true);
  }
};
$("#checkoutBtn").onclick = () => {
  if (!state.cart.length) return toast("Giỏ hàng đang trống.", true);
  openCart(false);
  state.auth ? $("#checkoutDialog").showModal() : login();
};
$("#checkoutForm").onsubmit = async (e) => {
  e.preventDefault();
  const d = Object.fromEntries(new FormData(e.target));
  d.lines = state.cart.map((l) => ({ productId: l.id, quantity: l.qty }));
  try {
    await api("/api/orders", { method: "POST", body: JSON.stringify(d) });
    state.cart = [];
    saveCart();
    e.target.reset();
    $("#checkoutDialog").close();
    toast("Đơn hàng đã được tạo.");
    location.hash = "#/orders";
    state.products = await api("/api/products");
  } catch (err) {
    toast(err.message, true);
  }
};
const assistantPanel = $("#assistantPanel");
const assistantToggle = $("#assistantToggle");
const assistantMessages = $("#assistantMessages");
function setAssistantOpen(open) {
  assistantPanel.hidden = !open;
  assistantToggle.setAttribute("aria-expanded", String(open));
  if (open) $("#assistantInput").focus();
}
function addAssistantMessage(message, role) {
  const bubble = document.createElement("p");
  bubble.className = `assistant__message assistant__message--${role}`;
  bubble.textContent = message;
  assistantMessages.append(bubble);
  assistantMessages.scrollTop = assistantMessages.scrollHeight;
  return bubble;
}
assistantToggle.onclick = () => setAssistantOpen(assistantPanel.hidden);
$("#assistantClose").onclick = () => setAssistantOpen(false);
$("#assistantForm").onsubmit = async (e) => {
  e.preventDefault();
  const input = $("#assistantInput");
  const submit = e.target.querySelector("button[type=submit]") || e.target.querySelector("button");
  const message = input.value.trim();
  if (!message) return;
  addAssistantMessage(message, "user");
  input.value = "";
  input.disabled = true;
  submit.disabled = true;
  const pending = addAssistantMessage("Đang tìm trong catalog…", "bot");
  try {
    const answer = await api("/api/assistant/chat", {
      method: "POST",
      body: JSON.stringify({ message }),
    });
    pending.textContent = answer.reply;
  } catch (err) {
    pending.textContent = err.message;
  } finally {
    input.disabled = false;
    submit.disabled = false;
    input.focus();
  }
};
window.addEventListener("hashchange", render);
renderAccountMenu();
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    openCart(false);
    closeMega();
    closeAccountMenu();
  }
});
load().catch((e) => toast(e.message, true));
