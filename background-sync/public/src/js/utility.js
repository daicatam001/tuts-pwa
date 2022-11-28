var dbPromise = idb.open("posts-store", 1, function (db) {
  if (!db.objectStoreNames.contains("posts")) {
    db.createObjectStore("posts", { keyPath: "id" });
  }
  if (!db.objectStoreNames.contains("sync-posts")) {
    db.createObjectStore("sync-posts", { keyPath: "id" });
  }
});

function writeData(st, data) {
  return dbPromise.then(function (db) {
    var trx = db.transaction(st, "readwrite");
    var store = trx.objectStore(st);
    store.put(data);
    return trx.complete;
  });
}

function readAllData(st) {
  return dbPromise.then(function (db) {
    var trx = db.transaction(st, "readonly");
    var store = trx.objectStore(st);
    return store.getAll();
  });
}

function clearAllData(st) {
  return dbPromise.then(function (db) {
    var trx = db.transaction(st, "readwrite");
    var store = trx.objectStore(st);
    store.objectStore(st);
    store.clear();
    return tx.complete;
  });
}

function deleteItemFromData(st, id) {
  dbPromise.then(function (db) {
    var trx = db.transaction(st, "readwrite");
    var store = trx.objectStore(st);
    store.delete(id);
    return trx.complete;
  });
}
