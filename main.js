// variables for page

const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDOM = document.querySelector('.products-center');

//for cart
let cart = [];

//buttons
let buttonsDOM = [];

//getting products

/* //non async way
class Products {
	getProducts(){
		fetch('products.json')
	}
} */

// async way
class Products {
	async getProducts() {
		try {
			let result = await fetch('products.json');
			//returns data using json method
			let data = await result.json();
			let products = data.items;
			products = products.map((items) => {
				const { title, price } = items.fields; //gets from fields in json
				const { id } = items.sys;
				const image = items.fields.image.fields.file.url;
				return {
					title,
					price,
					id,
					image
				};
			});
			return products;
		} catch (error) {
			console.log(error);
		}
	}
}

//displaying products
class UI {
	displayProducts(products) {
		let result = '';
		products.forEach((product) => {
			result +=
				//taken from index.html
				`
            <article class="product">
                <div class="img-container">
                    <img src=${product.image} alt="product" class="product-img">
                    <button class="bag-btn" data-id=${product.id}>
                        <i class="fas fa-shopping-cart"></i>
                        add to cart
                    </button>
                </div>
                <h3>${product.title}</h3>
                <h4>$${product.price}</h4>
            </article>
			`;
		});
		productsDOM.innerHTML = result;
	}

	//add items to cart

	getCartButtons() {
		const buttons = [ ...document.querySelectorAll('.bag-btn') ];

		buttonsDOM = buttons;

		buttons.forEach((button) => {
			let id = button.dataset.id;
			let inCart = cart.find((item) => item.id === id);
			//checks to see if items are in the cart or not
			if (inCart) {
				button.innerText = 'In Cart';
				button.disabled = true;
			} //(not using) else {
			button.addEventListener('click', (event) => {
				event.target.innerText = 'In Cart';
				event.target.disabled = true;
				// get product from products based on .id
				let cartItem = { ...Storage.getProduct(id), amount: 1 };

				//add product to carts
				cart = [ ...cart, cartItem ];

				//cart saved to local storage
				Storage.saveCart(cart);
				//set cart values
				this.setCartValues(cart);

				//display cart item
				this.addCartItem(cartItem);
				//show cart
				this.showCart();
			});
			//}
		});
	}
	setCartValues(cart) {
		let tempTotal = 0;
		let itemsTotal = 0;
		cart.map((item) => {
			tempTotal += item.price * item.amount;
			itemsTotal += item.amount;
		});

		cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
		cartItems.innerText = itemsTotal;
	}
	addCartItem(item) {
		const div = document.createElement('div');
		div.classList.add('cart-item');
		div.innerHTML = `
		<img src=${item.image} alt="product">
		<div>
			<h4>${item.title}</h4>
			<h5>$${item.price}</h5>
			<span class="remove-item">remove</span>
		</div>
		<div>
			<i class="fas fa-chevron-up" data-id=${item.id}></i>
			<p class="item-amount">${item.amount}</p>
			<i class="fas fa-chevron-down" data-id=${item.id}></i>
		</div>
		`;
		cartContent.appendChild(div);
	}

	showCart() {
		cartOverlay.classList.add('transparentBcg');
		cartDOM.classList.add('showCart');
	}
	// button to retreive buttons
	setupAPP() {
		cart = Storage.getCart();
		this.setCartValues(cart);
		this.populateCart(cart);
		cartBtn.addEventListener('click', this.showCart);
		closeCartBtn.addEventListener('click', this.hideCart);
	}

	populateCart(cart) {
		cart.forEach((item) => this.addCartItem(item));
	}
	hideCart() {
		cartOverlay.classList.remove('transparentBcg');
		cartDOM.classList.remove('showCart');
	}
	cartLogic() {
		//clears cart button
		clearCartBtn.addEventListener('click', () => {
			this.clearCart();
		});
		//cart functionality
		cartContent.addEventListener('click', (event) => {
			if (event.target.classList.contains('remove-item')) {
				let removeItem = event.target;
				let id = removeItem.dataset.id;
				console.log(removeItem.parentElement.parentElement);
				this.removeItem(id);
			} else if (event.target.classList.contains('fa-chevron-up')) {
				let addAmount = event.target;
				let id = addAmount.dataset.id;
				let tempItem = cart.find((item) => item.id === id);
				tempItem.amount = tempItem.amount + 1;
				Storage.saveCart(cart);
				this.setCartValues(cart);
				addAmount.nextElementSibling.innerText = tempItem.amount;
			} else if (event.target.classList.contains('fa-chevron-down')) {
				let minusAmount = event.target;
				let id = minusAmount.dataset.id;
				let tempItem = cart.find((item) => item.id === id);
				tempItem.amount = tempItem.amount - 1;
				//lower than 0
				if (tempItem.amount > 0) {
					Storage.saveCart(cart);
					this.setCartValues(cart);
					minusAmount.previousElementSibling.innerText = tempItem.amount;
				} else {
					cartContent.removeChild(minusAmount.parentElement.parentElement);
					this.removeItem(id);
				}
			}
		});
	}
	clearCart() {
		let cartItems = cart.map((item) => item.id);
		cartItems.forEach((id) => this.removeItem(id));

		while (cartContent.children.length > 0) {
			cartContent.removeChild(cartContent.children[0]);
		}
		this.hideCart();
	}
	removeItem(id) {
		cart = cart.filter((item) => item.id !== id);
		this.setCartValues(cart);
		Storage.saveCart(cart);
		let button = this.getSingleButton(id);
		button.disabled = false;
		button.innerHTML = `<i class='fas fa-shopping-cart'></i>add to cart`;
	}
	getSingleButton(id) {
		return buttonsDOM.find((button) => {
			return button.dataset.id === id;
		});
	}
}

//local storage

class Storage {
	static saveProducts(products) {
		localStorage.setItem('products', JSON.stringify(products));
	}
	static getProduct(id) {
		let products = JSON.parse(localStorage.getItem('products'));
		return products.find((product) => product.id === id);
	}
	static saveCart(cart) {
		localStorage.setItem('cart', JSON.stringify(cart));
	}
	//assigns value from ther storage to cart array
	static getCart() {
		return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const ui = new UI();
	const products = new Products();
	//setupp applicaton
	ui.setupAPP();

	// get all products
	products
		.getProducts()
		.then((products) => {
			ui.displayProducts(products);
			Storage.saveProducts(products);
		})
		.then(() => {
			ui.getCartButtons();
			ui.cartLogic();
		});
});
