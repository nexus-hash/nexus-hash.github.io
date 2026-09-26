import { useEffect, useState } from "react";
import { contact } from "../data/resume";

const formatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: contact.timezone.iana,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

function formatTime(date: Date): string {
  return formatter.format(date);
}

/** Shows the owner's local time (see contact.timezone), not the visitor's. */
export default function LiveClock() {
  const [time, setTime] = useState(() => formatTime(new Date()));

  useEffect(() => {
    const id = setInterval(() => setTime(formatTime(new Date())), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="nav-clock" title={`Local time (${contact.timezone.iana})`}>
      <span className="nav-clock-tz">{contact.timezone.label}</span> {time}
    </span>
  );
}
