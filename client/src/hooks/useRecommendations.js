import { useEffect, useState } from "react";

export default function useRecommendations(allMovies) {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("watchHistory")) || [];

    // Không có lịch sử → không có đề xuất
    if (history.length === 0) {
      setRecommendations([]);
      return;
    }

    // Đếm tần suất genre
    const genreCount = {};
    history.forEach((movie) => {
      (movie.genres || []).forEach((g) => {
        genreCount[g] = (genreCount[g] || 0) + 1;
      });
    });

    // Lấy 3 genres user xem nhiều nhất
    const topGenres = Object.entries(genreCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map((g) => g[0]);

    // Chọn phim phù hợp
    const suggested = allMovies.filter((movie) =>
      movie.genre_ids?.some((g) => topGenres.includes(g))
    );

    // Lấy tối đa 20 phim
    setRecommendations(suggested.slice(0, 20));
  }, [allMovies]);

  return recommendations;
}
