import { useRef, useCallback, useState } from 'react'

interface UseDragScrollOptions {
  direction?: 'horizontal' | 'vertical' | 'both'
  sensitivity?: number
  momentumMultiplier?: number
}

export const useDragScroll = <T extends HTMLElement>({
  direction = 'horizontal',
  sensitivity = 1,
  momentumMultiplier = 0.95,
}: UseDragScrollOptions = {}) => {
  const ref = useRef<T>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 })
  const [scrollStart, setScrollStart] = useState({ left: 0, top: 0 })
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 })
  const [velocity, setVelocity] = useState({ x: 0, y: 0 })
  const momentumRAF = useRef<number | null>(null)

  const applyMomentum = useCallback(() => {
    if (!ref.current || (Math.abs(velocity.x) < 0.5 && Math.abs(velocity.y) < 0.5)) {
      if (momentumRAF.current) {
        cancelAnimationFrame(momentumRAF.current)
        momentumRAF.current = null
      }
      return
    }

    if (direction === 'horizontal' || direction === 'both') {
      ref.current.scrollLeft += velocity.x
    }

    if (direction === 'vertical' || direction === 'both') {
      ref.current.scrollTop += velocity.y
    }

    setVelocity((prev) => ({
      x: prev.x * momentumMultiplier,
      y: prev.y * momentumMultiplier,
    }))

    momentumRAF.current = requestAnimationFrame(applyMomentum)
  }, [velocity, direction, momentumMultiplier])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return

    // Stoppe eventuelles Momentum
    if (momentumRAF.current) {
      cancelAnimationFrame(momentumRAF.current)
      momentumRAF.current = null
    }

    setIsDragging(true)
    setStartPosition({ x: e.clientX, y: e.clientY })
    setLastPosition({ x: e.clientX, y: e.clientY })
    setScrollStart({
      left: ref.current.scrollLeft,
      top: ref.current.scrollTop,
    })
    setVelocity({ x: 0, y: 0 })

    // Verhindere Textauswahl während des Draggings
    e.preventDefault()
  }, [])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !ref.current) return

      const deltaX = (startPosition.x - e.clientX) * sensitivity
      const deltaY = (startPosition.y - e.clientY) * sensitivity

      // Berechne Geschwindigkeit für Momentum
      const velocityX = lastPosition.x - e.clientX
      const velocityY = lastPosition.y - e.clientY
      setVelocity({ x: velocityX * 0.1, y: velocityY * 0.1 })
      setLastPosition({ x: e.clientX, y: e.clientY })

      if (direction === 'horizontal' || direction === 'both') {
        ref.current.scrollLeft = scrollStart.left + deltaX
      }

      if (direction === 'vertical' || direction === 'both') {
        ref.current.scrollTop = scrollStart.top + deltaY
      }
    },
    [isDragging, startPosition, scrollStart, direction, sensitivity, lastPosition],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    // Starte Momentum-Scrolling
    if (Math.abs(velocity.x) > 1 || Math.abs(velocity.y) > 1) {
      applyMomentum()
    }
  }, [velocity, applyMomentum])

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false)
    // Starte Momentum-Scrolling auch bei mouse leave
    if (Math.abs(velocity.x) > 1 || Math.abs(velocity.y) > 1) {
      applyMomentum()
    }
  }, [velocity, applyMomentum])

  // Touch Events für Mobile Support
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!ref.current || e.touches.length !== 1) return

    // Stoppe eventuelles Momentum
    if (momentumRAF.current) {
      cancelAnimationFrame(momentumRAF.current)
      momentumRAF.current = null
    }

    const touch = e.touches[0]
    setIsDragging(true)
    setStartPosition({ x: touch.clientX, y: touch.clientY })
    setLastPosition({ x: touch.clientX, y: touch.clientY })
    setScrollStart({
      left: ref.current.scrollLeft,
      top: ref.current.scrollTop,
    })
    setVelocity({ x: 0, y: 0 })
  }, [])

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging || !ref.current || e.touches.length !== 1) return

      const touch = e.touches[0]
      const deltaX = (startPosition.x - touch.clientX) * sensitivity
      const deltaY = (startPosition.y - touch.clientY) * sensitivity

      // Berechne Geschwindigkeit für Momentum
      const velocityX = lastPosition.x - touch.clientX
      const velocityY = lastPosition.y - touch.clientY
      setVelocity({ x: velocityX * 0.1, y: velocityY * 0.1 })
      setLastPosition({ x: touch.clientX, y: touch.clientY })

      if (direction === 'horizontal' || direction === 'both') {
        ref.current.scrollLeft = scrollStart.left + deltaX
      }

      if (direction === 'vertical' || direction === 'both') {
        ref.current.scrollTop = scrollStart.top + deltaY
      }

      // Verhindere Standard-Scroll-Verhalten
      e.preventDefault()
    },
    [isDragging, startPosition, scrollStart, direction, sensitivity, lastPosition],
  )

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
    // Starte Momentum-Scrolling
    if (Math.abs(velocity.x) > 1 || Math.abs(velocity.y) > 1) {
      applyMomentum()
    }
  }, [velocity, applyMomentum])

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
    },
  }
}
