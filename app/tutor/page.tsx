'use client';

import { FormEvent, Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { FadeInOnScroll } from '@/components/FadeInOnScroll';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

type LearnerLevel = 'absolute-beginner' | 'script-aware' | 'conversational';
type LearnerGoal = 'heritage' | 'travel' | 'work' | 'curious';
type LearningMode = 'amharic' | 'english';

type LearnerProfile = {
  level: LearnerLevel;
  goal: LearnerGoal;
  learningMode: LearningMode;
};

const DEFAULT_PROFILE: LearnerProfile = {
  level: 'absolute-beginner',
  goal: 'heritage',
  learningMode: 'amharic',
};

const PROFILE_STORAGE_KEY = 'kwanqa-tutor-profile-v1';

export default function TutorPage() {
  return (
    <Suspense>
      <TutorPageInner />
    </Suspense>
  );
}

function TutorPageInner() {
  const searchParams = useSearchParams();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        "Selam! I'm your language tutor. Tell me your level, what you want to practice, and whether you prefer Amharic or English.",
    },
  ]);

  const [input, setInput] = useState('');
  const [profile, setProfile] = useState<LearnerProfile>(DEFAULT_PROFILE);
  const [isSending, setIsSending] = useState(false);

  // Load profile from localStorage on mount
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      const stored = window.localStorage.getItem(PROFILE_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as LearnerProfile;
        setProfile(prev => ({ ...prev, ...parsed }));
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // Apply ?mode=english|amharic from URL if present
  useEffect(() => {
    const modeParam = searchParams.get('mode');
    if (!modeParam) return;

    setProfile(prev => {
      const newProfile: LearnerProfile = {
        ...prev,
        learningMode: modeParam === 'english' ? 'english' : 'amharic',
      };
      try {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(newProfile));
        }
      } catch {
        // ignore
      }
      return newProfile;
    });
  }, [searchParams]);

  // Persist profile whenever it changes
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // ignore
    }
  }, [profile]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    const newMessage: ChatMessage = { role: 'user', content: input.trim() };
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setInput('');
    setIsSending(true);

    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          profile,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to reach tutor API');
      }

      const data = (await res.json()) as { reply?: string };
      const replyContent = data.reply ?? 'Sorry, something went wrong. Please try again.';

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: replyContent,
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Sorry, I had trouble connecting to the local model. Make sure Ollama is running, then try again.',
        },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  const modeLabel =
    profile.learningMode === 'amharic'
      ? 'Learn Amharic (English support)'
      : 'Learn English (from Amharic)';

  return (
    <main className="app-main">
      <section className="band-none">
        <div className="section-shell">
          <FadeInOnScroll>
            <div
              className="section-card"
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1.3fr)',
                gap: 20,
              }}
            >
              {/* Chat column */}
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 8,
                    gap: 8,
                  }}
                >
                  <h1 style={{ fontSize: 18, margin: 0 }}>Tutor</h1>
                  {/* Mode pill */}
                  <span
                    style={{
                      fontSize: 10,
                      padding: '4px 10px',
                      borderRadius: 999,
                      border: '1px solid var(--border-soft)',
                      backgroundColor: 'var(--base-variant)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Mode: <strong>{modeLabel}</strong>
                  </span>
                </div>

                <p className="text-secondary" style={{ fontSize: 12, marginBottom: 12 }}>
                  Practice short conversations in Amharic and English. Set your level and goal on
                  the right; I&apos;ll tailor explanations and corrections to match.
                </p>

                <div
                  style={{
                    borderRadius: 16,
                    border: '1px solid var(--border-soft)',
                    padding: 12,
                    backgroundColor: 'var(--base-color)',
                    maxHeight: 420,
                    overflowY: 'auto',
                    fontSize: 13,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                  }}
                >
                  {messages.map((m, idx) => (
                    <div
                      key={idx}
                      style={{
                        alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '90%',
                      }}
                    >
                      <div
                        style={{
                          padding: '6px 10px',
                          borderRadius: 12,
                          backgroundColor:
                            m.role === 'user' ? 'var(--primary-color)' : 'var(--base-variant)',
                          color: m.role === 'user' ? '#fff' : 'var(--text-color)',
                          whiteSpace: 'pre-wrap',
                        }}
                      >
                        {m.content}
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSubmit} style={{ marginTop: 10 }}>
                  <textarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder={
                      profile.learningMode === 'amharic'
                        ? 'Ask in English or Amharic. Example: “Can we practice ordering coffee in Amharic?”'
                        : 'Ask in Amharic or English. Example: “እባክህ የስራ ቃላት በእንግሊዝኛ እንለማር?”'
                    }
                    style={{
                      width: '100%',
                      minHeight: 60,
                      resize: 'vertical',
                      borderRadius: 10,
                      border: '1px solid var(--border-soft)',
                      padding: 8,
                      fontSize: 13,
                      fontFamily: 'inherit',
                      marginBottom: 6,
                    }}
                  />
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <span className="text-secondary" style={{ fontSize: 11 }}>
                      I&apos;ll respond using your current level, goal, and mode.
                    </span>
                    <button
                      type="submit"
                      className="btn btn-accent"
                      disabled={isSending}
                      style={{
                        opacity: isSending ? 0.7 : 1,
                        cursor: isSending ? 'default' : 'pointer',
                      }}
                    >
                      {isSending ? 'Thinking…' : 'Send'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Profile / settings column */}
              <div
                className="card-soft"
                style={{
                  alignSelf: 'flex-start',
                  fontSize: 12,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                <h2 style={{ fontSize: 13, margin: 0 }}>Your learning profile</h2>
                <p className="text-secondary" style={{ fontSize: 11, margin: 0 }}>
                  I use this to choose how much Amharic vs English to use, how slowly to go, and
                  how detailed explanations should be.
                </p>

                {/* Level */}
                <div>
                  <p
                    style={{
                      fontSize: 11,
                      textTransform: 'uppercase',
                      letterSpacing: '0.14em',
                      color: 'var(--secondary-text)',
                      marginBottom: 4,
                    }}
                  >
                    Level
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    <button
                      type="button"
                      onClick={() =>
                        setProfile(prev => ({ ...prev, level: 'absolute-beginner' }))
                      }
                      className="btn-ghost"
                      style={{
                        fontSize: 11,
                        padding: '4px 10px',
                        borderRadius: 999,
                        border:
                          profile.level === 'absolute-beginner'
                            ? '1px solid var(--primary-color)'
                            : '1px solid var(--border-soft)',
                        backgroundColor:
                          profile.level === 'absolute-beginner'
                            ? 'rgba(37,99,235,0.06)'
                            : 'transparent',
                      }}
                    >
                      Absolute beginner
                    </button>
                    <button
                      type="button"
                      onClick={() => setProfile(prev => ({ ...prev, level: 'script-aware' }))}
                      className="btn-ghost"
                      style={{
                        fontSize: 11,
                        padding: '4px 10px',
                        borderRadius: 999,
                        border:
                          profile.level === 'script-aware'
                            ? '1px solid var(--primary-color)'
                            : '1px solid var(--border-soft)',
                        backgroundColor:
                          profile.level === 'script-aware'
                            ? 'rgba(37,99,235,0.06)'
                            : 'transparent',
                      }}
                    >
                      Script-aware
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setProfile(prev => ({ ...prev, level: 'conversational' }))
                      }
                      className="btn-ghost"
                      style={{
                        fontSize: 11,
                        padding: '4px 10px',
                        borderRadius: 999,
                        border:
                          profile.level === 'conversational'
                            ? '1px solid var(--primary-color)'
                            : '1px solid var(--border-soft)',
                        backgroundColor:
                          profile.level === 'conversational'
                            ? 'rgba(37,99,235,0.06)'
                            : 'transparent',
                      }}
                    >
                      Conversational
                    </button>
                  </div>
                </div>

                {/* Goal */}
                <div>
                  <p
                    style={{
                      fontSize: 11,
                      textTransform: 'uppercase',
                      letterSpacing: '0.14em',
                      color: 'var(--secondary-text)',
                      marginBottom: 4,
                    }}
                  >
                    Goal
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    <button
                      type="button"
                      onClick={() => setProfile(prev => ({ ...prev, goal: 'heritage' }))}
                      className="btn-ghost"
                      style={{
                        fontSize: 11,
                        padding: '4px 10px',
                        borderRadius: 999,
                        border:
                          profile.goal === 'heritage'
                            ? '1px solid var(--primary-color)'
                            : '1px solid var(--border-soft)',
                        backgroundColor:
                          profile.goal === 'heritage'
                            ? 'rgba(37,99,235,0.06)'
                            : 'transparent',
                      }}
                    >
                      Heritage / family
                    </button>
                    <button
                      type="button"
                      onClick={() => setProfile(prev => ({ ...prev, goal: 'travel' }))}
                      className="btn-ghost"
                      style={{
                        fontSize: 11,
                        padding: '4px 10px',
                        borderRadius: 999,
                        border:
                          profile.goal === 'travel'
                            ? '1px solid var(--primary-color)'
                            : '1px solid var(--border-soft)',
                        backgroundColor:
                          profile.goal === 'travel'
                            ? 'rgba(37,99,235,0.06)'
                            : 'transparent',
                      }}
                    >
                      Travel
                    </button>
                    <button
                      type="button"
                      onClick={() => setProfile(prev => ({ ...prev, goal: 'work' }))}
                      className="btn-ghost"
                      style={{
                        fontSize: 11,
                        padding: '4px 10px',
                        borderRadius: 999,
                        border:
                          profile.goal === 'work'
                            ? '1px solid var(--primary-color)'
                            : '1px solid var(--border-soft)',
                        backgroundColor:
                          profile.goal === 'work'
                            ? 'rgba(37,99,235,0.06)'
                            : 'transparent',
                      }}
                    >
                      Study / work
                    </button>
                    <button
                      type="button"
                      onClick={() => setProfile(prev => ({ ...prev, goal: 'curious' }))}
                      className="btn-ghost"
                      style={{
                        fontSize: 11,
                        padding: '4px 10px',
                        borderRadius: 999,
                        border:
                          profile.goal === 'curious'
                            ? '1px solid var(--primary-color)'
                            : '1px solid var(--border-soft)',
                        backgroundColor:
                          profile.goal === 'curious'
                            ? 'rgba(37,99,235,0.06)'
                            : 'transparent',
                      }}
                    >
                      Just curious
                    </button>
                  </div>
                </div>

                {/* Learning mode */}
                <div>
                  <p
                    style={{
                      fontSize: 11,
                      textTransform: 'uppercase',
                      letterSpacing: '0.14em',
                      color: 'var(--secondary-text)',
                      marginBottom: 4,
                    }}
                  >
                    Learning mode
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    <button
                      type="button"
                      onClick={() => setProfile(prev => ({ ...prev, learningMode: 'amharic' }))}
                      className="btn-ghost"
                      style={{
                        fontSize: 11,
                        padding: '4px 10px',
                        borderRadius: 999,
                        border:
                          profile.learningMode === 'amharic'
                            ? '1px solid var(--primary-color)'
                            : '1px solid var(--border-soft)',
                        backgroundColor:
                          profile.learningMode === 'amharic'
                            ? 'rgba(37,99,235,0.06)'
                            : 'transparent',
                      }}
                    >
                      Learn Amharic
                    </button>
                    <button
                      type="button"
                      onClick={() => setProfile(prev => ({ ...prev, learningMode: 'english' }))}
                      className="btn-ghost"
                      style={{
                        fontSize: 11,
                        padding: '4px 10px',
                        borderRadius: 999,
                        border:
                          profile.learningMode === 'english'
                            ? '1px solid var(--primary-color)'
                            : '1px solid var(--border-soft)',
                        backgroundColor:
                          profile.learningMode === 'english'
                            ? 'rgba(37,99,235,0.06)'
                            : 'transparent',
                      }}
                    >
                      Learn English (from Amharic)
                    </button>
                  </div>
                  <p className="text-secondary" style={{ fontSize: 11, marginTop: 4 }}>
                    Amharic mode = answers mostly in Amharic with transliteration and English help.
                    English mode = answers mostly in English with Amharic support.
                  </p>
                </div>
              </div>
            </div>
          </FadeInOnScroll>
        </div>
      </section>
    </main>
  );
}