'use client';

import { FormEvent, useState } from 'react';
import { FadeInOnScroll } from '@/components/FadeInOnScroll';

const STYLE_OPTIONS = [
  'Modern & Minimalist',
  'Bold & Vibrant',
  'Corporate & Professional',
  'Creative & Artistic',
  'Warm & Friendly',
  'Dark & Elegant',
  'Playful & Fun',
  'Tech & Futuristic',
];

const WEBSITE_TYPES = [
  'E-commerce store',
  'Portfolio / personal brand',
  'SaaS / software product',
  'Blog / news / magazine',
  'Restaurant / café',
  'Non-profit / charity',
  'Educational platform',
  'Agency / studio',
  'Healthcare / wellness',
  'Other',
];

export default function DesignPromptPage() {
  const [websiteType, setWebsiteType] = useState('');
  const [customType, setCustomType] = useState('');
  const [audience, setAudience] = useState('');
  const [style, setStyle] = useState('');
  const [colors, setColors] = useState('');
  const [features, setFeatures] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const resolvedType =
    websiteType === 'Other' ? customType : websiteType;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!resolvedType.trim() || isGenerating) return;

    setError('');
    setGeneratedPrompt('');
    setIsGenerating(true);

    try {
      const res = await fetch('/api/design-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteType: resolvedType,
          audience,
          style,
          colors,
          features,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to reach design-prompt API');
      }

      const data = (await res.json()) as { generatedPrompt?: string; error?: string };
      if (data.error) throw new Error(data.error);
      setGeneratedPrompt(data.generatedPrompt ?? '');
    } catch (err) {
      console.error(err);
      setError(
        'Could not generate the prompt. Make sure Ollama is running locally, then try again.'
      );
    } finally {
      setIsGenerating(false);
    }
  }

  function handleCopy() {
    if (!generatedPrompt) return;
    navigator.clipboard.writeText(generatedPrompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <main className="app-main">
      <section className="band-none">
        <div className="section-shell">
          <FadeInOnScroll>
            <div className="section-card">
              {/* Page header */}
              <div style={{ marginBottom: 20 }}>
                <div className="chip" style={{ marginBottom: 12 }}>
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '999px',
                      backgroundColor: 'var(--accent-color)',
                    }}
                  />
                  <span>AI-powered · runs locally</span>
                </div>
                <h1 style={{ fontSize: 22, margin: '0 0 6px' }}>
                  Website Design Prompt Generator
                </h1>
                <p className="text-secondary" style={{ fontSize: 13, margin: 0 }}>
                  Describe your website and Kwanqa AI will craft a detailed design
                  prompt you can paste into Midjourney, Stable Diffusion, Figma AI,
                  or share with a designer.
                </p>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
                  gap: 20,
                  alignItems: 'start',
                }}
              >
                {/* ── Left: form ── */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {/* Website type */}
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: 11,
                        textTransform: 'uppercase',
                        letterSpacing: '0.14em',
                        color: 'var(--secondary-text)',
                        marginBottom: 6,
                      }}
                    >
                      Website type <span style={{ color: 'var(--accent-color)' }}>*</span>
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
                      {WEBSITE_TYPES.map(t => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setWebsiteType(t)}
                          className="btn-ghost"
                          style={{
                            fontSize: 11,
                            padding: '4px 10px',
                            borderRadius: 999,
                            border:
                              websiteType === t
                                ? '1px solid var(--primary-color)'
                                : '1px solid var(--border-soft)',
                            backgroundColor:
                              websiteType === t
                                ? 'rgba(37,99,235,0.06)'
                                : 'transparent',
                          }}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    {websiteType === 'Other' && (
                      <input
                        type="text"
                        placeholder="Describe your website type…"
                        value={customType}
                        onChange={e => setCustomType(e.target.value)}
                        style={{
                          width: '100%',
                          borderRadius: 10,
                          border: '1px solid var(--border-soft)',
                          padding: '6px 10px',
                          fontSize: 12,
                          fontFamily: 'inherit',
                        }}
                      />
                    )}
                  </div>

                  {/* Target audience */}
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: 11,
                        textTransform: 'uppercase',
                        letterSpacing: '0.14em',
                        color: 'var(--secondary-text)',
                        marginBottom: 6,
                      }}
                    >
                      Target audience
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Young professionals aged 25–35, small business owners…"
                      value={audience}
                      onChange={e => setAudience(e.target.value)}
                      style={{
                        width: '100%',
                        borderRadius: 10,
                        border: '1px solid var(--border-soft)',
                        padding: '6px 10px',
                        fontSize: 12,
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>

                  {/* Visual style */}
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: 11,
                        textTransform: 'uppercase',
                        letterSpacing: '0.14em',
                        color: 'var(--secondary-text)',
                        marginBottom: 6,
                      }}
                    >
                      Visual style
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {STYLE_OPTIONS.map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setStyle(s)}
                          className="btn-ghost"
                          style={{
                            fontSize: 11,
                            padding: '4px 10px',
                            borderRadius: 999,
                            border:
                              style === s
                                ? '1px solid var(--primary-color)'
                                : '1px solid var(--border-soft)',
                            backgroundColor:
                              style === s
                                ? 'rgba(37,99,235,0.06)'
                                : 'transparent',
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color preferences */}
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: 11,
                        textTransform: 'uppercase',
                        letterSpacing: '0.14em',
                        color: 'var(--secondary-text)',
                        marginBottom: 6,
                      }}
                    >
                      Color preferences
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Deep blue and white, earthy tones, brand colors #FF6B35…"
                      value={colors}
                      onChange={e => setColors(e.target.value)}
                      style={{
                        width: '100%',
                        borderRadius: 10,
                        border: '1px solid var(--border-soft)',
                        padding: '6px 10px',
                        fontSize: 12,
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>

                  {/* Key sections / features */}
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: 11,
                        textTransform: 'uppercase',
                        letterSpacing: '0.14em',
                        color: 'var(--secondary-text)',
                        marginBottom: 6,
                      }}
                    >
                      Key sections / features
                    </label>
                    <textarea
                      placeholder="e.g. Hero with CTA, pricing table, testimonials, FAQ, contact form, dark mode…"
                      value={features}
                      onChange={e => setFeatures(e.target.value)}
                      style={{
                        width: '100%',
                        minHeight: 70,
                        resize: 'vertical',
                        borderRadius: 10,
                        border: '1px solid var(--border-soft)',
                        padding: '6px 10px',
                        fontSize: 12,
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <button
                      type="submit"
                      className="btn btn-accent"
                      disabled={!resolvedType.trim() || isGenerating}
                      style={{
                        opacity: !resolvedType.trim() || isGenerating ? 0.6 : 1,
                        cursor: !resolvedType.trim() || isGenerating ? 'default' : 'pointer',
                      }}
                    >
                      {isGenerating ? 'Generating…' : 'Generate Design Prompt'}
                    </button>
                    <span className="text-secondary" style={{ fontSize: 11 }}>
                      Powered by your local Ollama model
                    </span>
                  </div>
                </form>

                {/* ── Right: result ── */}
                <div>
                  <div
                    style={{
                      borderRadius: 16,
                      border: '1px solid var(--border-soft)',
                      backgroundColor: 'var(--base-color)',
                      minHeight: 260,
                      padding: 14,
                      fontSize: 13,
                      lineHeight: 1.65,
                      position: 'relative',
                    }}
                  >
                    {!generatedPrompt && !error && !isGenerating && (
                      <p
                        className="text-secondary"
                        style={{ fontSize: 12, margin: 0 }}
                      >
                        Your generated design prompt will appear here. Fill in the
                        form on the left and click{' '}
                        <strong>Generate Design Prompt</strong>.
                      </p>
                    )}

                    {isGenerating && (
                      <p
                        className="text-secondary"
                        style={{ fontSize: 12, margin: 0 }}
                      >
                        ✨ Crafting your design prompt…
                      </p>
                    )}

                    {error && (
                      <p style={{ fontSize: 12, color: 'var(--accent-color)', margin: 0 }}>
                        {error}
                      </p>
                    )}

                    {generatedPrompt && (
                      <>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 10,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 10,
                              textTransform: 'uppercase',
                              letterSpacing: '0.14em',
                              color: 'var(--secondary-text)',
                            }}
                          >
                            Generated prompt
                          </span>
                          <button
                            type="button"
                            onClick={handleCopy}
                            className="btn-ghost"
                            style={{ fontSize: 11, padding: '3px 10px', borderRadius: 999 }}
                          >
                            {copied ? '✓ Copied!' : 'Copy'}
                          </button>
                        </div>
                        <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                          {generatedPrompt}
                        </p>
                      </>
                    )}
                  </div>

                  {generatedPrompt && (
                    <p className="text-secondary" style={{ fontSize: 11, marginTop: 8 }}>
                      Tip: paste this prompt into Midjourney, Stable Diffusion, Adobe
                      Firefly, or share it with a designer for a head start.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </FadeInOnScroll>
        </div>
      </section>
    </main>
  );
}
