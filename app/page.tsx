"use client";

import { useEffect, useState } from "react";
import styles from "../app/vote/vote.module.css";
import { useRouter } from "next/navigation";

interface ImageData {
  url: string;
  id: string;
}

export default function VotePage() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [currentPair, setCurrentPair] = useState<ImageData[]>([]);
  const [votes, setVotes] = useState<{ [key: string]: number }>({});
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/images.json");
      const data = await response.json();
      setImages(data.images);
      const storedVotes = localStorage.getItem("votes");
      setVotes(storedVotes ? JSON.parse(storedVotes) : {});
      selectRandomPair(data.images);
    }
    fetchData();
  }, []);

  function selectRandomPair(allImages: ImageData[]) {
    if (allImages.length < 2) return;
    const shuffled = allImages.sort(() => 0.5 - Math.random());
    setCurrentPair(shuffled.slice(0, 2));
  }

  const handleVote = (id: string) => {
    const newVotes = { ...votes, [id]: (votes[id] || 0) + 1 };
    setVotes(newVotes);
    localStorage.setItem("votes", JSON.stringify(newVotes));
    selectRandomPair(images);
  };

  const handleResults = () => {
    router.push('/results');
  };

  if (currentPair.length < 2) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        Cat Mash
      </div>
      <div className={styles.content}>
        <div className={styles.section}>
          {currentPair[0] && (
            <>
              <div className={styles.imageWrapper}>
                <img src={currentPair[0].url} alt="Chat 1" className={styles.image} />
              </div>
              <button className={styles.voteButton} onClick={() => handleVote(currentPair[0].id)}>Vote</button>
              <div className={styles.score}>Score: {votes[currentPair[0].id] || 0}</div>
            </>
          )}
        </div>
        <div className={styles.divider}></div>
        <div className={styles.section}>
          {currentPair[1] && (
            <>
              <div className={styles.imageWrapper}>
                <img src={currentPair[1].url} alt="Chat 2" className={styles.image} />
              </div>
              <button className={styles.voteButton} onClick={() => handleVote(currentPair[1].id)}>Vote</button>
              <div className={styles.score}>Score: {votes[currentPair[1].id] || 0}</div>
            </>
          )}
        </div>
      </div>
      <button className={styles.resultsButton} onClick={handleResults}>Voir les résultats</button>
    </div>
  );
}
