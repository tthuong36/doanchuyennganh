// GET /api/movies/autocomplete?q=
router.get("/autocomplete", async (req, res) => {
  try {
    const q = req.query.q;
    if (!q || q.trim() === "") return res.json([]);

    const movies = await Movie.find(
      { title: { $regex: q, $options: "i" } },
      { title: 1 }
    )
      .limit(7);

    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: "Autocomplete failed" });
  }
});
