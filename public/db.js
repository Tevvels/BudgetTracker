
let db;
const rqt = indexedDB.open("budget",1);

rqt.onupgradeneeded = function(e) {
    const db = e.target.result;
    db.createObjectStore("pending", { autoIncrement: true});
     

};


rqt.onsuccess = function(e) {
    db = e.target.result;

    if(navigator.onLine) {
        checkDatabase();
    }
};


rqt.onerror = function(e){
    console.log("Do'h" + e.target.errorCode);

}; 

function saveRecord(record){
    const transaction = db.transaction(["pending"],"readwrite");
    const store = transaction.objectStore("pending");
    store.add(record);
}

function checkDatabase() {
    const transaction = db.transaction(["pending"],"readwrite");
    const store = transaction.objectStore("pending");
    const getAll = store.getAll(); 

    getAll.onsuccess = function(){
        if(getAll.result.length > 0){
            fetch('/api/transaction/bulk',{
                method:"POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }

            })
            .then(response => response.json())
            .then(()=>{
                const transaction = db.transaction(["pending"],"readwrite");
                const store = transaction.objectStore("pending");
                store.clear();
            })
        }
    }

}
addEventListener("online",checkDatabase);