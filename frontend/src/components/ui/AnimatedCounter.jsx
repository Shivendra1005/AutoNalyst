import { useEffect, useState, useRef } from 'react'

function AnimatedCounter({ target = 0, duration = 1200, suffix = '', prefix = '', className = '' }) {
  const [value, setValue] = useState(0)
  const frameRef = useRef()

  useEffect(() => {
    const startTime = performance.now()
    const start = 0
    const end = target

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 4)
      const current = Math.round(start + (end - start) * eased)
      setValue(current)

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick)
      }
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [target, duration])

  return (
    <span className={className}>
      {prefix}{value}{suffix}
    </span>
  )
}

export default AnimatedCounter
