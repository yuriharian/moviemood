"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const payload = { username, password };
      await axios.post("http://localhost:3001/auth/register", payload);
      setMessage("Usuário registrado com sucesso!");
      setTimeout(() => router.push("/login"), 2000);
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Erro ao registrar usuário.");
    }
  };

  return (
    <div className="form-container">
      <h1>Cadastro</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Usuário:</label>
          <input
            type="text"
            id="username"
            placeholder="Usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Senha:</label>
          <input
            type="password"
            id="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="button">
          Registrar
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}
