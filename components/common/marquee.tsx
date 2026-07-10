interface MarqueeProps {
  children: React.ReactNode;
  pauseOnHover?: boolean;
  reverse?: boolean;
}

export default function Marquee({
  children,
  pauseOnHover = true,
  reverse = false,
}: MarqueeProps) {
  return (
    <div className="group bg-white py-8 flex w-full overflow-hidden p-2 select-none [mask-image:linear-gradient(to_right,transparent_0%,white_20%,white_80%,transparent_100%)]">
      <div
        className={`flex min-w-full font-display shrink-0 items-center justify-around gap-4 animate-marquee ${
          pauseOnHover ? "group-hover:[animation-play-state:paused]" : ""
        } ${reverse ? "[animation-direction:reverse]" : ""}`}
      >
        {/* Render original list */}
        {children}
        {/* Duplicate list to seamlessly bridge the gap */}
        {children}
      </div>
    </div>
  );
}
