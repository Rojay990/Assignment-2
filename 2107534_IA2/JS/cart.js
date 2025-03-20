

let idArray = JSON.parse(localStorage.getItem("buttonID")) || [];
let addToCartButton = document.querySelector(".add-to-cart");
const totalQuantityElement = document.getElementById('totalquantity');



document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener("click", function() {
        console.log(`Button clicked: ${this.id}`);
        if(idArray == null){
            idArray = [];
        }
        idArray.push(this.id);
        console.log('Values in array is :', idArray);
        localStorage.setItem("buttonID", JSON.stringify(idArray));
        const totalQuantityElement = document.getElementById('totalquantity');
        if (totalQuantityElement) {
            const totalQuantity = idArray.length;
            totalQuantityElement.textContent = totalQuantity;
        } else {
            console.warn("Error: #totalquantity not found in the document.");
        }
    });
})



// Define an asynchronous function to fetch data from a JSON file
async function fetchData() {
    // Fetch the JSON file from the specified path
    const response = await fetch('../JSON/data.json');
    
    // Parse the JSON data from the response
    const data = await response.json();
    
    // Store the parsed data in an array
    const dataArray = data;

    // Return the data array for further use
    return dataArray;
}


// Run this function to populate cart based on what items user added to cart and update amount of item in the cart
if (window.location.pathname.includes("Cart.html")) {

        if (totalQuantityElement) {
            const totalQuantity = idArray.length;
            totalQuantityElement.textContent = totalQuantity;
        } else {
            console.warn("Error: #totalquantity not found in the document.");
        }

    if (idArray && Array.isArray(idArray)) {
        idArray.forEach(id => {
            populateItems(id);
        });
    } else {
        console.log('No items found in the cart.');
    }
}

// Run this function to update amount of item in the cart when on the Homepage
if (window.location.pathname.includes("Homepage.html")) {

        if (totalQuantityElement) {
            const totalQuantity = idArray.length;
            totalQuantityElement.textContent = totalQuantity;
        } else {
            console.warn("Error: #totalquantity not found in the document.");
        }
}

// Run this function to update amount of item in the cart when on the about us page
if (window.location.pathname.includes("About%20us.html")) {
    if (totalQuantityElement) {
        const totalQuantity = idArray.length;
        totalQuantityElement.textContent = totalQuantity;
    } else {
        console.warn("Error: #totalquantity not found in the document.");
    }
}






async function populateItems(id) {
    const item = await searchItemById(id);


    if (!item) {
        console.warn("Item not found. Cannot populate.");
        return;
    }

    const itemDisplay = document.querySelector('.item-display');

    if (!itemDisplay) {
        console.error("Error: .item-display not found in the document.");
        return;
    }

    // Create a new row container for the item
    const itemRow = document.createElement('div');
    itemRow.classList.add('item-row'); // Row container for alignment

    itemRow.innerHTML = `
        <div class="clothes-item1" id="${item.ID}">
            <img src="${item.src}" alt="${item.name}">
        </div>

        <div class="clothes-info">
            <p class="clothes-name">${item.name}</p>
            <p class="clothes-price">$${item.price}</p>
        </div>
    `;

    // Append the new row to the item display container
    itemDisplay.appendChild(itemRow);
    itemDisplay.style.opacity = '1';
}


// Function to search for an item by ID and return its information
async function searchItemById(itemId) {
    const data = await fetchData();

    // Find the item with the specified ID
    const item = data.find(item => item.ID === itemId);

    if (item) {
        return item;
    } else {
        console.log(`Item with ID ${itemId} not found.`);
        return null;
    }
}



if (window.location.pathname.includes("Cart.html")) {

    document.addEventListener('DOMContentLoaded', function() {
        const checkoutButton = document.querySelector('.checkout-button');
        const clearCartButton = document.querySelector('.clear-cart-button');

        if (clearCartButton) {
            clearCartButton.addEventListener('click', clearCart);
        } else {
            console.warn("Error: .clear-cart-button not found in the DOM.");
        }
    
        if (checkoutButton) {
            checkoutButton.addEventListener('click', function(){
                if (idArray && Array.isArray(idArray)) {
                    idArray.forEach(id => {
                        populateInvoice(id);
                    });
                } else {
                    console.log('No items found in the cart.');
                }
            });
        } else {
            console.warn("Error: .checkout-button not found in the DOM.");
        }
    });
}


async function populateInvoice(id) {
    const item = await searchItemById(id);


    if (!item) {
        console.warn("Item not found. Cannot populate.");
        return;
    }

    const invoiceItemsContainer = document.getElementById('invoice-items');
    let subtotal = 0;

    if (!invoiceItemsContainer) {
        console.error("Error: .item-display not found in the document.");
        return;
    }

    // Create a new row container for the item
    let quantity = 1;
    // Check if the table is empty
    if (invoiceItemsContainer.children.length === 0) {
        // Table is empty, add the item with initial quantity 1
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td class="quantity">${quantity}</td>
            <td>$${item.price}</td>
            <td class="total">$${(item.price * quantity).toFixed(2)}</td>
        `;
        subtotal += item.price;
        invoiceItemsContainer.appendChild(row);
    } else {
        // Table is not empty, check if the item already exists
        let itemExists = false;
        const rows = invoiceItemsContainer.querySelectorAll('tr');
        rows.forEach(row => {
            const itemName = row.querySelector('td').textContent;
            if (itemName === item.name) {
                // Item already exists, increment the quantity
                const quantityCell = row.querySelector('.quantity');
                let currentQuantity = parseInt(quantityCell.textContent);
                currentQuantity += 1;
                quantityCell.textContent = currentQuantity;
                const totalCell = row.querySelector('.total');
                totalCell.textContent = `$${(item.price * currentQuantity).toFixed(2)}`;
                itemExists = true;
            }
        });

        if (!itemExists) {
            // Item does not exist, add it to the table with initial quantity 1
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td class="quantity">${quantity}</td>
                <td>$${item.price}</td>
                <td class="total">$${(item.price * quantity).toFixed(2)}</td>
            `;
            invoiceItemsContainer.appendChild(row);
        }
    }
    // Calculate the subtotal by summing up all the totals in the table
    subtotal = Array.from(invoiceItemsContainer.querySelectorAll('.total'))
        .reduce((acc, totalCell) => acc + parseFloat(totalCell.textContent.replace('$', '')), 0);

    // Update the subtotal element
    const subtotalElement = document.getElementById('subtotal');
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;

    // Calculate the tax (10% of the subtotal)
    const tax = subtotal * 0.05;

    // Update the tax element
    const taxElement = document.getElementById('tax');
    taxElement.textContent = `$${tax.toFixed(2)}`;

    // Calculate the total (subtotal + tax)
    const total = subtotal + tax;

    // Update the total element
    const totalElement = document.getElementById('total');
    totalElement.textContent = `$${total.toFixed(2)}`;

    // Update the invoice-date element with the current date and time
    const invoiceDateElement = document.getElementById('invoice-date');
    if (invoiceDateElement) {
        invoiceDateElement.textContent = new Date().toLocaleString();
    } else {
        console.warn("Error: #invoice-date not found in the document.");
    }

    // Generate a random number between 1 and a million for the order-number element
    const orderNumberElement = document.getElementById('order-number');
    if (orderNumberElement) {
        const orderNumber = Math.floor(Math.random() * 1000000) + 1;
        orderNumberElement.textContent = orderNumber;
    } else {
        console.warn("Error: #order-number not found in the document.");
    }
}


function clearCart() {
    localStorage.removeItem("buttonID");
    location.reload();
}




