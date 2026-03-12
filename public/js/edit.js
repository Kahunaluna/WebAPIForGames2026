const form = document.getElementById("editForm");
const cancelBtn = document.getElementById("cancelBtn");

const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const token = localStorage.getItem("token");

if(!token){
    window.location.href = "/login.html";
}

async function loadScore(){
    const res = await fetch(`/api/highscores/${encodeURIComponent(id)}`, {headers:{"Authorization":"Bearer " + token}});
    if(res.status === 401){
            localStorage.removeItem("token");
            window.location.href = "/login.html";
            return;
        }

    const score = await res.json();

    document.getElementById("playername").value = score.player ?? "";
    document.getElementById("score").value = score.score ?? 0;
    document.getElementById("level").value = score.game ?? "";
}

form.addEventListener("submit", async (e)=>{
    e.preventDefault();

    const player = document.getElementById("playername").value.trim();
    const score = Number(document.getElementById("score").value);
    const game = document.getElementById("level").value.trim();

    const res = await fetch(`/api/highscores/${encodeURIComponent(id)}`,{
        method: "PUT",
        headers:{"Content-Type":"application/json", "Authorization":"Bearer " + token},
        body:JSON.stringify({player, score, game}),
    });
    
    window.location.href = "/highscores.html";    
});

cancelBtn.addEventListener("click", ()=>{
    window.location.href = "/highscores.html";
});

loadScore();