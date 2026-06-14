const logoOptions = [
  {
    name: "Book Star",
    note: "Friendly school-app logo",
    colors: ["#0ea5e9", "#16a34a", "#f59e0b"],
  },
  {
    name: "Learning Path",
    note: "Best for progress focus",
    colors: ["#a855f7", "#0ea5e9", "#ef4444"],
  },
  {
    name: "NCERT Compass",
    note: "Best for subject navigation",
    colors: ["#14213d", "#16a34a", "#f59e0b"],
  },
];

function LogoMark({ optionIndex }: { optionIndex: number }) {
  if (optionIndex === 1) {
    return (
      <svg viewBox="0 0 96 96" role="img" aria-label="Learning Path logo option" className="h-20 w-20">
        <rect width="96" height="96" rx="18" fill="#f5f3ff" />
        <path d="M23 67C36 35 58 69 73 29" fill="none" stroke="#a855f7" strokeWidth="8" strokeLinecap="round" />
        <circle cx="23" cy="67" r="8" fill="#0ea5e9" />
        <circle cx="48" cy="51" r="8" fill="#16a34a" />
        <circle cx="73" cy="29" r="8" fill="#ef4444" />
        <path d="M65 28h16M73 20v16" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" />
      </svg>
    );
  }

  if (optionIndex === 2) {
    return (
      <svg viewBox="0 0 96 96" role="img" aria-label="NCERT Compass logo option" className="h-20 w-20">
        <rect width="96" height="96" rx="18" fill="#ecfdf5" />
        <circle cx="48" cy="48" r="30" fill="#ffffff" stroke="#14213d" strokeWidth="6" />
        <path d="M56 20 47 48 40 76 49 48Z" fill="#16a34a" />
        <path d="M20 40 48 49 76 56 48 47Z" fill="#f59e0b" opacity="0.9" />
        <circle cx="48" cy="48" r="6" fill="#0ea5e9" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 96 96" role="img" aria-label="Book Star logo option" className="h-20 w-20">
      <rect width="96" height="96" rx="18" fill="#e0f2fe" />
      <path d="M22 25h26a11 11 0 0 1 11 11v36H35a13 13 0 0 1-13-13V25Z" fill="#ffffff" stroke="#0ea5e9" strokeWidth="6" />
      <path d="M59 31h15v39H59V31Z" fill="#dcfce7" stroke="#16a34a" strokeWidth="6" />
      <path d="m48 24 4 10 11 1-8 7 2 11-9-6-10 6 3-11-8-7 11-1Z" fill="#f59e0b" />
    </svg>
  );
}

export function LogoOptions() {
  return (
    <section>
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-plum">Logo options</p>
      <h2 className="mt-1 text-xl font-bold">Choose a style for the app</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {logoOptions.map((option, index) => (
          <div key={option.name} className="rounded-md border border-sky-100 bg-white p-3 shadow-sm">
            <LogoMark optionIndex={index} />
            <p className="mt-3 font-bold">{option.name}</p>
            <p className="mt-1 text-sm text-stone-600">{option.note}</p>
            <div className="mt-3 flex gap-1">
              {option.colors.map((color) => (
                <span key={color} className="h-5 w-5 rounded-full border border-white shadow-sm" style={{ backgroundColor: color }} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
