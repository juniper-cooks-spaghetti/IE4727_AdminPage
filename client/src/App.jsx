import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Movies from "./pages/movies";
import AddMovies from "./pages/addmovies";
import UpdateMovies from "./pages/updatemovies";
import Navbar from "./components/Navbar";

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
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;