import { fetchFromTMDB } from "../services/tmdb.service";

export async function getTrendingMovie(req, res) {
  try {
    const data = await fetchFromTMDB(
      "https://api.themoviedb.org/3/trending/movie/day?language=en-US",
    );
    randomMovie =
      data.results[Math.floor(Math.random() * data.results?.length)];
    res.json({ success: true, content: randomMovie });
  } catch (error) {
    return res
      .status(500)
      .json({ success: true, message: "Internal Server Error! " });
  }
}
