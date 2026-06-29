const Loader = ({ label = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <svg width="44" height="44" viewBox="0 0 48 48" className="animate-pulse">
        <path
          d="M8 40 L34 14 L40 20 L14 46 Z"
          fill="none"
          stroke="var(--color-marker)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path d="M30 18 L36 24" stroke="var(--color-marker)" strokeWidth="2.5" />
        <circle cx="8" cy="40" r="2" fill="var(--color-marker)" />
      </svg>
      <p className="margin-note text-xl">{label}</p>
    </div>
  );
};

export default Loader;