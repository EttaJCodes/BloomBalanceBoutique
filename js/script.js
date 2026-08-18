// Store all products after they are loaded from the CSV file.
let products = [];

// Keep track of the number of products added to the cart.
let cartCount = 0;
let cartItems = [];


// Load the product information when the page opens.
async function loadProducts() {
   try {
       const response = await fetch("data/products.csv");
       if (!response.ok) {
           throw new Error("The product file could not be loaded.");
       }

       const csvText = await response.text();

       products = convertCsvToProducts(csvText);

       displayProducts(products);
   } catch (error) {
       console.error(error);

       document.getElementById("product-list").innerHTML = `
          <p>Products could not be loaded. Please try again.</p>
       `;
   }
}

// Convert each row of the CSV file into a product object.
function convertCsvToProducts(csvText) {
    const rows = csvText.trim().split("\n");

    // Remove the heading row.
    rows.shift();

    return rows.map((row) => {
        const values = row.split(",");
        return {
            id: values[0].trim(),
            name: values[1].trim(),
            category: values[2].trim(),
            price: Number(values[3].trim()),
            description: values[4].trim(),
            image: values[5].trim()
        };
    });
}

// Display the products on the webpage.
function displayProducts(productList) {
    const productContainer = document.getElementById("product-list");

    productContainer.innerHTML = "";

    if (productList.length === 0) {
        productContainer.innerHTML = `
            <p>No products were found.</p>
       `;
        return;
    }

    productList.forEach((product) => {
        const productCard = document.createElement("article");

        productCard.classList.add("product-card");

        productCard.innerHTML = `
<img
    src="${product.image}"
    alt="${product.name}"
    class="product-image"
>

           <h3>${product.name}</h3>

           <p><strong>${product.category}</strong></p>

           <p>${product.description}</p>

           <p class="product-price">
               $${product.price.toFixed(2)}
           </p>

           <button type="button" onclick="addToCart('${product.id}')">
               Add to Cart
           </button>
      `;

        productContainer.appendChild(productCard);
   });
}

// Search for products as the customer types.
function searchProducts() {
    const searchInput = document
       .getElementById("search-input")
       .value
       .toLowerCase()
       .trim();

    const matchingProducts = products.filter((product) => {
       return (
           product.name.toLowerCase().includes(searchInput) ||
           product.category.toLowerCase().includes(searchInput)
       );
   });

   displayProducts(matchingProducts);
}

// Update the cart counter.
function addToCart(productId) {
    const selectedProduct = products.find(
        (product) => product.id === productId
   );
   
   if (!selectedProduct) {
       return;
   }

   cartItems.push(selectedProduct);
   cartCount = cartItems.length;

   document.getElementById("cart-count").textContent = cartCount;

   displayCartItems();
}
// Display products inside the shopping cart.
function displayCartItems() {
    const cartItemsContainer = document.getElementById("cart-items");

    if (!cartItemsContainer) {
        return;
    }

    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML =
            "<p>Your cart is currently empty.</p>";
        return;
    }

    const cartTotal = cartItems.reduce(
        (total, product) => total + Number(product.price),
        0
    );

    cartItemsContainer.innerHTML = `
        ${cartItems
            .map(
                (product, index) => `
                    <div class="cart-item">
                        <div>
                            <h3>${product.name}</h3>
                            <p>$${Number(product.price).toFixed(2)}</p>
                        </div>

                        <button
                            type="button"
                            class="remove-item"
                            data-index="${index}"
                        >
                            Remove
                        </button>
                    </div>
                `
            )
            .join("")}

        <div class="cart-total">
            <strong>Total:</strong>
            <strong>$${cartTotal.toFixed(2)}</strong>
        </div>
  `;

   const removeButtons =
       cartItemsContainer.querySelectorAll(".remove-item");

    removeButtons.forEach((button) => {
        button.addEventListener("click", function () {
            const itemIndex = Number(this.dataset.index);
            removeFromCart(itemIndex);
        });
    });
}
function removeFromCart(index) {
    cartItems.splice(index, 1);
    cartCount = cartItems.length;

    document.getElementById("cart-count").textContent = cartCount;

    displayCartItems();
}
// Connect the search box to the search function.
document
.getElementById("search-input")
.addEventListener("input", searchProducts);

// Begin loading the products.
loadProducts();
const cartButton = document.querySelector(".cart");
const cartModal = document.getElementById("cart-modal");
const closeCartButton = document.getElementById("close-cart");

if (cartButton && cartModal && closeCartButton) {
    cartButton.addEventListener("click", function () {
        displayCartItems();
        cartModal.classList.add("active");
    });

    closeCartButton.addEventListener("click", function () {
        cartModal.classList.remove("active");
    });

    cartModal.addEventListener("click", function (event) {
        if (event.target === cartModal) {
            cartModal.classList.remove("active");
        }
   });
} else {
console.error("One or more shopping cart elements could not be found.");
}