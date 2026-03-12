document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const msg  = document.getElementById("msg");
    const body = {
        email:    document.getElementById("email").value,
        password: document.getElementById("password").value
    };

    const res  = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });
    const data = await res.json();

    if (data.ok) {
        localStorage.setItem("token",    data.token);
        localStorage.setItem("username", data.username);
        msg.style.color    = "green";
        msg.textContent    = `✅ Welcome, ${data.username}! Redirecting...`;
        setTimeout(() => window.location.href = "/", 1200);
    } else {
        msg.style.color = "red";
        msg.textContent = "❌ " + data.error;
    }
});