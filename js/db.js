var dbPromised = idb.open("ligaprimer", 1, function(upgradeDb) {
    var articlesObjectStore = upgradeDb.createObjectStore("teams", {
        keyPath: "ID"
    });
    articlesObjectStore.createIndex("team_name", "team_name", { unique: false });
});

function addToFav(team) {
    dbPromised
        .then(function(db) {
            var tx = db.transaction("teams", "readwrite");
            var store = tx.objectStore("teams");
            // console.log(team);
            store.add({ID: team.id, value: team})
            return tx.complete;
        })
        .then(function() {
            // console.log("Artikel berhasil di simpan.");
            location.reload();
        });
}

function getAll(){
    return new Promise(function(resolve, reject) {
        dbPromised
            .then(function(db) {
                var tx = db.transaction("teams", "readonly");
                var store = tx.objectStore("teams");
                return store.getAll();
            })
            .then(function(articles) {
                resolve(articles);
            });
    });
}