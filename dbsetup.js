const sqlite3 = require('sqlite3').verbose();

function setupDB() {
  let userDB = new sqlite3.Database("./URLData.db",
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
        console.log("Database Creation Successful");
    });

  let db = new sqlite3.Database("./URLData.db");
  const createScript = `CREATE TABLE URLs (
    Id             INTEGER  PRIMARY KEY AUTOINCREMENT
                            NOT NULL
                            UNIQUE,
    LongURL VARCHAR UNIQUE,
    ShortURL VARCHAR,
    NumberRequests INTEGER
    );`;
  db.run((createScript), function(err) {
    if (err) {
      console.log("Error Creating Table:");
      console.log(err.message);
    }
    else {
      console.log(`Created Table`);
    }
  });
}

setupDB();
