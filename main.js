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

}

//local storage

class Storage { }

document.addEventListener('DOMContentLoaded', () => {
	const ui = new UI();
	const products = new Products();

	// get all products
	products.getProducts().then(data => console.log(data));
});
