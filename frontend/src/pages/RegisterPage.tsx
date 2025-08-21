import React, { useState } from "react";
import styles from "./RegisterPage.module.css";

const RegisterPage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [volumeNumber, setVolumeNumber] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Adicionar lógica de cadastro de volume
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>Cadastrar Título</h2>

        <div className={styles.field}>
          <label htmlFor="title" className={styles.label}>
            Título do volume
          </label>
          <input
            id="title"
            type="text"
            placeholder="Ex: Naruto"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="volumeNumber" className={styles.label}>
            Número do volume
          </label>
          <input
            id="volumeNumber"
            type="number"
            placeholder="Ex: 1"
            value={volumeNumber}
            onChange={(e) => setVolumeNumber(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="releaseDate" className={styles.label}>
            Data de lançamento
          </label>
          <input
            id="releaseDate"
            type="date"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="coverImage" className={styles.label}>
            Imagem de capa do volume
          </label>
          <input
            id="coverImage"
            type="file"
            accept="image/*"
            onChange={(e) =>
              setCoverImage(e.target.files ? e.target.files[0] : null)
            }
            className={styles.input}
          />
        </div>

        <button type="submit" className={styles.button}>
          Cadastrar
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
