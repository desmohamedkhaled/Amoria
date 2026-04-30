const WHATSAPP_NUMBER = "201555379961";
const CART_STORAGE_KEY = "amoria-cart";
const CART_META_STORAGE_KEY = "amoria-cart-meta";

const products = [
  {
    name: "Aurora Ring",
    price: 420,
    tone: "Silver polish",
    category: "ring",
    image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1200&q=80",
    detail: "A compact sculpted ring with a mirrored steel surface.",
  },
  {
    name: "Monarch Ring",
    price: 460,
    tone: "Mirror finish",
    category: "ring",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1200&q=80",
    detail: "A sharper ring silhouette made for daily layering.",
  },
  {
    name: "Noir Chain",
    price: 780,
    tone: "Bold layer",
    category: "chain",
    image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1200&q=80",
    detail: "A structured chain with a stronger editorial drape.",
  },
  {
    name: "Atelier Chain",
    price: 860,
    tone: "Clean silhouette",
    category: "chain",
    image: "https://images.unsplash.com/photo-1620656798579-1984d5cb6f89?auto=format&fit=crop&w=1200&q=80",
    detail: "A refined chain profile inspired by quiet luxury styling.",
  },
  {
    name: "Luna Bracelet",
    price: 540,
    tone: "Minimal curve",
    category: "bracelet",
    image: "https://images.unsplash.com/photo-1612817156729-5860c5b2d0d8?auto=format&fit=crop&w=1200&q=80",
    detail: "A smooth bracelet with a soft polished arc.",
  },
  {
    name: "Crown Bracelet",
    price: 610,
    tone: "Statement piece",
    category: "bracelet",
    image: "https://images.unsplash.com/photo-1612817156729-1a5f8d0b85b1?auto=format&fit=crop&w=1200&q=80",
    detail: "A bolder bracelet for a more elevated wrist stack.",
  },
];

const instagramEntries = [
  {
    title: "Amoria / Rings",
    subtitle: "Clean lines. Mirror shine.",
    image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Amoria / Layers",
    subtitle: "Stacked with restraint.",
    image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Amoria / Bracelets",
    subtitle: "Polished everyday detail.",
    image: "https://images.unsplash.com/photo-1612817156729-5860c5b2d0d8?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Amoria / Craft",
    subtitle: "Minimal, premium, refined.",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1200&q=80",
  },
];

const reviews = [
  {
    text: "The finish feels more premium than expected. It looks expensive and clean.",
    author: "Nour A.",
  },
  {
    text: "The chain stacks perfectly with other pieces. Very elegant packaging too.",
    author: "Youssef M.",
  },
  {
    text: "Smooth ordering on WhatsApp and the size guidance was helpful.",
    author: "Salma H.",
  },
];

const sizeOptionsByCategory = {
  ring: ["EU 52", "EU 54", "EU 56", "EU 58", "EU 60"],
  chain: ["45 cm", "50 cm", "55 cm", "60 cm"],
  bracelet: ["S", "M", "L"],
};

let activeQuickViewProduct = null;
let cart = loadCart();
let cartMeta = loadCartMeta();
let menuHideTimer = null;

function formatPrice(amount) {
  return `EGP ${amount}`;
}

