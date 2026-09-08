import { useEffect, useState } from "react";

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-GB", { hour12: false });
}

export default function LiveClock() {
  const [time, setTime] = useState(() => formatTime(new Date()));

  useEffect(() => {
    const id = setInterval(() => setTime(formatTime(new Date())), 1000);
    return () => clearInterval(id);
  }, []);

  return <span className="nav-clock">{time}</span>;
}
