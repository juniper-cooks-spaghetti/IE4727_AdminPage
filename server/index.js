import express from "express"
import mysql from "mysql"
const app = express()

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"cinebox"
})

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

app.listen(8800, ()=>{
    console.log("Connected to backend!")
})