import axios from "axios"
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";
import { inngest } from "../inngest/index.js";



export const getNowPlayingMovies = async (req, res) => {
    try {
        const watchmodeRes = await axios.get("https://api.watchmode.com/v1/list-titles/", {
            params: {
                apiKey: process.env.WATCHMODE_API_KEY,
                types: "movie",
                sort_by: "popularity_desc",
                limit: 10
            }
        });

        const titles = watchmodeRes.data.titles || [];
        const movieDetailsList = [];

        for (const movie of titles) {
            const omdbRes = await axios.get("http://www.omdbapi.com/", {
                params: {
                    apikey: process.env.OMDB_API_KEY,
                    t: movie.title // Use Watchmode title to query OMDb
                }
            });

            const data = omdbRes.data;
            if (data.Response === "True") {
                const movieDetails = {
                    _id: data.imdbID,
                    title: data.Title,
                    overview: data.Plot,
                    poster_path: data.Poster,
                    backdrop_path: "", // OMDb doesn't provide this
                    genres: data.Genre?.split(", ").map(g => g.trim()) || [],
                    casts: data.Actors?.split(", ").map(a => ({ name: a })) || [],
                    release_date: data.Released,
                    original_language: data.Language,
                    tagline: "", // Not provided by OMDb
                    vote_average: parseFloat(data.imdbRating) || null,
                    runtime: parseInt(data.Runtime) || 0
                };

                movieDetailsList.push(movieDetails);
            }
        }

        res.json({ success: true, movies: movieDetailsList });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const addShow = async (req, res) => {
    try {
        const { movieId, showsInput, showPrice } = req.body;

        let movie = await Movie.findById(movieId);

        if (!movie) {
            // Step 1: Get movie title from Watchmode using the ID
            const watchmodeRes = await axios.get(`https://api.watchmode.com/v1/title/${movieId}/details/`, {
                params: {
                    apiKey: process.env.WATCHMODE_API_KEY
                }
            });

            const watchTitle = watchmodeRes.data.title;

            // Step 2: Search OMDb with that title
            const omdbRes = await axios.get("http://www.omdbapi.com/", {
                params: {
                    apikey: process.env.OMDB_API_KEY,
                    t: watchTitle
                }
            });

            const movieApiData = omdbRes.data;

            if (movieApiData.Response === "False") {
                return res.status(404).json({ success: false, message: "Movie not found in OMDb." });
            }

            // Step 3: Build your movie object
            const movieDetails = {
                _id: movieId,
                title: movieApiData.Title,
                overview: movieApiData.Plot,
                poster_path: movieApiData.Poster,
                backdrop_path: "", // OMDb doesn't support this
                genres: movieApiData.Genre?.split(", ").map(g => g.trim()) || [],
                casts: movieApiData.Actors?.split(", ").map(name => ({ name })) || [],
                release_date: movieApiData.Released,
                original_language: movieApiData.Language,
                tagline: "", // Not available in OMDb
                vote_average: parseFloat(movieApiData.imdbRating) || 0,
                runtime: parseInt(movieApiData.Runtime) || 0
            };

            // Step 4: Save to DB
            movie = await Movie.create(movieDetails);
        }

        // Step 5: Add all shows
        const showsToCreate = [];

        showsInput.forEach(show => {
            const showDate = show.date;
            show.time.forEach(time => {
                const dateTimeString = `${showDate}T${time}`;
                showsToCreate.push({
                    movie: movieId,
                    showDateTime: new Date(dateTimeString),
                    showPrice,
                    occupiedSeats: {}
                });
            });
        });

        if (showsToCreate.length > 0) {
            await Show.insertMany(showsToCreate);
        }

        // Step 6: Trigger event
        await inngest.send({
            name: "app/show.added",
            data: { movieTitle: movie.title }
        });

        res.json({ success: true, message: "Show added successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getShows = async (req, res) => {
    try {
        // Get upcoming shows, sorted by time, with movie populated
        const shows = await Show.find({ showDateTime: { $gte: new Date() } })
            .populate("movie")
            .sort({ showDateTime: 1 });

        // Extract unique movies using Map (safer than Set on objects)
        const uniqueMoviesMap = new Map();
        for (const show of shows) {
            const movieId = show.movie._id.toString();
            if (!uniqueMoviesMap.has(movieId)) {
                uniqueMoviesMap.set(movieId, show.movie);
            }
        }

        res.json({
            success: true,
            shows: Array.from(uniqueMoviesMap.values())
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};



export const getShow = async (req, res) => {
    try {
        const { movieId } = req.params;

        // All upcoming shows for a specific movie
        const shows = await Show.find({
            movie: movieId,
            showDateTime: { $gte: new Date() }
        });

        // Fetch full movie data
        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).json({ success: false, message: "Movie not found" });
        }

        // Group shows by date
        const dateTime = {};
        shows.forEach(show => {
            const date = show.showDateTime.toISOString().split("T")[0];
            if (!dateTime[date]) {
                dateTime[date] = [];
            }
            dateTime[date].push({
                time: show.showDateTime,
                showId: show._id
            });
        });

        res.json({
            success: true,
            movie,
            dateTime
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};


