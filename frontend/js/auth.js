function checkAuth(requiredRole) {

    const user = JSON.parse(localStorage.getItem("user"))

    if (!user) {
        window.location.href = "login.html"
        return
    }

    if (requiredRole && user.role !== requiredRole) {
        window.location.href = "login.html"
        return
    }

    return user
}

function logout() {

    localStorage.removeItem("user")
    window.location.href = "login.html"

}