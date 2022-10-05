//REGISTER SERVICE _WORKER
if ("serviceWorker" in navigator){
    window.addEventListener("load", function () {
        navigator.serviceWorker
            .register("/service-worker.js")
            .then(function() {
                // console.log("serviceWorker berhasil");
            })
            .catch(function(){
                // console.log("ServiceWorker gagal");
            })
    });
}else{
    console.log("serviceWorker belum berjalan di browser ini");
}

var page = window.location;
if(page.pathname == "/team.html") {
    document.addEventListener("DOMContentLoaded", function () {
        var urlParams = new URLSearchParams(window.location.search);
        var isFromsaved = urlParams.get("fav")
        var save = document.getElementById("add");
        if (isFromsaved) {
            save.style.display = 'none';
            getSavedTeamById()
        } else {
            var item = getDetailTeam()
        }

        save.onclick = () => {
            // console.log("Tombol add diklik");
            item.then(function (team) {
                addToFav(team)
            })
        }
    })
}