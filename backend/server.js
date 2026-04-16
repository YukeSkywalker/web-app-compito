const express = require("express")
const cors = require("cors")
const supabase = require("./supabase")

const app = express()

app.use(cors())
app.use(express.json())

const PORT = 3000

/* =========================
REGISTER
========================= */
app.post("/api/auth/register", async (req, res) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
        return res.status(400).json({ error: "Campi mancanti" })
    }

    const { data: existing, error: existingError } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)

    if (existingError) {
        return res.status(500).json({ error: existingError.message })
    }

    if (existing && existing.length > 0) {
        return res.status(400).json({ error: "Email già registrata" })
    }

    const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        role: "user",
        credits: 100
    }

    const { error } = await supabase
        .from("users")
        .insert([newUser])

    if (error) {
        return res.status(500).json({ error: error.message })
    }

    res.json({ user: newUser })
})

/* =========================
LOGIN
========================= */
app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body

    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .eq("password", password)

    if (error) {
        return res.status(500).json({ error: error.message })
    }

    if (!data || data.length === 0) {
        return res.status(401).json({ error: "Credenziali non valide" })
    }

    res.json({ user: data[0] })
})

/* =========================
GET PRODUCTS
========================= */
app.get("/api/products", async (req, res) => {
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: true })

    if (error) {
        return res.status(500).json({ error: error.message })
    }

    res.json(data)
})

/* =========================
ADD PRODUCT
========================= */
app.post("/api/products", async (req, res) => {
    const { name, price, stock } = req.body

    if (!name || price === undefined || stock === undefined) {
        return res.status(400).json({ error: "Campi mancanti" })
    }

    const product = {
        id: Date.now(),
        name,
        price: Number(price),
        stock: Number(stock)
    }

    const { error } = await supabase
        .from("products")
        .insert([product])

    if (error) {
        return res.status(500).json({ error: error.message })
    }

    res.json(product)
})

/* =========================
UPDATE PRODUCT
========================= */
app.put("/api/products/:id", async (req, res) => {
    const { name, price, stock } = req.body

    const { error } = await supabase
        .from("products")
        .update({
            name,
            price: Number(price),
            stock: Number(stock)
        })
        .eq("id", req.params.id)

    if (error) {
        return res.status(500).json({ error: error.message })
    }

    res.json({ message: "Prodotto aggiornato" })
})

/* =========================
DELETE PRODUCT
========================= */
app.delete("/api/products/:id", async (req, res) => {
    const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", req.params.id)

    if (error) {
        return res.status(500).json({ error: error.message })
    }

    res.json({ message: "Prodotto eliminato" })
})

/* =========================
GET USERS
========================= */
app.get("/api/users", async (req, res) => {
    const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("id", { ascending: true })

    if (error) {
        return res.status(500).json({ error: error.message })
    }

    res.json(data)
})

/* =========================
GET USER BY ID
========================= */
app.get("/api/users/:id", async (req, res) => {
    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", req.params.id)
        .single()

    if (error || !data) {
        return res.status(404).json({ error: "Utente non trovato" })
    }

    res.json(data)
})

/* =========================
UPDATE USER CREDITS
========================= */
app.put("/api/users/:id/credits", async (req, res) => {
    const { credits } = req.body

    const { data, error } = await supabase
        .from("users")
        .update({
            credits: Number(credits)
        })
        .eq("id", req.params.id)
        .select()
        .single()

    if (error) {
        return res.status(500).json({ error: error.message })
    }

    res.json(data)
})

/* =========================
APPLY COUPON
========================= */
app.post("/api/users/:id/coupon", async (req,res)=>{

const { code } = req.body

if(code !== "price2x"){
return res.status(400).json({error:"Codice non valido"})
}

const { data:user } = await supabase
.from("users")
.select("*")
.eq("id", req.params.id)
.single()

if(!user){
return res.status(404).json({error:"Utente non trovato"})
}

if(user.price2x_used){
return res.status(400).json({error:"Buono già utilizzato"})
}

const { data:updatedUser } = await supabase
.from("users")
.update({
credits: user.credits + 200,
price2x_used: true
})
.eq("id", user.id)
.select()
.single()

res.json({
user: updatedUser
})

})

/* =========================
ORDER
========================= */
app.post("/api/order", async (req, res) => {
    const { userId, cart } = req.body

    if (!Array.isArray(cart) || cart.length === 0) {
        return res.status(400).json({ error: "Carrello vuoto" })
    }

    const { data: user, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single()

    if (userError || !user) {
        return res.status(404).json({ error: "Utente non trovato" })
    }

    let total = 50
    const purchasedItems = []

    for (const item of cart) {
        const { data: product, error: productError } = await supabase
            .from("products")
            .select("*")
            .eq("id", item.productId)
            .single()

        if (productError || !product) {
            return res.status(404).json({ error: "Prodotto non trovato" })
        }

        if (product.stock < item.quantity) {
            return res.status(400).json({ error: `Stock insufficiente per ${product.name}` })
        }

        total += Number(product.price) * Number(item.quantity)
        

        purchasedItems.push({
            productId: product.id,
            name: product.name,
            quantity: Number(item.quantity),
            price: Number(product.price)
        })
    }

    if (Number(user.credits) < total) {
        return res.status(400).json({ error: "Crediti insufficienti" })
    }

    for (const item of cart) {
        const { data: product } = await supabase
            .from("products")
            .select("*")
            .eq("id", item.productId)
            .single()

        await supabase
            .from("products")
            .update({
                stock: Number(product.stock) - Number(item.quantity)
            })
            .eq("id", item.productId)
    }

    const newCredits = Number(user.credits) - total

    const { error: creditsError } = await supabase
        .from("users")
        .update({
            credits: newCredits
        })
        .eq("id", user.id)

    if (creditsError) {
        return res.status(500).json({ error: creditsError.message })
    }

    const order = {
        id: Date.now(),
        userid: user.id,
        username: user.name,
        email: user.email,
        items: purchasedItems,
        total,
        date: new Date().toISOString()
    }

    const { error: orderError } = await supabase
        .from("orders")
        .insert([order])

    if (orderError) {
        return res.status(500).json({ error: orderError.message })
    }

    res.json({
        message: "Ordine completato",
        credits: newCredits,
        order
    })
})

/* =========================
GET ORDERS
========================= */
app.get("/api/orders", async (req, res) => {
    const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("date", { ascending: false })

    if (error) {
        return res.status(500).json({ error: error.message })
    }

    res.json(data)
})

/* =========================
SERVER
========================= */
app.listen(PORT, () => {
    console.log("Server avviato su http://localhost:" + PORT)
})
