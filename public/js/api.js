var  base_url = "https://api.football-data.org/v2/";
base_url = base_url.replace(/^http:\/\//i, 'https://');
const liga_id = 2021; // English league
const token = "be99312ab76142bea217fe457752a3c8"

const fetchDataProps = {
    method: 'GET',
    headers: {
        'X-Auth-Token': token
    }
};

var fetchApi = url => {
    return fetch(url, {
        headers: {
            'X-Auth-Token': token
        }
    });
};

function status(response){
    if (response.status !== 200){
        return Promise.reject(new Error(response.statusText));
    } else {
        return Promise.resolve(response);
    }
}

function json(response){
    return response.json();
}

function error(error){
    console.log(error);
}

function showKlasemen(data){
    var fixtureLeague;
    const tbody = document.querySelector('tbody');
    data.standings[0].table.forEach(table => {
        fixtureLeague += `
            <tr>
                <td>${table.position}</td>
                <td><a href="./team.html?id=${table.team.id}" class="">
                    <img src="${table.team.crestUrl.replace(/^http:\/\//i, 'https://')}" class="responsive-img kecil" alt="">
                    <br> ${table.team.name}
                    </a> 
                </td>
                <td>${table.playedGames}</td><td>${table.won}</td><td>${table.draw}</td><td>${table.lost}</td><td>${table.goalsFor}</td><td>${table.goalsAgainst}</td><td>${table.goalDifference}</td><td>${table.points}</td>
            </tr>
        `
    });
    tbody.innerHTML = fixtureLeague;
}

function getKlasemen() {
    if ('caches' in window) {
        caches.match(base_url + "competitions/"+liga_id+"/standings").then(response => {
            if (response){
                response.json().then(data=>{
                    showKlasemen(data)
                })
            }
        })
    }

    fetchApi(base_url + "competitions/"+liga_id+"/standings")
        .then(status)
        .then(json)
        .then(data => {
            // console.log(data.standings)
            showKlasemen(data);
        })
        .catch(error)
}

function showDetailteam(data) {
    const tbody = document.querySelector("tbody#teamSquadList");
    const teamInf = document.querySelector("#teamInf");

    isFav(parseInt(data.id)).then(res => {
        if (!res) {
                teamInf.innerHTML = `
                <img src="${data.crestUrl.replace(/^http:\/\//i, 'https://')}" class="responsive-img">    
                <h4>${data.name}</h4>
                <a href="${data.website}">${data.website}</a>
                <h4 class="flow-text">List Squad : </h4>
            `;
        } else {
            teamInf.innerHTML = `
                <img src="${data.crestUrl.replace(/^http:\/\//i, 'https://')}" class="responsive-img">    
                <h4>${data.name}</h4>
                <a id="deleteFromFav" class="waves-effect waves-light btn">Remove From Favorite</a><br>
                <a href="${data.website}">${data.website}</a>
                <h4 class="flow-text">List Squad : </h4>
            `;
            document.getElementById("add").style.display = 'none';
            document.getElementById("deleteFromFav").onclick = () => {
                deleteFromFav(data.id);
            }
        }
        var squalList;
        data.squad.forEach(data => {
            squalList += `
            <tr>
                <td>${data.name}</td>
                <td>${data.position}</td>
                <td>${data.nationality}</td>
            </tr>
        `
        });
        tbody.innerHTML = squalList;
        Promise.resolve(data);
    });

}

function deleteFromFav(id){
    return new Promise(function(resolve, reject) {
        dbPromised
            .then(function(db) {
                var tx = db.transaction("teams", "readwrite");
                var store = tx.objectStore("teams");
                return store.delete(parseInt(id));
            })
            .then(function(id) {
                if (id == undefined){
                    M.toast({html: "Berhasil menghapus data"})
                    var url = new URLSearchParams(window.location.search)
                    var isfav = url.get("fav");
                    if (!isfav){
                        location.reload();
                    }else {
                        location.href = "./index.html"
                    }

                    resolve(id);
                }else{
                    M.toast({html: "Terjadi kesalahan menghapus data"})
                }
            })
    });
}

function isFav(id){
    var promise = new Promise(resolve => {
        getById(id).then(data => {
            if (data === undefined){
                resolve(false);
            }else{
                resolve(true);
            }
        })
    })
    return promise;
}

function getDetailTeam(){
    return new Promise(function(resolve, reject) {
        var urlParams = new URLSearchParams(window.location.search);
        var idTeam = urlParams.get("id");
        if ('caches' in window) {
            caches.match(base_url + "teams/" + idTeam).then(response => {
                if (response) {
                    response.json().then(data => {
                        showDetailteam(data);
                        resolve(data);
                    })
                }
            })
        }

        fetchApi(base_url + "teams/" + idTeam)
            .then(status)
            .then(json)
            .then(data => {
                showDetailteam(data);
                resolve(data);
            })
            .catch(error);
    })
}

function getById(id) {
    return new Promise(function(resolve, reject) {
        dbPromised
            .then(function(db) {
                var tx = db.transaction("teams", "readonly");
                var store = tx.objectStore("teams");
                return store.get(parseInt(id));
            })
            .then(function(article) {
                resolve(article);
            });
    });
}

function getSavedTeamById(){
    var urlParams = new URLSearchParams(window.location.search);
    var idParam = urlParams.get("id");

    getById(idParam).then(function(data) {
        showDetailteam(data.value)
    });
}

function getSavedTeam(){
    getAll().then(teams => {
        var teamHtml = "";
        teams.forEach(team => {
            teamHtml += `
                <div class="card">
                    <a href="./team.html?id=${team.value.id}&fav=true">
                      <div class="center-align card-image waves-effect waves-block waves-light">
                        <img src="${team.value.crestUrl.replace(/^http:\/\//i, 'https://')}" class=" responsive-img" style="width: 200px; margin: auto" />
                        <h4 class="center-align flow-text">${team.value.name}</h4>
                      </div>
                    </a>  
                </div>
            `;
        });
        if(teamHtml === "") document.getElementById("teams").innerHTML = "<h4 class='center-align flow-text'>Tidak ada data yang disimpan</h4>"
        else document.getElementById("teams").innerHTML = teamHtml;
    })
}
