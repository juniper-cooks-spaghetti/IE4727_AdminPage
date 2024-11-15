import express from "express";
import mysql from "mysql";
import cors from "cors";

const app = express();

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"cinebox"
})

app.use(express.json())
app.use(cors())

app.get("/", (req,res)=>{
    res.json("hello this is the backend")
})

app.get("/movies", (req,res)=>{
    const q = "SELECT * FROM movies"
    db.query(q,(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})

app.post("/movies", (req,res)=>{
    const q ="INSERT INTO Movies (`Title`, `Genre`, `Duration`, `Synopsis`, `ReleaseDate`, `Thumbnail`, `Poster`) VALUES (?)"
    const values = [
        req.body.title,        // Expecting data for 'Title' column
        req.body.genre,        // Expecting data for 'Genre' column
        req.body.duration,     // Expecting data for 'Duration' column
        req.body.synopsis,     // Expecting data for 'Synopsis' column
        req.body.releaseDate,  // Expecting data for 'ReleaseDate' column
        req.body.thumbnail,    // Expecting data for 'Thumbnail' column
        req.body.poster        // Expecting data for 'Poster' column
    ]

    db.query(q,[values], (err,data)=>{
        if(err) return res.json(err)
        return res.json("Movie has been created successfully.")
    })
})

app.get("/movies/:id", (req, res) => {
    const movieId = req.params.id;
    const q = "SELECT * FROM Movies WHERE MovieID = ?";
    
    db.query(q, [movieId], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.put("/movies/:id", (req, res) => {
    const movieId = req.params.id;
    const updateField = Object.keys(req.body)[0];
    const updateValue = req.body[updateField];
    
    const q = `UPDATE Movies SET ${updateField} = ? WHERE MovieID = ?`;
    
    db.query(q, [updateValue, movieId], (err, data) => {
        if (err) return res.json(err);
        return res.json("Movie has been updated successfully.");
    });
});

app.delete("/movies/:id", (req,res)=>{
    const movieID = req.params.id;
    const q = "DELETE FROM Movies WHERE MovieID = ?";

    db.query(q, [movieID], (err, data) => {
        if (err) return res.json(err);
        return res.json("Movie has been deleted successfully.");
    });
});

app.listen(8800, ()=>{
    console.log("Connected to backend!")
})