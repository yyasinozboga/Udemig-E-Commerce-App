import { getData } from "./api.js";
import {
  getProductsFromLS,
  updateLS,
  elements,
  countTheProducts,
  calculateTheTotal,
} from "./helpers.js";

let items = getProductsFromLS();
let products = null;
let buttons = [];

//! Sayfa yüklendiği anda çalışacak komutlar
window.addEventListener("DOMContentLoaded", async () => {
  countTheProducts(items);
  calculateTheTotal(items);
  items.forEach((item) => {
    renderMenu(item);
  });
  //! API ye istek atma
  const results = await getData();
  products = results;
  renderProducts(results);
});

//! API den gelen verileri ekrana basma
const renderProducts = (products) => {
  let productList = products
    .map((product) => {
      const { id, image, price, title } = product;
      return `
        <li class="product">
        <figure class="product-img">
        <img src="${image}" alt="${title}" />
    </figure>
    <div class="product-footer">
        <span>${title}</span>
        <span>$${price}</span>
        <button class="product-add-btn" data-id="${id}">
            <i class="fa-solid fa-cart-shopping"></i>
        </button>
    </div>
    </li>
  `;
    })
    .join("");

  elements.productList.innerHTML = productList;

  const addProductButtons = [
    ...document.getElementsByClassName("product-add-btn"),
  ];

  buttons = addProductButtons;

  addProductButtons.forEach((btn) => {
    btn.addEventListener("click", addProduct);

    items.forEach((item) => {
      if (item.id === btn.dataset.id) {
        btn.classList.add("disabled");
      }
    });
  });
};

//! Tıklanılan ürünün verilerini sepete ekleme
const addProduct = (e) => {
  const ele = e.target;
  if (ele.tagName === "I") {
    ele.parentElement.classList.add("disabled");
    const id = ele.parentElement.dataset.id;
    const product = products.find((product) => product.id === id);
    const newProduct = { ...product, amount: 1 };
    renderMenu(newProduct);
    items.push(newProduct);
    updateLS(items);
    calculateTheTotal(items);
    countTheProducts(items);
  }
};

//! Tıklanılan ürünün verilerini ekrana basma
const renderMenu = ({ amount, id, image, price, title }) => {
  const li = document.createElement("li");
  li.classList.add("card");
  li.dataset.id = id;
  li.innerHTML = `
    <div class="card-left">
        <figure class="card-img">
            <img src="${image}" alt="${title}" />
        </figure>
        <div>
            <span>${title}</span>
            <span class="card-price">$ ${price}</span>
        </div>
    </div>
    <div class="card-right">
        <div class="amount-box">
            <button class="decrease-btn">
                <i class="fa-solid fa-minus"></i>
            </button>
            <span class="amount">${amount}</span>
            <button class="increase-btn">
                <i class="fa-solid fa-plus"></i>
            </button>
        </div>

        <button class="card-delete-btn">
            <i class="fa-solid fa-trash"></i>
        </button>
    </div>
  `;

  elements.cardList.appendChild(li);

  li.addEventListener("click", handleClick);
};

//! HandleClick
const handleClick = (e) => {
  const ele = e.target;
  const id = ele.closest(".card").dataset.id;
  if (ele.classList.contains("fa-trash")) {
    elements.cardList.innerHTML = "";
    items = items.filter((item) => item.id !== id);
    buttons.forEach((btn) => {
      if (btn.dataset.id === id) {
        btn.classList.remove("disabled");
      }
    });
    items.forEach((item) => {
      renderMenu(item);
    });
    updateLS(items);
    calculateTheTotal(items);
    countTheProducts(items);
  }

  if (ele.classList.contains("fa-minus")) {
    const card = ele.closest(".card");
    const amount = card.querySelector(".amount");
    const product = items.find((item) => item.id === id);
    if (product.amount > 1) {
      product.amount = product.amount - 1;
    }
    amount.textContent = product.amount;
  }

  if (ele.classList.contains("fa-plus")) {
    const card = ele.closest(".card");
    const amount = card.querySelector(".amount");
    const product = items.find((item) => item.id === id);
    product.amount = product.amount + 1;
    amount.textContent = product.amount;
  }

  if (ele.classList.contains("fa-minus") || ele.classList.contains("fa-plus")) {
    updateLS(items);
    countTheProducts(items);
    calculateTheTotal(items);
  }
};

//! Listedeki bütün ürünleri silme
const clearList = () => {
  items = [];
  elements.cardList.innerHTML = "";
  updateLS(items);
  calculateTheTotal(items);
  countTheProducts(items);
  buttons.forEach((btn) => {
    btn.classList.remove("disabled");
  });
};

elements.clearBtn.addEventListener("click", clearList);
