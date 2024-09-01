"use client";

import { useEffect, useState } from "react";
import styles from "./results.module.css";
import { useRouter } from "next/dist/client/components/navigation";

interface ImageData {
  url: string;
  id: string;
  votes: number;
}

const fetchImages = async () => {
  const res = await fetch("/images.json");
  if (!res.ok) {
    throw new Error("Failed to fetch");
  }
  const data = await res.json();
  return data.images as ImageData[];
};

const ResultsPage = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const router = useRouter();

  useEffect(() => {
    const loadImages = async () => {
      const data = await fetchImages();
      const updatedVotes = JSON.parse(localStorage.getItem("votes") || "{}");
      const imagesWithVotes = data.map((image) => ({
        ...image,
        votes: updatedVotes[image.id] || 0,
      }));
      setImages(imagesWithVotes);
    };
    loadImages();
  }, []);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentImages = images.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const sortedVotes = currentImages.sort((a, b) => b.votes - a.votes);

  const totalPages = Math.ceil(images.length / itemsPerPage);

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Results</h1>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Votes</th>
            </tr>
          </thead>
          <tbody>
            {sortedVotes.length > 0 ? (
              sortedVotes.map((image) => (
                <tr key={image.id}>
                  <td>
                    <img
                      src={image.url}
                      alt={`Image ${image.id}`}
                      className={styles.image}
                    />
                  </td>
                  <td>{image.votes}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3}>Aucune image trouvée</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className={styles.pagination}>
        <button
          className={`${styles.pageButton} ${
            currentPage === 1 ? styles.pageButtonDisabled : ""
          }`}
          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className={styles.pageIndicator}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className={`${styles.pageButton} ${
            currentPage === totalPages ? styles.pageButtonDisabled : ""
          }`}
          onClick={() =>
            currentPage < totalPages && handlePageChange(currentPage + 1)
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
      <button className={styles.homeButton} onClick={() => router.push("/")}>
        Back to main page
      </button>
    </div>
  );
};

export default ResultsPage;
