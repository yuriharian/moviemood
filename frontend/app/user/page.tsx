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
  const [filters, setFilters] = useState({
    title: "",
    genre: "",
    releaseYear: "",
    userRating: "",
    favorite: false,
  });
  const [theme, setTheme] = useState("dark");
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

  useEffect(() => {
    // Carregar tema salvo
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme || "dark");
  }, [router]);

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
      userRating: String(movie.userRating),
      releaseYear: String(movie.releaseYear),
      genre: movie.genre,
    });
  };

  const handleUpdateMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMovie) return;
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

  // Troca de tema
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  // Favoritar/desfavoritar filme
  const handleToggleFavorite = async (movie) => {
    try {
      const response = await axios.patch(
        `http://localhost:3001/movies/${movie._id}`,
        { favorite: !movie.favorite }
      );
      setMovies(movies.map((m) => (m._id === movie._id ? response.data : m)));
    } catch (error) {
      console.error("Erro ao favoritar filme:", error);
    }
  };

  // Filtro de filmes
  const filteredMovies = movies.filter((movie) => {
    const matchTitle = movie.title
      .toLowerCase()
      .includes(filters.title.toLowerCase());
    const matchGenre = movie.genre
      .toLowerCase()
      .includes(filters.genre.toLowerCase());
    const matchYear =
      !filters.releaseYear || String(movie.releaseYear) === filters.releaseYear;
    const matchFavorite = !filters.favorite || movie.favorite;
    const matchRating =
      !filters.userRating || String(movie.userRating) === filters.userRating;
    return (
      matchTitle && matchGenre && matchYear && matchFavorite && matchRating
    );
  });

  return (
    <div className="user-container">
      <header className="user-header">
        <h1>Bem-vindo, {user.username}!</h1>
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="button logout-button" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </header>

      {/* Filtros de busca */}
      <div className="filters-container">
        <input
          type="text"
          placeholder="Filtrar por título"
          value={filters.title}
          onChange={(e) => setFilters({ ...filters, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Filtrar por gênero"
          value={filters.genre}
          onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
        />
        <input
          type="number"
          placeholder="Ano"
          value={filters.releaseYear}
          onChange={(e) =>
            setFilters({ ...filters, releaseYear: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Nota"
          min="1"
          max="10"
          value={filters.userRating}
          onChange={(e) =>
            setFilters({ ...filters, userRating: e.target.value })
          }
        />
        <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <input
            type="checkbox"
            checked={filters.favorite}
            onChange={(e) =>
              setFilters({ ...filters, favorite: e.target.checked })
            }
          />
          Favoritos
        </label>
      </div>

      {/* Contagem de filmes */}
      <div style={{ margin: "10px 0", fontWeight: "bold" }}>
        Filmes encontrados: {filteredMovies.length}
      </div>

      <div className="movies-container">
        <h2>Filmes Cadastrados</h2>
        {filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => (
            <div key={movie._id} className="movie-card">
              <h3>
                {movie.title}{" "}
                <span
                  style={{
                    cursor: "pointer",
                    color: movie.favorite ? "#dc143c" : "#bbb",
                    fontSize: "1.2em",
                  }}
                  title={
                    movie.favorite
                      ? "Remover dos favoritos"
                      : "Adicionar aos favoritos"
                  }
                  onClick={() => handleToggleFavorite(movie)}
                >
                  ★
                </span>
              </h3>
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
