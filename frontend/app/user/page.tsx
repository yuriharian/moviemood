"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function UserPage() {
  const [user, setUser] = useState({
    username: "",
  });

  const [movies, setMovies] = useState([]);
  const [newMovie, setNewMovie] = useState({
    title: "",
    userRating: "",
    releaseYear: "",
    genre: "",
  });
  const [editingMovie, setEditingMovie] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get("http://localhost:3001/movies");
        setMovies(response.data);
      } catch (error) {
        console.error("Erro ao carregar filmes:", error);
      }
    };

    fetchMovies();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser({ username: "" });
    router.push("/");
  };

  const handleCreateMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const movieData = {
        ...newMovie,
        userRating: Number(newMovie.userRating),
        releaseYear: Number(newMovie.releaseYear),
      };

      const response = await axios.post(
        "http://localhost:3001/movies",
        movieData
      );
      setMovies([...movies, response.data]);
      setNewMovie({ title: "", userRating: "", releaseYear: "", genre: "" });
    } catch (error) {
      console.error("Erro ao criar filme:", error);
    }
  };

  const handleEditMovie = (movie) => {
    setEditingMovie(movie);
    setNewMovie({
      title: movie.title,
      userRating: movie.userRating,
      releaseYear: movie.releaseYear,
      genre: movie.genre,
    });
  };

  const handleUpdateMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const movieData = {
        ...newMovie,
        userRating: Number(newMovie.userRating),
        releaseYear: Number(newMovie.releaseYear),
      };

      const response = await axios.put(
        `http://localhost:3001/movies/${editingMovie._id}`,
        movieData
      );
      setMovies(
        movies.map((movie) =>
          movie._id === editingMovie._id ? response.data : movie
        )
      );
      setEditingMovie(null);
      setNewMovie({ title: "", userRating: "", releaseYear: "", genre: "" });
    } catch (error) {
      console.error("Erro ao atualizar filme:", error);
    }
  };

  const handleDeleteMovie = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3001/movies/${id}`);
      setMovies(movies.filter((movie) => movie._id !== id));
    } catch (error) {
      console.error("Erro ao apagar filme:", error);
    }
  };

  return (
    <div className="user-container">
      <header className="user-header">
        <h1>Bem-vindo, {user.username}!</h1>
        <button className="button logout-button" onClick={handleLogout}>
          Sair
        </button>
      </header>

      <div className="movies-container">
        <h2>Filmes Cadastrados</h2>
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div key={movie._id} className="movie-card">
              <h3>{movie.title}</h3>
              <p>Nota do usuário: {movie.userRating}</p>
              <p>Ano: {movie.releaseYear}</p>
              <p>Gênero: {movie.genre}</p>
              <button
                className="button edit-button"
                onClick={() => handleEditMovie(movie)}
              >
                Editar
              </button>
              <button
                className="button delete-button"
                onClick={() => handleDeleteMovie(movie._id)}
              >
                Apagar
              </button>
            </div>
          ))
        ) : (
          <p>Não há filmes cadastrados.</p>
        )}
      </div>

      <form
        onSubmit={editingMovie ? handleUpdateMovie : handleCreateMovie}
        className="create-movie-form"
      >
        <h2>{editingMovie ? "Editar Filme" : "Adicionar Filme"}</h2>
        <input
          type="text"
          placeholder="Título do filme"
          value={newMovie.title}
          onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Nota do usuário (1-10)"
          value={newMovie.userRating}
          onChange={(e) =>
            setNewMovie({ ...newMovie, userRating: e.target.value })
          }
          required
          min="1"
          max="10"
        />
        <input
          type="number"
          placeholder="Ano de lançamento"
          value={newMovie.releaseYear}
          onChange={(e) =>
            setNewMovie({ ...newMovie, releaseYear: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="Gênero"
          value={newMovie.genre}
          onChange={(e) => setNewMovie({ ...newMovie, genre: e.target.value })}
          required
        />
        <button type="submit" className="button">
          {editingMovie ? "Atualizar Filme" : "Adicionar Filme"}
        </button>
      </form>
    </div>
  );
}
