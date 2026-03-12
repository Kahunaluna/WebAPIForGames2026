async function loadScores() {
    const status = document.getElementById("status");
    try {
        const res   = await fetch("/api/highscores");
        const data  = await res.json();

        if (!data.length) {
            status.textContent = "No scores yet!";
            return;
        }

        status.style.display = "none";
        const table = document.getElementById("scoreTable");
        const tbody = document.getElementById("scoreBody");
        table.style.display = "table";

        data.forEach((entry, i) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${i + 1}</td>
                <td>${entry.player}</td>
                <td>${entry.score}</td>
                <td>${entry.wins}</td>
                <td>${entry.losses}</td>
                <td>${entry.gamesPlayed}</td>
                <td>${entry.game}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (err) {
        status.textContent = "Failed to load scores.";
        console.error(err);
    }
}

loadScores();