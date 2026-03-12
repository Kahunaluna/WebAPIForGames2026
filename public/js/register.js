document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const msg  = document.getElementById("msg");
    const body = {
        username: document.getElementById("username").value,
        email:    document.getElementById("email").value,
        password: document.getElementById("password").value
    };

    const res  = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });
    const data = await res.json();

    if (data.ok) {
        msg.style.color = "green";
        msg.textContent = "✅ Registered! Redirecting to login...";
        setTimeout(() => window.location.href = "/login", 1200);
    } else {
        msg.style.color = "red";
        msg.textContent = "❌ " + data.error;
    }
});