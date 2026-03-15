const form = document.getElementById("loginForm")
const message = document.getElementById("message")

const togglePassword = document.getElementById("togglePassword")
const passwordInput = document.getElementById("password")

/* MOSTRA / NASCONDI PASSWORD */

togglePassword.addEventListener("click", () => {

    const type = passwordInput.type === "password"
        ? "text"
        : "password"

    passwordInput.type = type

    togglePassword.textContent = type === "password"
        ? "👁"
        : "🙈"

})

/* LOGIN */

form.addEventListener("submit", async (e) => {

    e.preventDefault()

    const email = document.getElementById("email").value
    const password = passwordInput.value

    try {

        const response = await fetch(API_BASE_URL + "/api/auth/login", {

            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })

        })

        const data = await response.json()

        if (!response.ok) {
            message.innerText = data.error
            return
        }

        /* SALVA UTENTE */

        localStorage.setItem("user", JSON.stringify(data.user))

        /* REDIRECT PER RUOLO */

        if (data.user.role === "admin") {
            window.location.href = "admin.html"
        } else {
            window.location.href = "index.html"
        }

    } catch (error) {

        message.innerText = "Errore di connessione"

    }

})