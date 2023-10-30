import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "World",
  password: "patil123",
  port: "5432",
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


let countrie = [];

db.query("SELECT countery_code FROM visited_countries", (err, res) => {
  if (err) {
    console.log("Error exicuting query", err.stack)
  } else {
    countrie = res.rows;
  }
  db.end();
})

db.query("SELECT country_name FROM countries", (err, res) => {
  if (err) {
    console.log("Error exicuting query", err.stack)
  } else {
    let av_countries = res.rows.map(row => row.countery_code);
  }
})

function checkAva(ctry, callback){
  db.query("SELECT country_name FROM countries", async (err, res) => {
    if (err) {
      console.log("Error exicuting query", err.stack)
    } else {
      if((await res.rows.map(row => row.countery_code)).includes(ctry)){
        callback(true);
      }else{
        callback(false);
      }
    }
  })

}

app.post("/add", async (req, res) => {
  var sr = req.body.country;
  console.log(typeof(sr));
  if (checkAva(sr, true)){
    console.log("ok")
    db.query("INSERT INTO visited_countries (countery_code) VALUES ($1)", [sr])
  }
})
  
app.get("/", async (req, res) => {
  console.log(countrie)
  res.render("index.ejs", { countries: countrie.map(row => row.countery_code), total: countrie.length })
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

