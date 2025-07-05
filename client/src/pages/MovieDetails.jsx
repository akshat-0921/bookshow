import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Heart,
    PlayCircle,
    Star,
    ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAppContext } from "../context/AppContext";
import BlurCircle from "../components/BlurCircle";
import DateSelect from "../components/DateSelect";
import MovieCard from "../components/MovieCard";
import Loading from "../components/Loading";
import toast from "react-hot-toast";
import timeFormat from "../lib/timeFormat";

/**
 * MovieDetails — polished redesign with hero backdrop, floating card, and cleaner sections.
 */
const MovieDetails: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [show, setShow] = useState<any>(null);

    const {
        shows,
        axios,
        getToken,
        user,
        fetchFavoriteMovies,
        favoriteMovies,
        image_base_url,
    } = useAppContext();

    const getShow = async () => {
        try {
            const { data } = await axios.get(`/api/show/${id}`);
            if (data.success) setShow(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleFavorite = async () => {
        try {
            if (!user) return toast.error("Please login to proceed");
            const { data } = await axios.post(
                "/api/user/update-favorite",
                { movieId: id },
                { headers: { Authorization: `Bearer ${await getToken()}` } },
            );
            if (data.success) {
                await fetchFavoriteMovies();
                toast.success(data.message);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        getShow();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    if (!show) return <Loading />;

    const {
        movie: {
            poster_path,
            backdrop_path,
            title,
            vote_average,
            overview,
            runtime,
            genres,
            release_date,
            casts,
        },
        dateTime,
    } = show;

    /* ============= Helpers ============= */
    const isFav = favoriteMovies.some((m: any) => m._id === id);

    return (
        <div className="relative isolate min-h-screen">
            {/* ===== Hero Backdrop ===== */}
            <div
                className="absolute inset-0 -z-10 h-[50vh] w-full bg-cover bg-center"
                style={{
                    backgroundImage: `url(${image_base_url + backdrop_path})`,
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black" />
            </div>

            {/* ===== Back navigation for mobile ===== */}
            <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-4 md:hidden"
                onClick={() => navigate(-1)}
            >
                <ChevronLeft className="h-6 w-6" />
            </Button>

            {/* ===== Floating Movie Card ===== */}
            <section className="mx-auto -mt-44 flex max-w-6xl flex-col gap-8 px-4 md:-mt-24 lg:flex-row lg:px-8">
                <Card className="aspect-[2/3] h-96 max-w-xs overflow-hidden rounded-2xl shadow-2xl lg:h-[30rem]">
                    <img
                        src={image_base_url + poster_path}
                        alt="poster"
                        className="h-full w-full object-cover"
                    />
                </Card>

                <div className="flex flex-1 flex-col gap-4 pt-4 text-gray-300 lg:pt-10">
                    <BlurCircle top="-6rem" left="-6rem" />

                    <span className="text-sm font-medium text-primary">
            {genres[0]?.name?.toUpperCase() || "MOVIE"}
          </span>
                    <h1 className="text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
                        {title}
                    </h1>

                    <div className="flex items-center gap-2 text-gray-400">
                        <Star className="h-5 w-5 fill-primary text-primary" />
                        {vote_average.toFixed(1)} User Rating
                    </div>

                    <p className="max-w-3xl text-sm leading-relaxed lg:text-base">
                        {overview}
                    </p>

                    <p className="text-sm text-gray-400">
                        {timeFormat(runtime)} • {genres.map((g: any) => g.name).join(", ")} • {" "}
                        {release_date.split("-")[0]}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-4">
                        <Button variant="secondary" className="flex items-center gap-2">
                            <PlayCircle className="h-5 w-5" /> Watch Trailer
                        </Button>
                        <Button asChild>
                            <a href="#dateSelect">Buy Tickets</a>
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleFavorite}
                            className={isFav ? "bg-primary/10" : ""}
                        >
                            <Heart
                                className={`h-5 w-5 ${isFav ? "fill-primary text-primary" : ""}`}
                            />
                        </Button>
                    </div>
                </div>
            </section>

            {/* ===== Cast Section ===== */}
            <section className="mx-auto mt-20 max-w-6xl px-4 lg:px-8">
                <h2 className="mb-6 text-lg font-semibold text-white">Top Cast</h2>
                <div className="flex gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {casts.slice(0, 12).map((cast: any, idx: number) => (
                        <div key={idx} className="w-24 flex-shrink-0 text-center">
                            <img
                                src={cast.profile_path}
                                alt={cast.name}
                                className="mx-auto h-24 w-24 rounded-full object-cover"
                            />
                            <p className="mt-2 truncate text-xs font-medium text-gray-200">
                                {cast.name}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ===== Date Select ===== */}
            <section id="dateSelect" className="mx-auto mt-24 max-w-6xl px-4 lg:px-8">
                <DateSelect dateTime={dateTime} id={id as string} />
            </section>

            {/* ===== Recommendations ===== */}
            <section className="mx-auto mt-24 max-w-6xl px-4 lg:px-8">
                <h2 className="mb-6 text-lg font-semibold text-white">You May Also Like</h2>
                <div className="flex flex-wrap justify-center gap-8 lg:justify-start">
                    {shows.slice(0, 4).map((movie: any, idx: number) => (
                        <MovieCard key={idx} movie={movie} />
                    ))}
                </div>
                <div className="mt-12 flex justify-center">
                    <Button
                        onClick={() => {
                            navigate("/movies");
                            scrollTo({ top: 0, behavior: "smooth" });
                        }}
                    >
                        Show more
                    </Button>
                </div>
            </section>
        </div>
    );
};

export default MovieDetails;
