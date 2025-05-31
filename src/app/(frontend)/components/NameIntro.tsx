'use client'

import React, { useEffect, useState } from 'react'

interface NameIntroProps {
  onAnimationComplete: () => void
}

const NameIntro: React.FC<NameIntroProps> = ({ onAnimationComplete }) => {
  const [isVisible, setIsVisible] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Starte die Animation nach einer kurzen Verzögerung
    const showTimer = setTimeout(() => {
      setIsAnimating(true)
    }, 800) // Etwas länger warten für bessere UX

    // Starte die Ausblend-Animation nach 1.2 Sekunden
    const hideTimer = setTimeout(() => {
      setIsAnimating(false)
      // Entferne die Komponente nach der Animation
      setTimeout(() => {
        setIsVisible(false)
        onAnimationComplete()
      }, 1000) // Animation dauert 1 Sekunde
    }, 2000) // Insgesamt 2 Sekunden sichtbar

    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
    }
  }, [onAnimationComplete])

  if (!isVisible) return null

  return (
    <div className={`name-intro ${isAnimating ? 'animating' : ''}`}>
      <div className="name-intro-content">
        <div className="name-line first-name">MARVIN</div>
        <div className="name-line last-name">KRULLMANN</div>
      </div>
      
      <style jsx>{`
        .name-intro {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: var(--bg-color);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          transition: opacity 1s ease-out;
        }

        .name-intro.animating {
          opacity: 0;
          pointer-events: none;
        }

        .name-intro-content {
          text-align: center;
          transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .name-intro.animating .name-intro-content {
          transform: translate(-50vw, -45vh) scale(0.5);
          position: absolute;
          top: calc(var(--spacing-md) + 1rem);
          left: var(--spacing-md);
        }

        .name-line {
          font-size: clamp(3rem, 12vw, 8rem);
          font-weight: 400;
          line-height: 0.9;
          color: var(--text-color);
          margin: 0;
          transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .name-intro.animating .name-line {
          font-size: 2rem;
          display: inline;
          margin-right: 0.5rem;
        }

        .name-intro.animating .last-name {
          margin-right: 0;
        }

        @media (max-width: 768px) {
          .name-line {
            font-size: clamp(2.5rem, 10vw, 6rem);
          }
          
          .name-intro.animating .name-line {
            font-size: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .name-line {
            font-size: clamp(2rem, 8vw, 4rem);
          }
          
          .name-intro.animating .name-line {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </div>
  )
}

export default NameIntro
