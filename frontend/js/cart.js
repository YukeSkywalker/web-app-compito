const user = checkAuth("user")

document.getElementById("userName").innerText = user.name
document.getElementById("creditsHeader").innerText = user.credits

function goToShop() {

    window.location.href = "index.html"

}

const cartItems = document.getElementById("cartItems")

function loadCart() {

    const cart = JSON.parse(localStorage.getItem("cart")) || []
    const products = JSON.parse(localStorage.getItem("products_cache")) || []

    cartItems.innerHTML = ""

    cart.forEach(item => {

        const product = products.find(p => p.id === item.productId)

        const row = document.createElement("div")

        row.className = "cart-row"

        row.innerHTML = `
<span>${product.name}</span>

<span>

<button onclick="decrease(${product.id})">-</button>

${item.quantity}

<button onclick="increase(${product.id})">+</button>

</span>

<span>${product.price * item.quantity}</span>
`

        cartItems.appendChild(row)

        const hr = document.createElement("hr")

        cartItems.appendChild(hr)

    })

}

function increase(productId) {

    let cart = JSON.parse(localStorage.getItem("cart")) || []

    const item = cart.find(p => p.productId === productId)

    if (item) {

        item.quantity++

    }

    localStorage.setItem("cart", JSON.stringify(cart))

    loadCart()

}

function decrease(productId) {

    let cart = JSON.parse(localStorage.getItem("cart")) || []

    const item = cart.find(p => p.productId === productId)

    if (!item) return

    item.quantity--

    if (item.quantity <= 0) {

        cart = cart.filter(p => p.productId !== productId)

    }

    localStorage.setItem("cart", JSON.stringify(cart))

    loadCart()

}

async function checkout() {

    let cart = JSON.parse(localStorage.getItem("cart")) || []

    if (cart.length === 0) {
        alert("Carrello vuoto")
        return
    }

    try {

        const res = await fetch(API_BASE_URL + "/api/order", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                userId: user.id,
                cart
            })

        })

        const data = await res.json()

        if (!res.ok) {

            document.getElementById("orderMessage").innerText = data.error
            return

        }

        localStorage.removeItem("cart")

        user.credits = data.credits

        localStorage.setItem("user", JSON.stringify(user))

        document.getElementById("orderMessage").innerText =
            "Grazie per il tuo ordine!"

        setTimeout(() => {

            window.location.href = "index.html"

        }, 2000)

    } catch {

        alert("Errore server")

    }

}

loadCart()