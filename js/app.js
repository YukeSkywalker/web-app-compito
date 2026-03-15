const user = checkAuth("user")

document.getElementById("userName").innerText = user.name
document.getElementById("creditsHeader").innerText = user.credits || 0

function goToCart() {
    window.location.href = "cart.html"
}

async function refreshUserCredits() {
    const res = await fetch(API_BASE_URL + "/api/users/" + user.id)
    const freshUser = await res.json()

    user.credits = freshUser.credits
    localStorage.setItem("user", JSON.stringify(user))
    document.getElementById("creditsHeader").innerText = freshUser.credits
}

async function loadProducts() {
    const res = await fetch(API_BASE_URL + "/api/products")
    const products = await res.json()

    localStorage.setItem("products_cache", JSON.stringify(products))

    const cart = JSON.parse(localStorage.getItem("cart")) || []
    const container = document.getElementById("products")

    container.innerHTML = ""

    products.forEach(product => {
        const itemInCart = cart.find(p => p.productId === product.id)
        const quantityInCart = itemInCart ? itemInCart.quantity : 0

        const card = document.createElement("div")
        card.className = "product-card"

        card.innerHTML = `
            <h3>${product.name}</h3>

            <div class="product-desc">Prezzo: ${product.price} crediti</div>
            <div class="product-desc">Quantità disponibile: ${product.stock}</div>
            <div class="product-desc">Nel carrello: ${quantityInCart}</div>

            <button class="product-btn" onclick="addToCart(${product.id})">
                Aggiungi
            </button>

            ${quantityInCart > 0 ? `
                <button class="product-btn remove-btn" onclick="removeFromCart(${product.id})">
                    Rimuovi
                </button>
            ` : ""}
        `

        container.appendChild(card)
    })
}

function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || []
    const products = JSON.parse(localStorage.getItem("products_cache")) || []

    const product = products.find(p => p.id === productId)
    const item = cart.find(p => p.productId === productId)
    const quantity = item ? item.quantity : 0

    if (!product) return

    if (quantity >= product.stock) {
        alert("Stock massimo raggiunto")
        return
    }

    if (item) {
        item.quantity++
    } else {
        cart.push({
            productId,
            quantity: 1
        })
    }

    localStorage.setItem("cart", JSON.stringify(cart))
    loadProducts()
}

function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || []

    const item = cart.find(p => p.productId === productId)

    if (!item) return

    item.quantity--

    if (item.quantity <= 0) {
        cart = cart.filter(p => p.productId !== productId)
    }

    localStorage.setItem("cart", JSON.stringify(cart))
    loadProducts()
}

refreshUserCredits()
loadProducts()
