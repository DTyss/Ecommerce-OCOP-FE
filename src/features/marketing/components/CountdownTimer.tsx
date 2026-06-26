import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export function CountdownTimer({ endsAt }: { endsAt: string }) {
  const { t } = useTranslation("storefront");
  const [remaining, setRemaining] = useState(() => getRemaining(endsAt));

  useEffect(() => {
    const timer = window.setInterval(() => setRemaining(getRemaining(endsAt)), 1000);
    return () => window.clearInterval(timer);
  }, [endsAt]);

  return (
    <div className="flex items-center gap-2" aria-label={t("marketing.flashSale.countdown")}>
      <TimeBox value={remaining.hours} />
      <span className="text-ocop-red font-bold">:</span>
      <TimeBox value={remaining.minutes} />
      <span className="text-ocop-red font-bold">:</span>
      <TimeBox value={remaining.seconds} />
    </div>
  );
}

function TimeBox({ value }: { value: number }) {
  return (
    <span className="bg-ocop-red flex h-8 min-w-8 items-center justify-center rounded-lg px-1 text-sm font-bold text-white">
      {String(value).padStart(2, "0")}
    </span>
  );
}

function getRemaining(endsAt: string) {
  const milliseconds = Math.max(new Date(endsAt).getTime() - Date.now(), 0);
  const seconds = Math.floor(milliseconds / 1000);
  return {
    hours: Math.floor(seconds / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
  };
}
