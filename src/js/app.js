const cartBtn = document.querySelector(".cart-btn");
const cartModal = document.querySelector(".cart");
const backDrop = document.querySelector(".backdrop");
const closeMdal = document.querySelector(".cart-item-confirm");

const producsDOM = document.querySelector(".products-center");
const cartTotal = document.querySelector(".cart-total");
const cartItems = document.querySelector(".cart-items");
const cartContent = document.querySelector(".cart-content");
const clearCart = document.querySelector(".clear-cart");



import { productsData } from "./products.js";

let cart = [];
// 1. get Products

class Products {
  // get from api
  getProducts() {
    return productsData;
  }
}

let buttonsDOM = [];
// 2. display Products

class UI {
  displayProducts(products) {
    let result = "";
    products.forEach((item) => {
      result += `<div class="product">
      <div class="img-container">
        <img
          class="product-img"
          src="${item.imageUrl}"
          alt="p-1"
        />
      </div>
      <div class="product-desc">
        <p class="product-price">$ ${item.price}</p>
        <p class="product-titel">${item.title}</p>
      </div>
      <button class="add-to-cart" data-id=${item.id}>
         add to cart
      </button>
    </div>`;

      producsDOM.innerHTML = result;
    });
  }

  getAddToCartBtns() {
    const addTocartBtn = [...document.querySelectorAll(".add-to-cart")];
    buttonsDOM = addTocartBtn;
    addTocartBtn.forEach((btn) => {
      const id = btn.dataset.id;
      // check if this products id is in cart or not !
      const isInCart = cart.find((p) => p.id === parseInt(id));
      if (isInCart) {
        btn.innerText = "In Cart";
        btn.disabled = true;
      }

      btn.addEventListener("click", (event) => {
        event.target.innerText = "In Cart";
        event.target.disabled = true;
        // get product from products ;
        const addProduct = { ...Storage.getProduct(id), quantity: 1 };
        // add to cart
        // console.log(addProduct);
        cart = [...cart, addProduct];

        // save cart to Local storage
        Storage.saveCart(cart);
        // Update cart to value
        this.setCartValue(cart);
        // add to cart item
        this.addCartItem(addProduct);
        // get cart from storage !
      });
    });
  }
  setCartValue(cart) {
    //  1. cart items :
    // 2. cart total price
    let tempCartItems = 0;
    const totalPrice = cart.reduce((acc, curr) => {
      tempCartItems += curr.quantity; // 2+ 1 => 3
      return acc + curr.quantity * curr.price;
    }, 0);
    cartTotal.innerText = `total price : ${totalPrice.toFixed(2)} $`;
    cartItems.innerText = tempCartItems;
    // console.log(tempCartItems);
  }
  addCartItem(cartItem) {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `<img
    class="cart-item-img"
    src="${cartItem.imageUrl}"
    alt="p -2"
  />
  <div class="cart-item-desc">
    <h4>${cartItem.title}</h4>
    <h5>$ ${cartItem.price}</h5>
  </div>
  <div class="cart-item-conteoller">
    <i class="fas fa-chevron-up" data-id=${cartItem.id}></i>
    <p>${cartItem.quantity}</p>
    <i class="fas fa-chevron-down" data-id=${cartItem.id}></i>
  </div>
  <i class="fas fa-trash-alt" data-id=${cartItem.id}></i>
  `;
    cartContent.appendChild(div);
  }
  setupApp() {
    // get cart from storage:
    cart = Storage.getCart();
    // addCartItem
    cart.forEach((cartitem) => this.addCartItem(cartitem));
    // setvaluse : price + items
    this.setCartValue(cart);
  }
  cartLogic() {
    // clear cart :
    clearCart.addEventListener("click", () => this.clearCart());

    // cart founctionality
    cartContent.addEventListener("click", (event) => {
      if (event.target.classList.contains("fa-chevron-up")) {
        // console.log(event.target);
        const addQuantity = event.target;
        // 1. get item from cart
        const addadIteme = cart.find(
          (cItem) => cItem.id == addQuantity.dataset.id
        );
        addadIteme.quantity++;
        // 2. update cart value
        this.setCartValue(cart);
        // 3. save cart
        Storage.saveCart(cart);
        // 4. update cart item in UI :
        addQuantity.nextElementSibling.innerText = addadIteme.quantity;
      } else if (event.target.classList.contains("fa-trash-alt")) {
        const removeItem = event.target;
        // remove form cartitem
        const _removedItem = cart.find(
          (cItem) => cItem.id == removeItem.dataset.id
        );
        this.removeItem(_removedItem.id);
        Storage.saveCart(cart);
        cartContent.removeChild(removeItem.parentElement);
        // remove
      } else if (event.target.classList.contains("fa-chevron-down")) {
        const supQuantity = event.target;
        const substractedItem = cart.find(
          (cItem) => cItem.id == supQuantity.dataset.id
        );

        if (substractedItem.quantity == 1) {
          this.removeItem(substractedItem.id);
          cartContent.removeChild(supQuantity.parentElement.parentElement);
          return
        }

        substractedItem.quantity--;
        this.setCartValue(cart);
        // 3. save cart
        Storage.saveCart(cart);
        supQuantity.previousElementSibling.innerText = substractedItem.quantity;
      }
    });
  }
  clearCart() {
    // remove : (DRY)
    cart.forEach((cItem) => this.removeItem(cItem.id));
    // remove cart content chindLren :
    while (cartContent.children.length) {
      cartContent.removeChild(cartContent.children[0]);
    }
    closeModalFunction();
  }
  removeItem(id) {
    // update cart
    cart = cart.filter((cItem) => cItem.id !== id);
    // total price and cart items
    this.setCartValue(cart);
    // update storage
    Storage.saveCart(cart);

    // get add to cart btns => update text and disable

    this.getSinglebutton(id);
  }
  getSinglebutton(id) {
    const button = buttonsDOM.find(
      (btn) => parseInt(btn.dataset.id) === parseInt(id)
    );
    button.innerText = "add to cart";
    button.disabled = false;
  }
}
// 3. storage

class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }

  static getProduct(id) {
    const _products = JSON.parse(localStorage.getItem("products"));
    return _products.find((p) => p.id === parseInt(id));
  }

  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCart(cart) {
    return JSON.parse(localStorage.getItem("cart"))
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
    // || []
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const products = new Products();
  const productsData = products.getProducts();

  // set up : cart and set up app :
  const ui = new UI();
  ui.setupApp();
  ui.displayProducts(productsData);
  ui.getAddToCartBtns();
  ui.cartLogic();
  Storage.saveProducts(productsData);
});

// cart items modal
function showModalFunction() {
  backDrop.style.display = "block";
  cartModal.style.opacity = "1";
  cartModal.style.top = "30%";
  
}

function closeModalFunction() {
  backDrop.style.display = "none";
  cartModal.style.opacity = "0";
  cartModal.style.top = "-100%";
}

cartBtn.addEventListener("click", showModalFunction);
closeMdal.addEventListener("click", closeModalFunction);
backDrop.addEventListener("click", closeModalFunction);
