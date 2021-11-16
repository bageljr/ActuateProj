const express = require('express');
const app = express();
const sqlite3 = require('sqlite3').verbose();

function getShortFromLong(Id) {
  let finalNum = Id.toString(36);//parseInt(Id, 36);
  if (finalNum.length < 6) {
    var extraZeros = "";
    for (i = 0; i < 6 - finalNum.length; i ++) {
      extraZeros += "0";
    }
    finalNum = extraZeros + finalNum;
  }
  return finalNum;
};

function getLongFromShort(shortURL) {
  return parseInt(shortURL, 36).toString();
}

app.get('/getShort/:longurl', function (req, res) {
  let longurl = decodeURI(req.params.longurl);
  console.log(longurl);

   let db = new sqlite3.Database("./URLData.db");
      db.all("SELECT Id, ShortURL FROM URLs WHERE LongURL = ?", [longurl], (err, row) => {
        if (err) {
          reject(err)
        } else {
          if (row.length === 0) {
            console.log("No Records");
            let createString = `INSERT INTO URLs (LongURL, NumberRequests) VALUES('${longurl}', 0)`;
            db.run((createString), function(err) {
              if (err) {
                console.log("Error Inserting Data:");
                console.log(err.message);
                res.sendStatus(500);
              }
              else {
                console.log(`Inserted Record`);
                //res.sendStatus(200);
                db.all("SELECT Id FROM URLs WHERE LongURL = ?", [longurl], (err, secondrow) => {
                  if (err) {
                    reject(err)
                  } else {
                    const newId = secondrow[0].Id;
                    const shortURL = getShortFromLong(newId);
                    let updateString = `UPDATE URLs SET ShortURL = '${shortURL}' WHERE Id = ${newId}`;
                    db.run((updateString), function(err) {
                      if (err) {
                        console.log("Error Updating Data:");
                        console.log(err.message);
                        res.sendStatus(500);
                      }
                      else {
                        console.log(`Updated Record`);
                        res.end(shortURL);
                      }
                    });
                  }
                });
              }
            });
          }
          else {
            console.log('Found Result');
            res.end(row[0].ShortURL);
          }
        }
      })
})

app.get('/getLong/:shorturl', function (req, res) {
  let shorturl = req.params.shorturl;
  let longId = getLongFromShort(shorturl);

  let db = new sqlite3.Database("./URLData.db");
  db.all("SELECT LongURL FROM URLs WHERE Id = ?", [longId], (err, row) => {
    if (err) {
      reject(err)
    } else {
      if (row.length === 0) {
        res.end(`No Long URL exists for Short URL ${shorturl}`)
      }
      else {
        res.end(row[0].LongURL);
      }
    }
  });
})

app.get('/goURL/:shorturl', function (req, res) {
  let shorturl = req.params.shorturl;
  let longId = getLongFromShort(shorturl);

  let db = new sqlite3.Database("./URLData.db");
  db.all("SELECT Id, LongURL FROM URLs WHERE Id = ?", [longId], (err, row) => {
    if (err) {
      reject(err)
    } else {
      if (row.length === 0) {
        res.end(`No Long URL exists for Short URL ${shorturl}`)
      }
      else {
        let updateString = `UPDATE URLs SET NumberRequests = NumberRequests + 1 WHERE Id = ${row[0].Id}`;
        db.run((updateString), function(err) {
          if (err) {
            console.log("Error Updating Data:");
            console.log(err.message);
            res.sendStatus(500);
          }
          else {
            console.log(`Updated Record`);
          }
        });
        res.status(301).redirect("https://www." + row[0].LongURL);
      }
    }
  });
})

var server = app.listen(8082, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})
