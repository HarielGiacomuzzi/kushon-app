import React, { useState } from "react";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Adicionar lógica de autenticação
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          minWidth: "320px",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            margin: 0,
            fontWeight: 600,
            color: "#3a3a3a",
          }}
        >
          Entrar na Kushon
        </h2>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: "0.75rem",
            borderRadius: "8px",
            border: "1px solid #dbeafe",
            fontSize: "1rem",
            outline: "none",
          }}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            padding: "0.75rem",
            borderRadius: "8px",
            border: "1px solid #dbeafe",
            fontSize: "1rem",
            outline: "none",
          }}
        />
        <button
          type="submit"
          style={{
            background: "linear-gradient(90deg, #38bdf8 0%, #6366f1 100%)",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "0.75rem",
            fontWeight: 600,
            fontSize: "1rem",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
        >
          Entrar
        </button>
        <div style={{ textAlign: "center", fontSize: "0.95rem" }}>
          <a
            href="/register"
            style={{ color: "#6366f1", textDecoration: "none" }}
          >
            Não tem conta? Cadastre-se
          </a>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
