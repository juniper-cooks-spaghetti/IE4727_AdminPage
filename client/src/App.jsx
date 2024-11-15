import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Movies from "./pages/movies";
import AddMovies from "./pages/addmovies";
import UpdateMovies from "./pages/updatemovies";
import Screenings from "./pages/Screenings";
import AddScreening from "./pages/AddScreening";
import UpdateScreening from "./pages/UpdateScreening";
import Navbar from "./components/Navbar";
import Bookings from "./pages/Bookings";

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-gray-900 text-white">
                <Navbar />
                <main className="container mx-auto px-4 py-8">
                    <Routes>
                        <Route path="/" element={<Movies />} />
                        <Route path="/add" element={<AddMovies />} />
                        <Route path="/update/:id" element={<UpdateMovies />} />
                        <Route path="/screenings" element={<Screenings />} />
                        <Route path="/screenings/add" element={<AddScreening />} />
                        <Route path="/screenings/update/:id" element={<UpdateScreening />} />
                        <Route path="/bookings" element={<Bookings />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;