function order(productName) {
  const message = `I want to order: ${productName} from Amoria`;
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function loadCart() {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (!savedCart) {
      return [];
    }

    const parsed = JSON.parse(savedCart);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function loadCartMeta() {
  try {
    const savedMeta = localStorage.getItem(CART_META_STORAGE_KEY);
    if (!savedMeta) {
      return { contactPreference: "WhatsApp", note: "" };
    }

    const parsed = JSON.parse(savedMeta);
    return {
      contactPreference: parsed.contactPreference || "WhatsApp",
      note: parsed.note || "",
    };
  } catch {
    return { contactPreference: "WhatsApp", note: "" };
  }
}

function saveCart() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

function saveCartMeta() {
  localStorage.setItem(CART_META_STORAGE_KEY, JSON.stringify(cartMeta));
}

function findProduct(productName) {
  return products.find((product) => product.name === productName);
}

function sizeOptionsForProduct(product) {
  return sizeOptionsByCategory[product.category] || ["One size"];
}

function defaultSizeForProduct(product) {
  return sizeOptionsForProduct(product)[0];
}

function updateCartCount() {
  const cartCount = document.getElementById("cartCount");
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  if (!cartCount) {
    return;
  }

  cartCount.textContent = String(totalItems);
  cartCount.hidden = totalItems === 0;
}

function renderProducts() {
  const productGrid = document.getElementById("productGrid");

  if (!productGrid) {
    return;
  }

  productGrid.innerHTML = products
    .map((product) => `
      <article class="product-card reveal">
        <div class="product-visual">
          <img src="${product.image}" alt="${product.name}" />
          <span class="product-tag">${product.tone}</span>
        </div>
        <div class="product-body">
          <h3>${product.name}</h3>
          <div class="product-meta">
            <span>${product.tone}</span>
            <span class="product-price">${formatPrice(product.price)}</span>
          </div>
          <p>${product.detail}</p>
          <div class="product-actions">
            <button class="btn product-order" type="button" data-add-to-cart="${product.name}" aria-label="Add ${product.name} to cart">
              Add to cart
            </button>
            <button class="btn product-quick-view" type="button" data-quick-view-product="${product.name}" aria-label="Open quick view for ${product.name}">
              Quick view
            </button>
          </div>
        </div>
      </article>
    `)
    .join("");
}

function renderInstagram() {
  const gallery = document.querySelector(".instagram-grid");

  if (!gallery) {
    return;
  }

  gallery.innerHTML = instagramEntries
    .map((entry) => `
      <article class="gallery-card reveal">
        <img src="${entry.image}" alt="${entry.title}" />
        <span>${entry.title}</span>
        <strong>${entry.subtitle}</strong>
      </article>
    `)
    .join("");
}

function renderReviews() {
  const grid = document.querySelector(".review-grid");

  if (!grid) {
    return;
  }

  grid.innerHTML = reviews
    .map((review) => `
      <article class="review-card reveal">
        <p>"${review.text}"</p>
        <strong>${review.author}</strong>
      </article>
    `)
    .join("");
}

function renderCart() {
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const contactPreference = document.getElementById("cartContactPreference");
  const globalNote = document.getElementById("cartGlobalNote");

  if (!cartItems || !cartTotal || !contactPreference || !globalNote) {
    return;
  }

  contactPreference.value = cartMeta.contactPreference;
  globalNote.value = cartMeta.note;

  if (cart.length === 0) {
    cartItems.innerHTML = '<div class="cart-empty">Your cart is empty.</div>';
    cartTotal.textContent = formatPrice(0);
    updateCartCount();
    return;
  }

  let total = 0;

  cartItems.innerHTML = cart
    .map((item) => {
      const product = findProduct(item.name);
      const itemTotal = (product?.price || 0) * item.qty;
      const itemSizeOptions = product ? sizeOptionsForProduct(product) : ["One size"];
      total += itemTotal;
      const currentSize = item.size || itemSizeOptions[0];
      const currentNote = item.note || "";

      return `
        <article class="cart-item">
          <div class="cart-item-image">
            <img src="${product?.image || products[0].image}" alt="${item.name}" />
          </div>
          <div class="cart-item-body">
            <h4>${item.name}</h4>
            <div class="cart-item-meta">
              <span>${formatPrice(product?.price || 0)}</span>
              <span>Qty ${item.qty}</span>
            </div>
            <div class="cart-field-grid">
              <label>
                <span>Size</span>
                <select data-cart-field="size" data-cart-product="${item.name}">
                  ${itemSizeOptions.map((sizeOption) => `<option value="${sizeOption}" ${sizeOption === currentSize ? "selected" : ""}>${sizeOption}</option>`).join("")}
                </select>
              </label>
              <label>
                <span>Quick note</span>
                <textarea rows="2" data-cart-field="note" data-cart-product="${item.name}" placeholder="Color, engraving, gift wrap">${currentNote}</textarea>
              </label>
            </div>
            <div class="cart-item-actions">
              <button class="cart-item-action" type="button" data-cart-action="decrease" data-cart-product="${item.name}">-</button>
              <button class="cart-item-action" type="button" data-cart-action="increase" data-cart-product="${item.name}">+</button>
              <button class="cart-item-action" type="button" data-cart-action="remove" data-cart-product="${item.name}">Remove</button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  cartTotal.textContent = formatPrice(total);
  updateCartCount();
}

function openOverlay() {
  document.documentElement.classList.add("overlay-open");
  document.body.classList.add("overlay-open");
}

function closeOverlay() {
  document.documentElement.classList.remove("overlay-open");
  document.body.classList.remove("overlay-open");
}

function openCartDrawer() {
  const drawer = document.getElementById("cartDrawer");
  const backdrop = document.getElementById("overlayBackdrop");
  const toggle = document.querySelector(".cart-toggle");

  if (!drawer || !backdrop || !toggle) {
    return;
  }

  drawer.hidden = false;
  backdrop.hidden = false;
  drawer.setAttribute("aria-hidden", "false");
  toggle.setAttribute("aria-expanded", "true");
  openOverlay();
}

function closeCartDrawer() {
  const drawer = document.getElementById("cartDrawer");
  const backdrop = document.getElementById("overlayBackdrop");
  const toggle = document.querySelector(".cart-toggle");

  if (!drawer || !backdrop || !toggle) {
    return;
  }

  drawer.hidden = true;
  backdrop.hidden = true;
  drawer.setAttribute("aria-hidden", "true");
  toggle.setAttribute("aria-expanded", "false");
  closeOverlay();
}

function toggleCartDrawer() {
  const drawer = document.getElementById("cartDrawer");

  if (!drawer) {
    return;
  }

  if (drawer.hidden) {
    openCartDrawer();
    return;
  }

  closeCartDrawer();
}

function addToCart(productName) {
  const product = findProduct(productName);

  if (!product) {
    return;
  }

  const existingItem = cart.find((item) => item.name === product.name);
  const defaultSize = defaultSizeForProduct(product);

  if (existingItem) {
    existingItem.qty += 1;
    if (!existingItem.size) {
      existingItem.size = defaultSize;
    }
  } else {
    cart.push({ name: product.name, qty: 1, size: defaultSize, note: "" });
  }

  saveCart();
  renderCart();
  openCartDrawer();
}

function updateCartItem(productName, action) {
  const existingItem = cart.find((item) => item.name === productName);

  if (!existingItem) {
    return;
  }

  if (action === "increase") {
    existingItem.qty += 1;
  }

  if (action === "decrease") {
    existingItem.qty -= 1;
  }

  if (action === "remove" || existingItem.qty <= 0) {
    cart = cart.filter((item) => item.name !== productName);
  }

  saveCart();
  renderCart();
}

function updateCartField(productName, fieldName, value) {
  const existingItem = cart.find((item) => item.name === productName);

  if (!existingItem) {
    return;
  }

  existingItem[fieldName] = value;
  saveCart();
}

function checkoutCart() {
  if (cart.length === 0) {
    return;
  }

  const lines = cart.map((item) => {
    const product = findProduct(item.name);
    const itemPrice = product ? product.price : 0;
    const itemParts = [`- ${item.name} x${item.qty} (${formatPrice(itemPrice)})`];

    if (item.size) {
      itemParts.push(`Size: ${item.size}`);
    }

    if (item.note) {
      itemParts.push(`Note: ${item.note}`);
    }

    return itemParts.join(" | ");
  });

  const total = cart.reduce((sum, item) => {
    const product = findProduct(item.name);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);

  const messageParts = ["I want to order from Amoria:", ...lines, `Total: ${formatPrice(total)}`];

  if (cartMeta.contactPreference) {
    messageParts.push(`Preferred contact: ${cartMeta.contactPreference}`);
  }

  if (cartMeta.note) {
    messageParts.push(`Quick note: ${cartMeta.note}`);
  }

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(messageParts.join("\n"))}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function openQuickView(productName) {
  const backdrop = document.getElementById("quickViewBackdrop");
  const visual = document.getElementById("quickViewVisual");
  const tone = document.getElementById("quickViewTone");
  const title = document.getElementById("quickViewTitle");
  const description = document.getElementById("quickViewDescription");
  const price = document.getElementById("quickViewPrice");
  const detail = document.getElementById("quickViewDetail");
  const orderButton = document.getElementById("quickViewOrder");
  const product = findProduct(productName);

  if (!backdrop || !visual || !tone || !title || !description || !price || !detail || !orderButton || !product) {
    return;
  }

  activeQuickViewProduct = product.name;
  backdrop.hidden = false;
  visual.innerHTML = `<img src="${product.image}" alt="${product.name}" />`;
  tone.textContent = product.tone;
  title.textContent = product.name;
  description.textContent = product.detail;
  price.textContent = formatPrice(product.price);
  detail.textContent = "WhatsApp order available";
  orderButton.dataset.orderProduct = product.name;
  openOverlay();
}

function closeQuickView() {
  const backdrop = document.getElementById("quickViewBackdrop");

  if (!backdrop) {
    return;
  }

  backdrop.hidden = true;
  activeQuickViewProduct = null;
  closeOverlay();
}

function openMobileMenu() {
  const menu = document.getElementById("mobileMenu");
  const toggle = document.querySelector(".menu-toggle");

  if (!menu || !toggle) {
    return;
  }

  clearTimeout(menuHideTimer);
  menu.hidden = false;
  requestAnimationFrame(() => {
    menu.classList.add("is-open");
  });
  toggle.setAttribute("aria-expanded", "true");
  document.documentElement.classList.add("menu-open");
  document.body.classList.add("menu-open");
}

function closeMobileMenu() {
  const menu = document.getElementById("mobileMenu");
  const toggle = document.querySelector(".menu-toggle");

  if (!menu || !toggle) {
    return;
  }

  menu.classList.remove("is-open");
  toggle.setAttribute("aria-expanded", "false");
  document.documentElement.classList.remove("menu-open");
  document.body.classList.remove("menu-open");
  clearTimeout(menuHideTimer);
  menuHideTimer = window.setTimeout(() => {
    menu.hidden = true;
  }, 220);
}

function setupMobileMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.getElementById("mobileMenu");
  const closeButton = document.querySelector(".mobile-menu-close");

  if (!toggle || !menu || !closeButton) {
    return;
  }

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    if (isOpen) {
      closeMobileMenu();
      return;
    }
    openMobileMenu();
  });

  closeButton.addEventListener("click", closeMobileMenu);

  menu.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      closeMobileMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 900) {
      closeMobileMenu();
    }
  });
}

function setupWhatsAppButtons() {
  document.addEventListener("click", (event) => {
    const addTrigger = event.target.closest("[data-add-to-cart]");
    if (addTrigger) {
      addToCart(addTrigger.dataset.addToCart);
      return;
    }

    const orderTrigger = event.target.closest("[data-order-product]");
    if (orderTrigger) {
      order(orderTrigger.dataset.orderProduct);
      return;
    }

    const quickViewTrigger = event.target.closest("[data-quick-view-product]");
    if (quickViewTrigger) {
      openQuickView(quickViewTrigger.dataset.quickViewProduct);
    }
  });
}

function setupFloatingWhatsApp() {
  const floatingButton = document.querySelector(".floating-whatsapp");

  if (!floatingButton) {
    return;
  }

  floatingButton.addEventListener("click", (event) => {
    event.preventDefault();
    checkoutCart();
  });
}

function setupCart() {
  const cartToggle = document.querySelector(".cart-toggle");
  const cartBackdrop = document.getElementById("overlayBackdrop");
  const cartClose = document.querySelector(".cart-close");
  const cartCheckout = document.getElementById("cartCheckout");
  const contactPreference = document.getElementById("cartContactPreference");
  const globalNote = document.getElementById("cartGlobalNote");

  if (cartToggle) {
    cartToggle.addEventListener("click", toggleCartDrawer);
  }

  if (cartBackdrop) {
    cartBackdrop.addEventListener("click", () => {
      closeCartDrawer();
      closeQuickView();
      closeMobileMenu();
    });
  }

  if (cartClose) {
    cartClose.addEventListener("click", closeCartDrawer);
  }

  if (cartCheckout) {
    cartCheckout.addEventListener("click", checkoutCart);
  }

  if (contactPreference) {
    contactPreference.addEventListener("change", (event) => {
      cartMeta.contactPreference = event.target.value;
      saveCartMeta();
    });
  }

  if (globalNote) {
    globalNote.addEventListener("input", (event) => {
      cartMeta.note = event.target.value;
      saveCartMeta();
    });
  }

  document.addEventListener("change", (event) => {
    const field = event.target.closest("[data-cart-field]");

    if (!field) {
      return;
    }

    updateCartField(field.dataset.cartProduct, field.dataset.cartField, field.value.trim());
  });

  document.addEventListener("click", (event) => {
    const actionButton = event.target.closest("[data-cart-action]");

    if (!actionButton) {
      return;
    }

    updateCartItem(actionButton.dataset.cartProduct, actionButton.dataset.cartAction);
  });
}

function setupQuickViewModal() {
  const backdrop = document.getElementById("quickViewBackdrop");
  const closeButton = document.querySelector(".modal-close");
  const orderButton = document.getElementById("quickViewOrder");

  if (!backdrop || !closeButton || !orderButton) {
    return;
  }

  closeButton.addEventListener("click", closeQuickView);

  backdrop.addEventListener("click", (event) => {
    if (event.target === backdrop) {
      closeQuickView();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !backdrop.hidden) {
      closeQuickView();
    }
  });

  orderButton.addEventListener("click", () => {
    if (activeQuickViewProduct) {
      addToCart(activeQuickViewProduct);
      closeQuickView();
    }
  });
}

function setupScrollReveal() {
  const revealItems = document.querySelectorAll(".reveal");

  if (!revealItems.length) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -6% 0px",
    },
  );

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 45, 240)}ms`;
    observer.observe(item);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderInstagram();
  renderReviews();
  renderCart();
  updateCartCount();
  setupMobileMenu();
  setupWhatsAppButtons();
  setupFloatingWhatsApp();
  setupQuickViewModal();
  setupCart();
  setupScrollReveal();
});
