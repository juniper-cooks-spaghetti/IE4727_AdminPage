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

//movies functionalities

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

//screening functionalities
app.get('/screenings', (req, res) => {
    const q = 'SELECT * FROM Screenings';
    db.query(q, (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
});

app.post('/screenings', (req, res) => {
    const q = 'INSERT INTO Screenings (MovieID, CinemaID, ScreeningTime, TicketPrice) VALUES (?)';
    const values = [
      req.body.movieId,
      req.body.cinemaId,
      req.body.screeningTime,
      req.body.ticketPrice
    ];
    db.query(q, [values], (err, data) => {
      if (err) return res.json(err);
      return res.json('Screening has been created successfully.');
    });
});
// Get screening by ID
app.get("/screenings/:id", (req, res) => {
    const screeningId = req.params.id;
    const q = "SELECT * FROM Screenings WHERE ScreeningID = ?";
    
    db.query(q, [screeningId], (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  });
  
  // Get cinemas
  app.get("/cinemas", (req, res) => {
    const q = "SELECT * FROM Cinemas";
    db.query(q, (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  });

app.put('/screenings/:id', (req, res) => {
    const screeningId = req.params.id;
    const updateField = Object.keys(req.body)[0];
    const updateValue = req.body[updateField];
    const q = `UPDATE Screenings SET ${updateField} = ? WHERE ScreeningID = ?`;
    db.query(q, [updateValue, screeningId], (err, data) => {
      if (err) return res.json(err);
      return res.json('Screening has been updated successfully.');
    });
});

app.delete('/screenings/:id', (req, res) => {
    const screeningId = req.params.id;
    const q = 'DELETE FROM Screenings WHERE ScreeningID = ?';
    db.query(q, [screeningId], (err, data) => {
      if (err) return res.json(err);
      return res.json('Screening has been deleted successfully.');
    });
});

//booking functionalities
// Get all bookings with payment_status = success, including seat details
app.get("/bookings", (req, res) => {
    const q = `
      SELECT 
        b.BookingID,
        b.UserID,
        b.ScreeningID,
        b.BookingTime,
        b.TotalAmount,
        u.Username,
        m.Title as MovieTitle,
        c.Name as CinemaName,
        s.ScreeningTime,
        GROUP_CONCAT(CONCAT(st.Row, st.Number) ORDER BY st.Row, st.Number) as BookedSeats
      FROM Bookings b
      JOIN Users u ON b.UserID = u.UserID
      JOIN Screenings s ON b.ScreeningID = s.ScreeningID
      JOIN Movies m ON s.MovieID = m.MovieID
      JOIN Cinemas c ON s.CinemaID = c.CinemaID
      JOIN BookedSeats bs ON b.BookingID = bs.BookingID
      JOIN Seats st ON bs.SeatID = st.SeatID
      WHERE b.payment_status = 'success'
      GROUP BY b.BookingID
      ORDER BY b.BookingTime DESC
    `;
  
    db.query(q, (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  });
  
  // Get single booking details
  app.get("/bookings/:id", (req, res) => {
    const bookingId = req.params.id;
    const q = `
      SELECT 
        b.*,
        u.Username,
        m.Title as MovieTitle,
        c.Name as CinemaName,
        s.ScreeningTime,
        GROUP_CONCAT(CONCAT(st.Row, st.Number) ORDER BY st.Row, st.Number) as BookedSeats
      FROM Bookings b
      JOIN Users u ON b.UserID = u.UserID
      JOIN Screenings s ON b.ScreeningID = s.ScreeningID
      JOIN Movies m ON s.MovieID = m.MovieID
      JOIN Cinemas c ON s.CinemaID = c.CinemaID
      JOIN BookedSeats bs ON b.BookingID = bs.BookingID
      JOIN Seats st ON bs.SeatID = st.SeatID
      WHERE b.BookingID = ? AND b.payment_status = 'success'
      GROUP BY b.BookingID
    `;
  
    db.query(q, [bookingId], (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  });

app.listen(8800, ()=>{
    console.log("Connected to backend!")
})