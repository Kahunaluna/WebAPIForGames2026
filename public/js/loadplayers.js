async function loadPlayers() {
    const status = document.getElementById("status");
    const list   = document.getElementById("playerList");

    try {
        const res    = await fetch("/api/highscores");
        const players = await res.json();

        if (!players.length) {
            status.textContent = "No players found.";
            return;
        }
        status.style.display = "none";

        players.forEach(p => {
            const card = document.createElement("div");
            card.className = "player-card";
            card.innerHTML = `
                <div class="player-info">
                    <strong>${p.player}</strong>
                    <span>Score: ${p.score} | Wins: ${p.wins} | Losses: ${p.losses} | Games: ${p.gamesPlayed}</span>
                </div>
                <div class="player-actions">
                    <button class="btn"          onclick="openEdit('${p._id}','${p.player}',${p.score},${p.wins},${p.losses},${p.gamesPlayed})">Edit</button>
                    <button class="btn btn-danger" onclick="deletePlayer('${p._id}', this)">Delete</button>
                </div>
            `;
            list.appendChild(card);
        });
    } catch (err) {
        status.textContent = "Failed to load players.";
        console.error(err);
    }
}

function openEdit(id, player, score, wins, losses, gamesPlayed) {
    document.getElementById("editId").value          = id;
    document.getElementById("editPlayer").value      = player;
    document.getElementById("editScore").value       = score;
    document.getElementById("editWins").value        = wins;
    document.getElementById("editLosses").value      = losses;
    document.getElementById("editGamesPlayed").value = gamesPlayed;
    document.getElementById("editMsg").textContent   = "";
    document.getElementById("modal").style.display   = "flex";
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}

async function saveEdit() {
    const id   = document.getElementById("editId").value;
    const body = {
        player:      document.getElementById("editPlayer").value,
        score:       Number(document.getElementById("editScore").value),
        wins:        Number(document.getElementById("editWins").value),
        losses:      Number(document.getElementById("editLosses").value),
        gamesPlayed: Number(document.getElementById("editGamesPlayed").value)
    };

    const res  = await fetch(`/api/highscores/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });
    const data = await res.json();

    if (data.ok) {
        closeModal();
        document.getElementById("playerList").innerHTML = "";
        document.getElementById("status").style.display = "block";
        document.getElementById("status").textContent   = "Loading players...";
        loadPlayers();
    } else {
        document.getElementById("editMsg").textContent = "❌ " + data.error;
    }
}

async function deletePlayer(id, btn) {
    if (!confirm("Are you sure you want to delete this player?")) return;
    const res  = await fetch(`/api/highscores/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.ok) {
        btn.closest(".player-card").remove();
    } else {
        alert("Error: " + data.error);
    }
}

loadPlayers();