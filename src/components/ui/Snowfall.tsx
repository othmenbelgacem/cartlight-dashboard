import type { CSSProperties } from 'react'

// Simple repeatable random numbers, so the flakes look the same on every render.
function seeded(seed: number) {
  let value = seed
  return () => {
    value = (value * 16807) % 2147483647
    return value / 2147483647
  }
}

const FLAKES = (() => {
  const random = seeded(42)
  return Array.from({ length: 48 }, () => ({
    left: random() * 100,
    size: 3 + random() * 4,
    duration: 9 + random() * 10,
    delay: -random() * 18,
    opacity: 0.4 + random() * 0.5,
    drift: (random() - 0.5) * 8,
  }))
})()

function prefersReducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
}

/** Falling snow over the whole page. It ignores the mouse and is hidden from screen readers. */
export function Snowfall() {
  // People who prefer reduced motion never see it.
  if (prefersReducedMotion()) return null

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      {FLAKES.map((flake, index) => (
        <span
          key={index}
          className="absolute top-0 animate-snow rounded-full bg-fg"
          style={
            {
              left: `${flake.left}%`,
              width: flake.size,
              height: flake.size,
              opacity: flake.opacity,
              animationDuration: `${flake.duration}s`,
              animationDelay: `${flake.delay}s`,
              '--snow-drift': `${flake.drift}vw`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}
