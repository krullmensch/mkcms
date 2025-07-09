'use client'

import React, { useState, useRef, useEffect } from 'react'

const InfoButton: React.FC = () => {
  const [isInfoOpen, setIsInfoOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const infoOverlayRef = useRef<HTMLDivElement>(null)

  const handleInfoToggle = () => {
    if (isInfoOpen) {
      setIsClosing(true)
      setTimeout(() => {
        setIsInfoOpen(false)
        setIsClosing(false)
      }, 300)
    } else {
      setIsInfoOpen(true)
    }
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === infoOverlayRef.current) {
      handleInfoToggle()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleInfoToggle()
    }
  }

  // Effect für globale Escape-Taste
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isInfoOpen) {
        handleInfoToggle()
      }
    }

    if (isInfoOpen) {
      document.addEventListener('keydown', handleGlobalKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown)
    }
  }, [isInfoOpen])

  return (
    <>
      {/* Info-Button */}
      <button
        className={`info-button ${isInfoOpen ? 'hidden' : ''}`}
        onClick={handleInfoToggle}
        aria-label="Impressum öffnen"
        data-tooltip="Impressum"
      >
        <span className="info-icon">i</span>
        <span className="info-tooltip">Impressum</span>
      </button>

      {/* Info-Overlay */}
      {isInfoOpen && (
        <div
          ref={infoOverlayRef}
          className={`info-overlay ${isClosing ? 'closing' : ''}`}
          onClick={handleOverlayClick}
          tabIndex={-1}
        >
          <div className="info-container">
            <div className="info-header">
              <h2>Impressum</h2>
              <button
                onClick={handleInfoToggle}
                className="info-close"
                aria-label="Impressum schließen"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="info-content">
              <div className="impressum-section">
                <h3>Angaben gemäß § 5 TMG</h3>
                <p>
                  Marvin Krullmann
                  <br />
                  Arndtstraße 11
                  <br />
                  33615 Bielefeld
                  <br />
                  Deutschland
                </p>
              </div>

              <div className="impressum-section">
                <h3>Kontakt</h3>
                <p>
                  E-Mail: marvin@krullmann.com
                  <br />
                  Telefon: +49 0151 50 60 33 98
                </p>
              </div>

              <div className="impressum-section">
                <h3>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h3>
                <p>
                  Marvin Krullmann
                  <br />
                  Arndtstraße 11
                  <br />
                  33615 Bielefeld
                  <br />
                  Deutschland
                </p>
              </div>

              <div className="impressum-section">
                <h3>Haftungsausschluss</h3>
                <h4>Haftung für Inhalte</h4>
                <p>
                  Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen
                  Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir
                  als Diensteanbieter jedoch nicht unter der Verpflichtung, übermittelte oder
                  gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen,
                  die auf eine rechtswidrige Tätigkeit hinweisen.
                </p>
                <p>
                  Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach
                  den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung
                  ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung
                  möglich.
                </p>

                <h4>Haftung für Links</h4>
                <p>
                  Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir
                  keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine
                  Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige
                  Anbieter oder Betreiber der Seiten verantwortlich.
                </p>
              </div>

              <div className="impressum-section">
                <h3>Urheberrecht</h3>
                <p>
                  Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten
                  unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung,
                  Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes
                  bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
                </p>
                <p>
                  Alle Kunstwerke, Fotografien und Videos auf dieser Website sind urheberrechtlich
                  geschützt und Eigentum von Marvin Krullmann. Eine Verwendung ohne ausdrückliche
                  Genehmigung ist nicht gestattet.
                </p>
              </div>

              <div className="impressum-section">
                <h3>Datenschutz</h3>
                <p>
                  Diese Website erhebt keine personenbezogenen Daten. Es werden keine Cookies
                  gesetzt und keine Tracking-Technologien verwendet. Ihr Besuch auf dieser Website
                  ist vollständig anonym.
                </p>
              </div>

              <div className="impressum-section">
                <h3>Verwendete Schriftarten und Lizenzen</h3>
                <p>
                  Diese Website verwendet die Schriftart &quot;Questrial&quot; von{' '}
                  <a
                    href="https://fonts.google.com/specimen/Questrial"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'inherit', textDecoration: 'underline' }}
                  >
                    Google Fonts
                  </a>
                  , entwickelt von Joe Prince. Die Schriftart ist lizenziert unter der{' '}
                  <a
                    href="https://scripts.sil.org/OFL"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'inherit', textDecoration: 'underline' }}
                  >
                    SIL Open Font License 1.1
                  </a>
                  .
                </p>
                <p>
                  Die Schriftart wird über Google Fonts CDN bereitgestellt. Beim Laden werden Daten
                  an Google übertragen. Weitere Informationen in den{' '}
                  <a
                    href="https://developers.google.com/fonts/faq#what_does_using_the_google_fonts_api_mean_for_the_privacy_of_my_users"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'inherit', textDecoration: 'underline' }}
                  >
                    Google Fonts Datenschutzbestimmungen
                  </a>
                  .
                </p>
              </div>

              <div className="impressum-footer">
                <p>
                  <small>Stand: {new Date().toLocaleDateString('de-DE')}</small>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default InfoButton
