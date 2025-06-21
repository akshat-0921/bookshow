import React from 'react'
import { ArrowRight, CalendarIcon, ClockIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const HeroBanner = ({
                        title,
                        description,
                        genres,
                        year,
                        duration,
                        backgroundImage,
                        logo,
                        explorePath = '/movies',
                    }) => {
    const navigate = useNavigate()

    return (
        <div
            className="flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36 bg-cover bg-center h-screen"
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            {logo && <img src={logo} alt="Logo" className="max-h-11 lg:h-11 mt-20" />}

            <h1 className="text-5xl md:text-[70px] md:leading-18 font-semibold max-w-110">
                {title}
            </h1>

            <div className="flex items-center gap-4 text-gray-300">
                <span>{genres.join(' | ')}</span>
                <div className="flex items-center gap-1">
                    <CalendarIcon className="w-4.5 h-4.5" /> {year}
                </div>
                <div className="flex items-center gap-1">
                    <ClockIcon className="w-4.5 h-4.5" /> {duration}
                </div>
            </div>

            <p className="max-w-md text-gray-300">{description}</p>

            <button
                onClick={() => navigate(explorePath)}
                className="flex items-center gap-1 px-6 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer"
            >
                Explore Movies
                <ArrowRight className="w-5 h-5" />
            </button>
        </div>
    )
}

export default HeroBanner
