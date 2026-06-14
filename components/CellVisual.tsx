export function CellVisual({ topicId, labels }: { topicId: string; labels: string[] }) {
  const plantMode = topicId === "eukaryotic-cells" || topicId === "cell-envelope";
  const trafficMode = topicId === "endomembrane-system";
  const energyMode = topicId === "energy-organelles";
  const prokaryoteMode = topicId === "prokaryotic-cells";

  return (
    <div className="relative overflow-hidden rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="relative min-h-[310px] rounded-md bg-[#f4f2ea] p-3">
          <svg viewBox="0 0 680 360" role="img" aria-label="Animated cell concept visual" className="h-full min-h-[300px] w-full">
            <defs>
              <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#17201c" floodOpacity="0.16" />
              </filter>
            </defs>

            {prokaryoteMode ? (
              <g filter="url(#softShadow)">
                <ellipse cx="330" cy="180" rx="245" ry="116" fill="#f5d8a9" stroke="#9d6b2f" strokeWidth="7" />
                <path d="M140 153 C240 93 426 85 525 151" fill="none" stroke="#f0b255" strokeWidth="14" opacity="0.48" />
                <path d="M260 183 C286 136 375 132 405 176 C443 230 300 248 260 183Z" fill="none" stroke="#7d4f73" strokeWidth="8" />
                <circle cx="211" cy="176" r="9" fill="#27768a" />
                <circle cx="456" cy="219" r="9" fill="#27768a" />
                <circle cx="387" cy="109" r="7" fill="#27768a" />
                <path d="M573 182 C626 181 654 210 668 250" fill="none" stroke="#386a55" strokeWidth="12" strokeLinecap="round" />
                <text x="285" y="172" className="svg-label">nucleoid</text>
                <text x="180" y="214" className="svg-label">70S ribosomes</text>
                <text x="462" y="266" className="svg-label">flagellum</text>
              </g>
            ) : trafficMode ? (
              <g filter="url(#softShadow)">
                <rect x="79" y="110" width="155" height="118" rx="26" fill="#a8d2cf" stroke="#27768a" strokeWidth="6" />
                <rect x="273" y="112" width="134" height="116" rx="30" fill="#f1c0b6" stroke="#c95145" strokeWidth="6" />
                <circle cx="505" cy="126" r="45" fill="#d7c4df" stroke="#7d4f73" strokeWidth="6" />
                <circle cx="535" cy="236" r="55" fill="#f5d8a9" stroke="#d99a2b" strokeWidth="6" />
                <path d="M235 168 L269 168" stroke="#17201c" strokeWidth="6" strokeLinecap="round" />
                <path d="M410 168 C438 156 456 139 473 130" stroke="#17201c" strokeWidth="6" strokeLinecap="round" />
                <path d="M407 184 C452 200 475 219 492 234" stroke="#17201c" strokeWidth="6" strokeLinecap="round" />
                <text x="127" y="176" className="svg-label">ER</text>
                <text x="306" y="178" className="svg-label">Golgi</text>
                <text x="474" y="133" className="svg-label">lysosome</text>
                <text x="507" y="244" className="svg-label">vacuole</text>
              </g>
            ) : energyMode ? (
              <g filter="url(#softShadow)">
                <ellipse cx="188" cy="184" rx="104" ry="65" fill="#f1c0b6" stroke="#c95145" strokeWidth="7" />
                <path d="M120 185 C147 144 174 224 205 182 C231 145 252 222 278 181" fill="none" stroke="#9f372f" strokeWidth="8" strokeLinecap="round" />
                <ellipse cx="410" cy="183" rx="104" ry="70" fill="#b8d7a8" stroke="#386a55" strokeWidth="7" />
                <path d="M356 158 H463 M350 183 H468 M360 208 H457" stroke="#6d9c42" strokeWidth="8" strokeLinecap="round" />
                <circle cx="572" cy="166" r="24" fill="#27768a" opacity="0.92" />
                <circle cx="606" cy="214" r="18" fill="#27768a" opacity="0.75" />
                <text x="139" y="275" className="svg-label">mitochondrion</text>
                <text x="371" y="275" className="svg-label">chloroplast</text>
                <text x="552" y="275" className="svg-label">ribosomes</text>
              </g>
            ) : (
              <g filter="url(#softShadow)">
                <ellipse cx="315" cy="178" rx="229" ry="120" fill={plantMode ? "#d8e8c7" : "#c7e6ea"} stroke={plantMode ? "#386a55" : "#27768a"} strokeWidth="8" />
                {plantMode ? <rect x="84" y="63" width="462" height="235" rx="34" fill="none" stroke="#8aa35e" strokeWidth="10" opacity="0.7" /> : null}
                <circle cx="292" cy="170" r="55" fill="#d7c4df" stroke="#7d4f73" strokeWidth="6" />
                <ellipse cx="407" cy="126" rx="47" ry="23" fill="#f1c0b6" stroke="#c95145" strokeWidth="5" />
                <ellipse cx="417" cy="224" rx="55" ry="30" fill="#f5d8a9" stroke="#d99a2b" strokeWidth="5" />
                <path d="M193 156 C222 112 242 223 198 232 C156 240 151 181 193 156Z" fill="#a8d2cf" stroke="#27768a" strokeWidth="5" />
                <circle cx="513" cy="178" r="18" fill="#386a55" opacity="0.8" className="cell-pulse" />
                <text x="263" y="173" className="svg-label">nucleus</text>
                <text x="376" y="126" className="svg-label">organelle</text>
                {plantMode ? <text x="104" y="92" className="svg-label">cell wall</text> : null}
              </g>
            )}
          </svg>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-moss">Visual anchors</p>
          <div className="grid gap-2">
            {labels.map((label) => (
              <div key={label} className="flex items-center gap-3 rounded-md border border-stone-200 bg-[#fbfaf6] px-3 py-2 text-sm font-semibold text-stone-700">
                <span className="h-2.5 w-2.5 rounded-full bg-coral" aria-hidden="true" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
