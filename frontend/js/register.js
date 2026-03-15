const form = document.getElementById("registerForm")
const message = document.getElementById("message")

const passwordInput = document.getElementById("password")
const togglePassword = document.getElementById("togglePassword")

/* ------------------------
VALIDAZIONE PASSWORD
------------------------- */

function validatePassword(password) {

    if (password.length < 8) {
        return "La password deve avere almeno 8 caratteri"
    }

    if (!/[A-Z]/.test(password)) {
        return "La password deve contenere una lettera maiuscola"
    }

    if (!/[0-9]/.test(password)) {
        return "La password deve contenere un numero"
    }

    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password)) {
        return "La password deve contenere un simbolo"
    }

    return null

}

/* ------------------------
CONTROLLO PASSWORD LIVE
------------------------- */

passwordInput.addEventListener("input", () => {

    const error = validatePassword(passwordInput.value)

    if (error) {
        message.style.color = "#ef4444"
        message.innerText = error
        passwordInput.style.borderColor = "#ef4444"
    } else {
        message.innerText = ""
        passwordInput.style.borderColor = "#16a34a"
    }

})

/* ------------------------
MOSTRA / NASCONDI PASSWORD
------------------------- */

togglePassword.addEventListener("click", () => {

    const type = passwordInput.type === "password"
        ? "text"
        : "password"

    passwordInput.type = type

    togglePassword.textContent = type === "password"
        ? "👁"
        : "🙈"

})

/* ------------------------
REGISTRAZIONE
------------------------- */

form.addEventListener("submit", async (e) => {

    e.preventDefault()

    message.innerText = ""

    const name = document.getElementById("name").value
    const email = document.getElementById("email").value
    const password = passwordInput.value

    const passwordError = validatePassword(password)

    if (passwordError) {
        message.style.color = "#ef4444"
        message.innerText = passwordError
        return
    }

    try {

        const response = await fetch(API_BASE_URL + "/api/auth/register", {

            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password
            })

        })

        const data = await response.json()

        if (!response.ok) {

            message.style.color = "#ef4444"
            message.innerText = data.error

            return
        }

        /* SALVA UTENTE (LOGIN AUTOMATICO) */

        localStorage.setItem("user", JSON.stringify(data.user))

        message.style.color = "#16a34a"
        message.innerText = "Registrazione completata"

        /* REDIRECT IN BASE AL RUOLO */

        setTimeout(() => {

            if (data.user.role === "admin") {
                window.location.href = "admin.html"
            } else {
                window.location.href = "index.html"
            }

        }, 1000)

    } catch (error) {

        message.style.color = "#ef4444"
        message.innerText = "Errore di connessione al server"

    }

})