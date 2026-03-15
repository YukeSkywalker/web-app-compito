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

app.post("/api/auth/register", async (req,res)=>{

const {name,email,password} = req.body

if(!name || !email || !password){
return res.status(400).json({error:"Campi mancanti"})
}

const {data:existing} = await supabase
.from("users")
.select("*")
.eq("email",email)

if(existing.length > 0){
return res.status(400).json({error:"Email già registrata"})
}

const newUser = {

id:Date.now(),
name,
email,
password,
role:"user",
credits:100

}

const {error} = await supabase
.from("users")
.insert([newUser])

if(error){
return res.status(500).json({error:error.message})
}

res.json({user:newUser})

})

/* =========================
LOGIN
========================= */

app.post("/api/auth/login", async (req,res)=>{

const {email,password} = req.body

const {data,error} = await supabase
.from("users")
.select("*")
.eq("email",email)
.eq("password",password)

if(error || !data || data.length === 0){
return res.status(401).json({error:"Credenziali non valide"})
}

res.json({user:data[0]})

})

/* =========================
GET PRODUCTS
========================= */

app.get("/api/products", async (req,res)=>{

const {data,error} = await supabase
.from("products")
.select("*")

if(error){
return res.status(500).json({error:error.message})
}

res.json(data)

})

/* =========================
ADD PRODUCT (ADMIN)
========================= */

app.post("/api/products", async (req,res)=>{

const {name,price,stock} = req.body

const product = {

id:Date.now(),
name,
price:Number(price),
stock:Number(stock)

}

const {error} = await supabase
.from("products")
.insert([product])

if(error){
return res.status(500).json({error:error.message})
}

res.json(product)

})

/* =========================
UPDATE PRODUCT
========================= */

app.put("/api/products/:id", async (req,res)=>{

const {name,price,stock} = req.body

const {error} = await supabase
.from("products")
.update({

name,
price:Number(price),
stock:Number(stock)

})
.eq("id",req.params.id)

if(error){
return res.status(500).json({error:error.message})
}

res.json({message:"Prodotto aggiornato"})

})

/* =========================
DELETE PRODUCT
========================= */

app.delete("/api/products/:id", async (req,res)=>{

const {error} = await supabase
.from("products")
.delete()
.eq("id",req.params.id)

if(error){
return res.status(500).json({error:error.message})
}

res.json({message:"Prodotto eliminato"})

})

/* =========================
GET USERS
========================= */

app.get("/api/users", async (req,res)=>{

const {data,error} = await supabase
.from("users")
.select("*")

if(error){
return res.status(500).json({error:error.message})
}

res.json(data)

})

/* =========================
UPDATE USER CREDITS
========================= */

app.put("/api/users/:id/credits", async (req,res)=>{

const {credits} = req.body

const {error} = await supabase
.from("users")
.update({
credits:Number(credits)
})
.eq("id",req.params.id)

if(error){
return res.status(500).json({error:error.message})
}

res.json({message:"Crediti aggiornati"})

})

/* =========================
ORDINE CARRELLO
========================= */

app.post("/api/order", async (req,res)=>{

const {userId,cart} = req.body

const {data:user} = await supabase
.from("users")
.select("*")
.eq("id",userId)
.single()

if(!user){
return res.status(404).json({error:"Utente non trovato"})
}

let total = 0
let purchased = []

for(let item of cart){

const {data:product} = await supabase
.from("products")
.select("*")
.eq("id",item.productId)
.single()

if(product.stock < item.quantity){
return res.status(400).json({error:"Stock insufficiente"})
}

total += product.price * item.quantity

purchased.push({

name:product.name,
quantity:item.quantity,
price:product.price

})

await supabase
.from("products")
.update({
stock:product.stock - item.quantity
})
.eq("id",product.id)

}

if(user.credits < total){
return res.status(400).json({error:"Crediti insufficienti"})
}

await supabase
.from("users")
.update({
credits:user.credits - total
})
.eq("id",user.id)

await supabase
.from("orders")
.insert([{

id:Date.now(),
userid:user.id,
username:user.name,
email:user.email,
items:purchased,
total,
date:new Date()

}])

res.json({
message:"Ordine completato"
})

})

/* =========================
GET ORDERS
========================= */

app.get("/api/orders", async (req,res)=>{

const {data,error} = await supabase
.from("orders")
.select("*")

if(error){
return res.status(500).json({error:error.message})
}

res.json(data)

})

/* =========================
SERVER
========================= */

app.listen(PORT,()=>{

console.log("Server avviato su http://localhost:"+PORT)

})