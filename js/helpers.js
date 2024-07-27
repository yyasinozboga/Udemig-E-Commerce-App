//! Elements
export const elements = {
  itemListBtn: document.querySelector(".item-list-btn"),
  productList: document.querySelector(".product-list"),
  cardList: document.querySelector(".card-list"),
  clearBtn: document.querySelector(".clear-btn"),
  total: document.querySelector(".total span"),
};

//! LS deki verileri alma
export const getProductsFromLS = () => {
  return JSON.parse(localStorage.getItem("products")) || [];
};

//! LS dekir verileri güncelleme
export const updateLS = (products) => {
  localStorage.setItem("products", JSON.stringify(products));
};

export const countTheProducts = (products) => {
  const count = products.reduce((sum, product) => sum + product.amount, 0);
  elements.itemListBtn.dataset.count = count;
};

export const calculateTheTotal = (products) => {
  const total = products.reduce(
    (sum, product) => sum + product.amount * product.price,
    0,
  );
  elements.total.textContent = `$${total}`;
};
