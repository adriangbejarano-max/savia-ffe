import { ReactNode } from "react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[2rem] border border-white/80 bg-white/85 p-6 shadow-xl shadow-slate-200/60 backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  );
}

export function StatCard({
  title,
  value,
  note,
}: {
  title: string;
  value: string | number;
  note?: string;
}) {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#dc001b]/10" />
      <p className="relative text-sm font-bold text-slate-500">{title}</p>
      <p className="relative mt-3 text-5xl font-black tracking-tight text-slate-950">
        {value}
      </p>
      {note ? (
        <p className="relative mt-3 text-sm font-semibold text-[#dc001b]">
          {note}
        </p>
      ) : null}
    </Card>
  );
}