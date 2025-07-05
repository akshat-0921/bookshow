import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import BlurCircle from "../components/BlurCircle";
import Loading from "../components/Loading";
import isoTimeFormat from "../lib/isoTimeFormat";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

/**
 * SeatLayout — modernised interface with sticky timing sidebar and animated seat grid.
 */
const SeatLayout: React.FC = () => {
    const navigate = useNavigate();
    const { id, date } = useParams();

    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const [selectedTime, setSelectedTime] = useState<any>(null);
    const [show, setShow] = useState<any>(null);
    const [occupiedSeats, setOccupiedSeats] = useState<string[]>([]);

    const { axios, getToken, user } = useAppContext();

    /* ===== helpers ===== */
    const rows = [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
    ];
    const seatsPerRow = 9;

    const fetchShow = async () => {
        try {
            const { data } = await axios.get(`/api/show/${id}`);
            if (data.success) setShow(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchOccupied = async () => {
        if (!selectedTime) return;
        try {
            const { data } = await axios.get(`/api/booking/seats/${selectedTime.showId}`);
            if (data.success) setOccupiedSeats(data.occupiedSeats);
            else toast.error(data.message);
        } catch (err) {
            console.error(err);
        }
    };

    const toggleSeat = (seatId: string) => {
        if (!selectedTime) return toast("Pick a time first!");
        if (occupiedSeats.includes(seatId)) return toast("Seat already booked");
        if (!selectedSeats.includes(seatId) && selectedSeats.length >= 5)
            return toast("Maximum 5 seats");
        setSelectedSeats((prev) =>
            prev.includes(seatId) ? prev.filter((s) => s !== seatId) : [...prev, seatId],
        );
    };

    const checkout = async () => {
        try {
            if (!user) return toast.error("Please login to proceed");
            if (!selectedTime || !selectedSeats.length)
                return toast.error("Select time & seats first");

            const { data } = await axios.post(
                "/api/booking/create",
                { showId: selectedTime.showId, selectedSeats },
                { headers: { Authorization: `Bearer ${await getToken()}` } },
            );
            if (data.success) window.location.href = data.url;
            else toast.error(data.message);
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    /* ===== effects ===== */
    useEffect(() => {
        fetchShow();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    useEffect(() => {
        fetchOccupied();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedTime]);

    /* ===== render helpers ===== */
    const SeatButton = ({ seatId }: { seatId: string }) => {
        const isOccupied = occupiedSeats.includes(seatId);
        const isSelected = selectedSeats.includes(seatId);
        return (
            <motion.button
                whileTap={{ scale: 0.9 }}
                disabled={isOccupied}
                onClick={() => toggleSeat(seatId)}
                className={`h-8 w-8 rounded-md border text-xs transition-all ${isOccupied ? "cursor-not-allowed border-gray-500 bg-gray-600 text-gray-800" : isSelected ? "border-primary bg-primary text-white" : "border-primary/50 hover:bg-primary/10"}`}
            >
                {seatId}
            </motion.button>
        );
    };

    if (!show) return <Loading />;

    return (
        <div className="relative mx-auto flex max-w-7xl flex-col gap-12 px-4 py-16 lg:flex-row lg:gap-24 lg:px-8">
            {/* === Time Sidebar === */}
            <aside className="lg:w-60 lg:flex-shrink-0">
                <Card className="sticky top-28 h-max bg-black/60 backdrop-blur">
                    <CardContent className="space-y-5 p-6">
                        <h2 className="text-lg font-semibold text-white">Available Timings</h2>
                        {show.dateTime[date as string].map((t: any) => (
                            <Button
                            key={t.time}
                                 variant={selectedTime?.time === t.time ? "default" : "secondary"}
                                 className="w-full justify-start gap-2"
                                 onClick={() => setSelectedTime(t)}
                    >
                        <Clock className="h-4 w-4" /> {isoTimeFormat(t.time)}
                    </Button>
                    ))}
                </CardContent>
            </Card>
        </aside>

{/* === Seat Grid === */}
    <section className="relative flex flex-1 flex-col items-center">
        <BlurCircle top="-6rem" left="-6rem" />
        <BlurCircle bottom="-6rem" right="-6rem" />

        <h1 className="mb-4 text-2xl font-semibold text-white">Pick your seats</h1>
        <img src={assets.screenImage} alt="screen" className="mb-2 w-1/2 max-w-xs" />
        <p className="mb-10 text-sm text-gray-400">SCREEN</p>

        <div className="space-y-6">
            {rows.map((row) => (
                <div key={row} className="flex items-center justify-center gap-3">
                    {Array.from({ length: seatsPerRow }, (_, i) => (
                        <SeatButton key={`${row}${i + 1}`} seatId={`${row}${i + 1}`} />
                    ))}
                </div>
            ))}
        </div>

        <Button
            size="lg"
            className="mt-16 flex items-center gap-2 rounded-full"
            onClick={checkout}
        >
            Checkout
            <ArrowRight className="h-4 w-4" strokeWidth={3} />
        </Button>
    </section>
</div>
);
};

export default SeatLayout;
