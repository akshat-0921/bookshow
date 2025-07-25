import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import HeroBanner from './HeroBanner';
import { assets } from '../assets/assets';

const movies = [
    {
        title: 'Inception',
        description: 'A thief who steals corporate secrets...',
        genres: ['Action', 'Adventure', 'Thriller'],
        year: '2010',
        duration: '2h 28m',
        backgroundImage: assets.inceptionbackground,
        logo: assets.inceptionLogo,
        explorePath: '/movies',
    },
    {
        title: 'Interstellar',
        description: 'A team of explorers travel through a wormhole...',
        genres: ['Sci-Fi', 'Drama'],
        year: '2014',
        duration: '2h 49m',
        backgroundImage: assets.Interstellar,
        logo: assets.interstellarLogo,
        explorePath: '/movies',
    },
    // {
    //     title: 'Guardians of the Galaxy',
    //     description: 'In a post-apocalyptic world...',
    //     genres: ['Action', 'Adventure', 'Sci-Fi'],
    //     year: '2018',
    //     duration: '2h 8m',
    //     backgroundImage: assets.marvelbackground,
    //     logo: assets.marvelLogo,
    //     explorePath: '/movies',
    // },
    {
        title: 'Interstellar',
        description: 'A team of explorers travel through a wormhole...',
        genres: ['Sci-Fi', 'Drama'],
        year: '2014',
        duration: '2h 49m',
        backgroundImage: assets.Interstellar,
        logo: assets.interstellarLogo,
        explorePath: '/movies',
    },
];

const variants = {
    initial: { opacity: 0, scale: 1.1 },
    animate: { opacity: 1, scale: 1, transition: { duration: 1.5 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 1.5 } },
};

const HeroSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % movies.length);
        }, 6000); // Slide every 6 seconds (slightly longer for smoother viewing)

        return () => clearInterval(interval);
    }, []);

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? movies.length - 1 : prev - 1));
    };

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % movies.length);
    };

    const currentMovie = movies[currentIndex];

    return (
        <div className="relative w-full h-screen overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentMovie.title}
                    variants={variants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="absolute inset-0"
                >
                    <HeroBanner {...currentMovie} />
                </motion.div>
            </AnimatePresence>

            <button
                onClick={prevSlide}
                className="absolute left-5 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-2 rounded-full z-10"
            >
                <ChevronLeft size={24} />
            </button>

            <button
                onClick={nextSlide}
                className="absolute right-5 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-2 rounded-full z-10"
            >
                <ChevronRight size={24} />
            </button>

            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {movies.map((_, idx) => (
                    <div
                        key={idx}
                        className={`w-3 h-3 rounded-full ${
                            idx === currentIndex ? 'bg-white' : 'bg-gray-400'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroSection;
