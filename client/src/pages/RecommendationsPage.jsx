import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import MediaItem from "../components/common/MediaItem";
import useRecommendations from "../hooks/useRecommendations";

const RecommendationsPage = () => {
  const [allMovies, setAllMovies] = useState([]);

  // API FREE: Sample Movies (fallback)
  useEffect(() => {
    fetch("https://api.sampleapis.com/movies/action")
      .then((res) => res.json())
      .then((data) => {
        // chuẩn hóa dữ liệu
        const formatted = data.map((item) => ({
          id: item.id,
          title: item.title,
          poster_path: item.posterURL,
          genre_ids: [28], // Action
          mediaType: "movie",
        }));

        setAllMovies(formatted);
      });
  }, []);

  const recommendations = useRecommendations(allMovies);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
        Recommended For You
      </Typography>

      {recommendations.length === 0 ? (
        <Typography sx={{ opacity: 0.7, mt: 2 }}>
          Watch some movies first and we will recommend similar ones!
        </Typography>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            gap: "16px",
          }}
        >
          {recommendations.map((movie) => (
            <MediaItem
              key={movie.id}
              media={movie}
              mediaType={movie.mediaType || "movie"}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default RecommendationsPage;
