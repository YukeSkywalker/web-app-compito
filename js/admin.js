const admin = checkAuth("admin")

document.getElementById("adminName").innerText = admin.name

const message = document.getElementById("message")

/* =====================
PRODOTTI
===================== */

async function loadProducts() {

    const res = await fetch(API_BASE_URL + "/api/products")

    const products = await res.json()

    const container = document.getElementById("products")

    container.innerHTML = ""

    products.forEach(p => {

        const row = document.createElement("div")

        row.className = "admin-row"

        row.innerHTML = `

<input value="${p.name}" id="name-${p.id}">
<input value="${p.price}" id="price-${p.id}">
<input value="${p.stock}" id="stock-${p.id}">

<button onclick="updateProduct(${p.id})">Salva</button>

<button onclick="deleteProduct(${p.id})">
Elimina
</button>

`

        container.appendChild(row)

    })

}

/* AGGIUNGI PRODOTTO */

async function addProduct() {

    const name = document.getElementById("name").value
    const price = document.getElementById("price").value
    const stock = document.getElementById("stock").value

    const res = await fetch(API_BASE_URL + "/api/products", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({ name, price, stock })

    })

    const data = await res.json()

    if (!res.ok) {

        message.innerText = data.error
        return

    }

    message.innerText = "Prodotto aggiunto"

    loadProducts()

}

/* MODIFICA PRODOTTO */

async function updateProduct(id) {

    const name = document.getElementById("name-" + id).value
    const price = document.getElementById("price-" + id).value
    const stock = document.getElementById("stock-" + id).value

    await fetch(API_BASE_URL + "/api/products/" + id, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({ name, price, stock })

    })

    loadProducts()

}

/* ELIMINA */

async function deleteProduct(id) {

    await fetch(API_BASE_URL + "/api/products/" + id, {
        method: "DELETE"
    })

    loadProducts()

}

/* =====================
UTENTI
===================== */

function openUsers() {

    document.getElementById("usersSection").style.display = "block"
    document.getElementById("ordersSection").style.display = "none"

    loadUsers()

}

async function loadUsers() {

    const res = await fetch(API_BASE_URL + "/api/users")

    const users = await res.json()

    const container = document.getElementById("users")

    container.innerHTML = ""

    users.forEach(u => {

        const row = document.createElement("div")

        row.className = "admin-row"

        row.innerHTML = `

<span>${u.name} (${u.email})</span>

<input type="number"
value="${u.credits}"
id="credits-${u.id}">

<button onclick="updateCredits(${u.id})">
Salva
</button>

`

        container.appendChild(row)

    })

}

/* MODIFICA CREDITI */

async function updateCredits(id) {

    const credits = document.getElementById("credits-" + id).value

    await fetch(API_BASE_URL + "/api/users/" + id + "/credits", {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({ credits })

    })

}

/* =====================
ORDINI
===================== */

function openOrders() {

    document.getElementById("ordersSection").style.display = "block"
    document.getElementById("usersSection").style.display = "none"

    loadOrders()

}

async function loadOrders() {
    const res = await fetch(API_BASE_URL + "/api/orders")
    const orders = await res.json()

    const container = document.getElementById("orders")
    container.innerHTML = ""

    orders.slice(0, 4).forEach(o => {
        let productsList = ""

        if (Array.isArray(o.items)) {
            o.items.forEach(item => {
                productsList += `${item.name} x${item.quantity}<br>`
            })
        }

        const row = document.createElement("div")
        row.className = "admin-row"

        row.innerHTML = `
            <span>${o.username || o.user || o.email}</span>
            <span>${productsList}</span>
            <span>${o.total} crediti</span>
        `

        container.appendChild(row)
    })
}

loadProducts()

function goToShop() {

    window.location.href = "index.html"

}
