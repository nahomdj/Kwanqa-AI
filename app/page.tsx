import Link from 'next/link';
import { FadeInOnScroll } from '@/components/FadeInOnScroll';

export default function Home() {
  return (
    <main className="app-main">
      {/* HERO ONLY */}
      <section className="band-none">
        <div className="section-shell">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 40,
              alignItems: 'center',
            }}
          >
            {/* Left copy */}
            <FadeInOnScroll>
              <div style={{ flex: '1 1 320px', maxWidth: 540 }}>
                <div className="chip">
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '999px',
                      backgroundColor: 'var(--primary-color)',
                    }}
                  />
                  <span>
                    Ethiopian language tutor · Local, private, no cloud
                  </span>
                </div>

                <h1
                  style={{
                    marginTop: 16,
                    marginBottom: 12,
                    fontSize: 'clamp(32px, 4vw, 42px)',
                    lineHeight: 1.2,
                    fontWeight: 600,
                  }}
                >
                  Learn{' '}
                  <span
                    style={{
                      backgroundImage:
                        'linear-gradient(to right, var(--primary-color), var(--accent-color))',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                    }}
                  >
                    Amharic and English
                  </span>{' '}
                  with your own private AI tutor that runs entirely on your laptop.
                </h1>

                <p
                  className="text-secondary"
                  style={{ fontSize: 14, marginBottom: 20 }}
                >
                  Kwanqa helps you practice both Amharic and English. Whether
                  you&apos;re an Ethiopian wanting to improve your English, or
                  learning Amharic as a second language, Kwanqa guides you
                  through short, focused sessions—with examples, corrections, and
                  explanations, all locally on your device.
                </p>

                <div
                  style={{
                    display: 'flex',
                    gap: 12,
                    flexWrap: 'wrap',
                    marginBottom: 8,
                  }}
                >
                  <Link href="/tutor">
                    <button className="btn btn-accent">Open the Tutor</button>
                  </Link>
                  <Link href="/courses">
                    <button className="btn-ghost">Explore Courses</button>
                  </Link>
                  <Link href="/about">
                    <button className="btn-ghost">Learn more about Kwanqa</button>
                  </Link>
                </div>

                <p style={{ fontSize: 11 }} className="text-secondary">
                  Powered by a local model. No accounts, no tracking—just practice
                  in Amharic and English.
                </p>
              </div>
            </FadeInOnScroll>

            {/* Right preview card */}
            <FadeInOnScroll delay={0.1}>
              <div style={{ flex: '1 1 280px', maxWidth: 420 }}>
                <div className="card">
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 8,
                      fontSize: 11,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                    }}
                  >
                    <span className="text-secondary">Live tutor preview</span>
                    <span
                      style={{
                        fontSize: 10,
                        padding: '2px 8px',
                        borderRadius: 999,
                        backgroundColor: 'var(--base-color)',
                        border: '1px solid var(--border-soft)',
                      }}
                    >
                      Local · Private
                    </span>
                  </div>
                  <div className="card-soft" style={{ fontSize: 11 }}>
                    <div style={{ textAlign: 'right', marginBottom: 6 }}>
                      <span className="chat-bubble-user">
                        I&apos;m new to Amharic. Can we start with greetings and
                        simple replies?
                      </span>
                    </div>
                    <div style={{ marginBottom: 6 }}>
                      <span className="chat-bubble-assistant">
                        ሰላም! እንኳን ደህና መጣህ።
                      </span>
                    </div>
                    <p
                      className="text-secondary"
                      style={{ fontSize: 11, marginBottom: 4 }}
                    >
                      <strong>Transliteration:</strong> selam! enkwan dehna metah.
                    </p>
                    <p className="text-secondary" style={{ fontSize: 11 }}>
                      <strong>English:</strong> “Hello! Welcome.” We can practice
                      both Amharic and English, depending on your goal.
                    </p>
                  </div>
                </div>
              </div>
            </FadeInOnScroll>
          </div>
        </div>
      </section>

      {/* Design Prompt feature card */}
      <section className="band-soft">
        <div className="section-shell">
          <FadeInOnScroll>
            <div
              className="card"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 20,
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ flex: '1 1 280px' }}>
                <div className="chip" style={{ marginBottom: 10 }}>
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '999px',
                      backgroundColor: 'var(--accent-color)',
                    }}
                  />
                  <span>New · Website Design</span>
                </div>
                <h2 style={{ fontSize: 16, margin: '0 0 8px' }}>
                  Generate a Website Design Prompt
                </h2>
                <p className="text-secondary" style={{ fontSize: 13, margin: 0 }}>
                  Describe your website idea and Kwanqa AI will craft a detailed
                  design prompt ready to use with Midjourney, Stable Diffusion,
                  Figma AI, or your designer.
                </p>
              </div>
              <Link href="/design-prompt">
                <button className="btn btn-accent">Try Design Prompt</button>
              </Link>
            </div>
          </FadeInOnScroll>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="site-footer-inner">
          <span className="text-secondary">
            © {new Date().getFullYear()} Kwanqa AI. All rights reserved.
          </span>
          <nav className="site-footer-nav">
            <Link
              href="/"
              style={{ color: 'var(--secondary-text)', textDecoration: 'none' }}
            >
              Home
            </Link>
            <Link
              href="/tutor"
              style={{ color: 'var(--secondary-text)', textDecoration: 'none' }}
            >
              Tutor
            </Link>
            <Link
              href="/courses"
              style={{ color: 'var(--secondary-text)', textDecoration: 'none' }}
            >
              Courses
            </Link>
            <Link
              href="/design-prompt"
              style={{ color: 'var(--secondary-text)', textDecoration: 'none' }}
            >
              Design Prompt
            </Link>
            <Link
              href="/about"
              style={{ color: 'var(--secondary-text)', textDecoration: 'none' }}
            >
              About
            </Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}