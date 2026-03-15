function redeemCoupon() {

    const code = prompt("Inserisci codice coupon")

    if (!code) return

    if (code !== "price2x") {
        alert("Codice non valido")
        return
    }

    const used = localStorage.getItem("coupon_used")

    if (used) {
        alert("Buono già utilizzato")
        return
    }

    let user = JSON.parse(localStorage.getItem("user"))

    user.credits += 200

    localStorage.setItem("user", JSON.stringify(user))
    localStorage.setItem("coupon_used", true)

    alert("Hai ricevuto 200 crediti!")

    location.reload()

}