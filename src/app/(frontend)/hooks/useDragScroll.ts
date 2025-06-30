import { useRef, useCallback, useState, useEffect } from 'react'

interface UseDragScrollOptions {
  direction?: 'horizontal' | 'vertical' | 'both'
  sensitivity?: number
  momentumDecay?: number
  minMomentumThreshold?: number
  maxMomentumVelocity?: number
}

interface Position {
  x: number
  y: number
}

interface VelocityPoint {
  position: Position
  timestamp: number
}

export const useDragScroll = <T extends HTMLElement>({
  direction = 'horizontal',
  sensitivity = 1,
  momentumDecay = 0.95, // Stärkere Bremsung für realistischeres Apple-Verhalten
  minMomentumThreshold = 0.5,
  maxMomentumVelocity = 50,
}: UseDragScrollOptions = {}) => {
  const ref = useRef<T>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startPosition, setStartPosition] = useState<Position>({ x: 0, y: 0 })
  const [scrollStart, setScrollStart] = useState({ left: 0, top: 0 })
  const [velocity, setVelocity] = useState<Position>({ x: 0, y: 0 })

  // Für bessere Momentum-Berechnung: Speichere mehrere Punkte
  const velocityHistory = useRef<VelocityPoint[]>([])
  const momentumRAF = useRef<number | null>(null)
  const lastMoveTime = useRef<number>(0)

  // Berechne Geschwindigkeit basierend auf den letzten Bewegungen
  const calculateVelocity = useCallback(
    (currentPos: Position, currentTime: number): Position => {
      // Füge aktuellen Punkt hinzu
      velocityHistory.current.push({
        position: currentPos,
        timestamp: currentTime,
      })

      // Behalte nur die letzten 4 Punkte für bessere Glättung und Responsivität
      if (velocityHistory.current.length > 4) {
        velocityHistory.current.shift()
      }

      // Berechne Durchschnittsgeschwindigkeit über die letzten Punkte
      if (velocityHistory.current.length < 2) {
        return { x: 0, y: 0 }
      }

      const recent = velocityHistory.current[velocityHistory.current.length - 1]
      const older = velocityHistory.current[0]

      const timeDiff = recent.timestamp - older.timestamp
      if (timeDiff === 0) return { x: 0, y: 0 }

      // Verbesserte Velocity-Berechnung mit Gewichtung der neueren Werte
      let totalVelocityX = 0
      let totalVelocityY = 0
      let totalWeight = 0

      for (let i = 1; i < velocityHistory.current.length; i++) {
        const curr = velocityHistory.current[i]
        const prev = velocityHistory.current[i - 1]
        const dt = curr.timestamp - prev.timestamp

        if (dt > 0) {
          const vx = ((curr.position.x - prev.position.x) / dt) * 16 // 60fps normalisiert
          const vy = ((curr.position.y - prev.position.y) / dt) * 16

          // Gewichte neuere Werte höher
          const weight = i / (velocityHistory.current.length - 1)
          totalVelocityX += vx * weight
          totalVelocityY += vy * weight
          totalWeight += weight
        }
      }

      const avgVelocityX = totalWeight > 0 ? totalVelocityX / totalWeight : 0
      const avgVelocityY = totalWeight > 0 ? totalVelocityY / totalWeight : 0

      // Begrenze maximale Geschwindigkeit
      return {
        x: Math.max(-maxMomentumVelocity, Math.min(maxMomentumVelocity, avgVelocityX)),
        y: Math.max(-maxMomentumVelocity, Math.min(maxMomentumVelocity, avgVelocityY)),
      }
    },
    [maxMomentumVelocity],
  )

  // Verbesserte Momentum-Animation mit exponentialem Decay
  const applyMomentum = useCallback(() => {
    if (
      !ref.current ||
      (Math.abs(velocity.x) < minMomentumThreshold && Math.abs(velocity.y) < minMomentumThreshold)
    ) {
      if (momentumRAF.current) {
        cancelAnimationFrame(momentumRAF.current)
        momentumRAF.current = null
      }
      setVelocity({ x: 0, y: 0 })
      return
    }

    // Smooth scrolling mit Geschwindigkeit
    if (direction === 'horizontal' || direction === 'both') {
      ref.current.scrollLeft += velocity.x
    }

    if (direction === 'vertical' || direction === 'both') {
      ref.current.scrollTop += velocity.y
    }

    // Exponentieller Decay für realistisches Apple-Verhalten
    const newVelocity = {
      x: velocity.x * momentumDecay,
      y: velocity.y * momentumDecay,
    }

    setVelocity(newVelocity)
    momentumRAF.current = requestAnimationFrame(applyMomentum)
  }, [velocity, direction, momentumDecay, minMomentumThreshold])

  // Cleanup bei unmount
  useEffect(() => {
    return () => {
      if (momentumRAF.current) {
        cancelAnimationFrame(momentumRAF.current)
      }
    }
  }, [])

  const stopMomentum = useCallback(() => {
    if (momentumRAF.current) {
      cancelAnimationFrame(momentumRAF.current)
      momentumRAF.current = null
    }
    setVelocity({ x: 0, y: 0 })
    velocityHistory.current = []
  }, [])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return

      stopMomentum()
      setIsDragging(true)

      const currentPos = { x: e.clientX, y: e.clientY }
      const currentTime = Date.now()

      setStartPosition(currentPos)
      setScrollStart({
        left: ref.current.scrollLeft,
        top: ref.current.scrollTop,
      })

      // Initialisiere Velocity History
      velocityHistory.current = [
        {
          position: currentPos,
          timestamp: currentTime,
        },
      ]
      lastMoveTime.current = currentTime

      // Verhindere Textauswahl und andere Browser-Events
      e.preventDefault()
      document.body.style.userSelect = 'none'
    },
    [stopMomentum],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !ref.current) return

      const currentTime = Date.now()
      const currentPos = { x: e.clientX, y: e.clientY }

      // Berechne Scroll-Delta
      const deltaX = (startPosition.x - e.clientX) * sensitivity
      const deltaY = (startPosition.y - e.clientY) * sensitivity

      // Scroll anwenden
      if (direction === 'horizontal' || direction === 'both') {
        ref.current.scrollLeft = scrollStart.left + deltaX
      }

      if (direction === 'vertical' || direction === 'both') {
        ref.current.scrollTop = scrollStart.top + deltaY
      }

      // Berechne neue Geschwindigkeit
      const newVelocity = calculateVelocity(currentPos, currentTime)
      setVelocity(newVelocity)

      lastMoveTime.current = currentTime
      e.preventDefault()
    },
    [isDragging, startPosition, scrollStart, direction, sensitivity, calculateVelocity],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    document.body.style.userSelect = ''

    // Starte Momentum nur wenn genug Geschwindigkeit vorhanden
    if (
      Math.abs(velocity.x) > minMomentumThreshold ||
      Math.abs(velocity.y) > minMomentumThreshold
    ) {
      applyMomentum()
    } else {
      setVelocity({ x: 0, y: 0 })
    }
  }, [velocity, applyMomentum, minMomentumThreshold])

  const handleMouseLeave = useCallback(() => {
    // Bei Mouse Leave sanft stoppen, aber Momentum beibehalten wenn dragging
    if (isDragging) {
      setIsDragging(false)
      document.body.style.userSelect = ''

      if (
        Math.abs(velocity.x) > minMomentumThreshold ||
        Math.abs(velocity.y) > minMomentumThreshold
      ) {
        applyMomentum()
      }
    }
  }, [isDragging, velocity, applyMomentum, minMomentumThreshold])

  // Global Mouse Events für bessere Drag-Erfahrung
  useEffect(() => {
    if (!isDragging) return

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!ref.current) return

      const currentTime = Date.now()
      const currentPos = { x: e.clientX, y: e.clientY }

      const deltaX = (startPosition.x - e.clientX) * sensitivity
      const deltaY = (startPosition.y - e.clientY) * sensitivity

      if (direction === 'horizontal' || direction === 'both') {
        ref.current.scrollLeft = scrollStart.left + deltaX
      }

      if (direction === 'vertical' || direction === 'both') {
        ref.current.scrollTop = scrollStart.top + deltaY
      }

      const newVelocity = calculateVelocity(currentPos, currentTime)
      setVelocity(newVelocity)

      e.preventDefault()
    }

    const handleGlobalMouseUp = () => {
      setIsDragging(false)
      document.body.style.userSelect = ''

      if (
        Math.abs(velocity.x) > minMomentumThreshold ||
        Math.abs(velocity.y) > minMomentumThreshold
      ) {
        applyMomentum()
      }
    }

    document.addEventListener('mousemove', handleGlobalMouseMove)
    document.addEventListener('mouseup', handleGlobalMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove)
      document.removeEventListener('mouseup', handleGlobalMouseUp)
    }
  }, [
    isDragging,
    startPosition,
    scrollStart,
    direction,
    sensitivity,
    calculateVelocity,
    velocity,
    applyMomentum,
    minMomentumThreshold,
  ])

  // Touch Events für Mobile Support (verbessert)
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!ref.current || e.touches.length !== 1) return

      stopMomentum()
      const touch = e.touches[0]
      setIsDragging(true)

      const currentPos = { x: touch.clientX, y: touch.clientY }
      const currentTime = Date.now()

      setStartPosition(currentPos)
      setScrollStart({
        left: ref.current.scrollLeft,
        top: ref.current.scrollTop,
      })

      velocityHistory.current = [
        {
          position: currentPos,
          timestamp: currentTime,
        },
      ]
      lastMoveTime.current = currentTime
    },
    [stopMomentum],
  )

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging || !ref.current || e.touches.length !== 1) return

      const touch = e.touches[0]
      const currentTime = Date.now()
      const currentPos = { x: touch.clientX, y: touch.clientY }

      const deltaX = (startPosition.x - touch.clientX) * sensitivity
      const deltaY = (startPosition.y - touch.clientY) * sensitivity

      if (direction === 'horizontal' || direction === 'both') {
        ref.current.scrollLeft = scrollStart.left + deltaX
      }

      if (direction === 'vertical' || direction === 'both') {
        ref.current.scrollTop = scrollStart.top + deltaY
      }

      const newVelocity = calculateVelocity(currentPos, currentTime)
      setVelocity(newVelocity)

      lastMoveTime.current = currentTime
      e.preventDefault()
    },
    [isDragging, startPosition, scrollStart, direction, sensitivity, calculateVelocity],
  )

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)

    if (
      Math.abs(velocity.x) > minMomentumThreshold ||
      Math.abs(velocity.y) > minMomentumThreshold
    ) {
      applyMomentum()
    }
  }, [velocity, applyMomentum, minMomentumThreshold])

  // Wheel Event für natürliches Maus-Scrolling
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (!ref.current) return

      // Stoppe drag momentum bei wheel events
      stopMomentum()

      // Verbesserte Wheel-Geschwindigkeit mit Momentum-Simulation
      let scrollAmount = 0

      if (direction === 'horizontal' || direction === 'both') {
        // Verwende deltaX falls vorhanden, sonst deltaY für horizontales Scrolling
        scrollAmount = e.deltaX !== 0 ? e.deltaX : e.deltaY

        // Angepasste Sensitivität für natürlicheres Scrolling
        const wheelSensitivity = 0.8
        const finalScrollAmount = scrollAmount * wheelSensitivity

        // Smooth scroll animation mit requestAnimationFrame
        const startScrollLeft = ref.current.scrollLeft
        const targetScrollLeft = startScrollLeft + finalScrollAmount

        // Animierte Scroll-Bewegung für smootheres Wheel-Scrolling
        let rafId: number | undefined
        const animateScroll = () => {
          if (!ref.current) return

          const currentScrollLeft = ref.current.scrollLeft
          const diff = targetScrollLeft - currentScrollLeft

          if (Math.abs(diff) < 1) {
            ref.current.scrollLeft = targetScrollLeft
            return
          }

          ref.current.scrollLeft = currentScrollLeft + diff * 0.15 // Easing Factor
          rafId = requestAnimationFrame(animateScroll)
        }

        // Starte Animation
        animateScroll()
      }

      e.preventDefault()
    },
    [direction, stopMomentum],
  )

  return {
    ref,
    isDragging,
    events: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseLeave,
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onWheel: handleWheel,
    },
  }
}
