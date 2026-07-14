import React, { useState, useEffect } from "react";

interface TimeUnit {
  value: number;
  label: string;
}

interface CountdownTimerProps {
  targetTimeISO: string; // ISO string like '2025-08-01T03:46:05Z'
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetTimeISO }) => {
  const [timeLeft, setTimeLeft] = useState<TimeUnit[]>([
    { value: 0, label: "Jam" },
    { value: 0, label: "Menit" },
    { value: 0, label: "Detik" },
  ]);

  useEffect(() => {
    const target = new Date(targetTimeISO);
    let interval: NodeJS.Timeout;

    const updateTimeLeft = () => {
      const now = new Date().getTime();
      const distance = target.getTime() - now;

      if (distance > 0) {
        const hours = Math.floor(distance / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft([
          { value: hours, label: "Jam" },
          { value: minutes, label: "Menit" },
          { value: seconds, label: "Detik" },
        ]);
      } else {
        setTimeLeft([
          { value: 0, label: "Jam" },
          { value: 0, label: "Menit" },
          { value: 0, label: "Detik" },
        ]);
      }
    };

    updateTimeLeft();
    interval = setInterval(updateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [targetTimeISO]);

  return (
    <div className="flex justify-center items-center gap-4">
      {timeLeft.map((unit, index) => (
        <React.Fragment key={unit.label}>
          <div className="text-center space-y-1">
            <div className="bg-red-500 text-white text-xl font-bold rounded-lg w-10 h-10 flex items-center justify-center shadow-lg">
              {unit.value.toString().padStart(2, "0")}
            </div>
            <p className="text-sm font-medium text-white">{unit?.label}</p>
          </div>
          {index < timeLeft.length - 1 && <div className="text-xl font-bold text-white">:</div>}
        </React.Fragment>
      ))}
    </div>
  );
};

export default CountdownTimer;
