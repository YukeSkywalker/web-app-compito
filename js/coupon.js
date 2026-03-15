async function redeemCoupon() {
    const code = prompt("Inserisci codice coupon")

    if (!code) return

    const currentUser = JSON.parse(localStorage.getItem("user"))

    try {
        const res = await fetch(API_BASE_URL + "/api/users/" + currentUser.id + "/coupon", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ code })
        })

        const data = await res.json()

        if (!res.ok) {
            alert(data.error)
            return
        }

        localStorage.setItem("user", JSON.stringify(data.user))

        alert("Hai ricevuto 200 crediti!")

        location.reload()
    } catch (error) {
        alert("Errore server")
    }
}
