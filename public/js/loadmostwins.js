async function loadMostWins() {
    const status = document.getElementById("status");
    try {
        const res   = await fetch("/api/highscores/top-wins");
        const data  = await res.json();

        if (!data.length) {
            status.textContent = "No players yet!";
            return;
        }

        status.style.display = "none";
        const table = document.getElementById("winsTable");
        const tbody = document.getElementById("winsBody");
        table.style.display = "table";

        data.forEach((entry, i) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${i + 1}</td>
                <td>${entry.player}</td>
                <td>${entry.wins}</td>
                <td>${entry.losses}</td>
                <td>${entry.gamesPlayed}</td>
                <td>${entry.score}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (err) {
        status.textContent = "Failed to load top wins.";
        console.error(err);
    }
}

loadMostWins();
