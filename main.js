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
let buttonsDOM[];

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
			let result = await fetch("products.json");
			//returns data using json method
			let data = await result.json();
			let products = data.items;
			products = products.map(items => {
				const { title, price } = items.fields; //gets from fields in json
				const { id } = items.sys;
				const image = items.fields.image.fields.file.url;
				return {
					title,
					price,
					id,
					image
				}
			})
			return products
		} catch (error) {
			console.log(error);
		}
	}
}

//displaying products
class UI {
	displayProducts(products) {
		let result = '';
		products.forEach(product => {
			result +=
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
	};

	//add items to cart

	getCartButtons() {
		const buttons = [...document.querySelectorAll(".bag-btn")];

		buttonsDOM = buttons;

		buttons.forEach(button => {
			let id = button.dataset.id;
			let inCart = cart.find(item => item.id === id);
			//checks to see if items are in the cart or not
			if (inCart) {
				button.innerText = "In Cart";
				button.disabled = true
			} //(not using) else {
			button.addEventListener('click', (event) => {
				event.target.innerText = "In Cart";
				event.target.disabled = true;
				// get product from products based on .id

				//add product to carts

				//cart saved to local storage

				//set cart values


				//display cart item

				//show cart
			});
			//}
		});
	}
}

//local storage

class Storage {
	static saveProducts(products) {
		localStorage.setItem("products", JSON.stringify(products));
	}

}

document.addEventListener('DOMContentLoaded', () => {
	const ui = new UI();
	const products = new Products();

	// get all products
	products.getProducts().then(products => {
		ui.displayProducts(products);
		Storage.saveProducts(products);
	}).then(() => {
		ui.getCartButtons();
	});
});
