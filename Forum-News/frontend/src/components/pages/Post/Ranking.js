import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Ranking.module.css";

const Ranking = () => {
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    const fetchRankingData = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/users/ranking");
        setRanking(data);
      } catch (error) {
        console.error("Erro ao buscar dados do ranking:", error);
      }
    };

    fetchRankingData();
  }, []);

  return (
    <div>
      <h1 className={styles.rankingTitule}>Colaboração</h1>
      <div className={styles.rankingListContainer}>
        {ranking.length > 0 ? (
          ranking.map(({ idusers, username, score }) => (
            <div key={idusers} className={styles.rankingItem}>
              <div className={styles.postHeader}>
                <span>{username}</span>
                <span className={styles.score}>{score}</span>
              </div>
            </div>
          ))
        ) : (
          <p>Não há pontuações de usuários disponíveis</p>
        )}
      </div>
    </div>
  );
};

export default Ranking;
