'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type DarkModeState = 'active' | 'inactive';

function NavLink({
  href,
  label,
  currentPath,
}: {
  href: string;
  label: string;
  currentPath: string;
}) {
  const isActive =
    href === '/'
      ? currentPath === '/'
      : currentPath === href || currentPath.startsWith(href + '/');

  return (
    <Link
      href={href}
      style={{
        position: 'relative',
        textDecoration: 'none',
        padding: '6px 10px',
        borderRadius: 999,
        fontWeight: isActive ? 700 : 500,
        fontSize: 11,
        color: isActive ? 'var(--base-color)' : 'var(--secondary-text)',
        backgroundColor: isActive ? 'var(--text-color)' : 'transparent',
        transition: 'background-color 0.15s ease, color 0.15s ease',
      }}
    >
      {label}
      {isActive && (
        <span
          style={{
            position: 'absolute',
            left: 8,
            right: 8,
            bottom: 4,
            height: 2,
            borderRadius: 999,
            background:
              'linear-gradient(to right, var(--primary-color), var(--accent-color))',
          }}
        />
      )}
    </Link>
  );
}

export default function Header() {
  const [darkmode, setDarkmode] = useState<DarkModeState>('inactive');
  const pathname = usePathname() || '/';

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const stored = window.localStorage.getItem('darkmode') as DarkModeState | null;
    if (stored === 'active') {
      document.body.classList.add('darkmode');
      setDarkmode('active');
    }
  }, []);

  function enableDarkmode() {
    document.body.classList.add('darkmode');
    window.localStorage.setItem('darkmode', 'active');
    setDarkmode('active');
  }

  function disableDarkmode() {
    document.body.classList.remove('darkmode');
    window.localStorage.setItem('darkmode', 'inactive');
    setDarkmode('inactive');
  }

  function toggleTheme() {
    if (darkmode === 'active') disableDarkmode();
    else enableDarkmode();
  }

  const isDark = darkmode === 'active';

  return (
    <header
      style={{
        padding: '16px min(48px, 7%)',
        borderBottom: '1px solid var(--border-soft)',
        backgroundColor: 'var(--base-color)',
        position: 'sticky',
        top: 0,
        zIndex: 20,
      }}
    >
      <div
        style={{
          maxWidth: 1120,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: 32,
              height: 32,
              overflow: 'hidden',
              borderRadius: 8,
              backgroundColor: '#151515',
            }}
          >
            <Image
              src={isDark ? '/dark_mode.png' : '/light_mode.png'}
              alt="Kwanqa AI logo"
              fill
              sizes="32px"
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.18em',
              color: 'var(--text-color)',
            }}
          >
            KWANQA&nbsp;AI
          </span>
        </Link>

        {/* Nav + theme switch */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontSize: 11,
          }}
        >
          {/* main product links */}
          <NavLink href="/tutor" label="Tutor" currentPath={pathname} />
          <NavLink href="/courses" label="Courses" currentPath={pathname} />
          <NavLink href="/design-prompt" label="Design Prompt" currentPath={pathname} />

          {/* single company/info link */}
          <NavLink href="/about" label="About" currentPath={pathname} />

          {/* theme switch */}
          <button
            id="theme-switch"
            type="button"
            onClick={toggleTheme}
            className="theme-switch"
          >
            <span className="theme-switch-icon">{isDark ? '🌙' : '☀️'}</span>
            <span className="theme-switch-label">
              {isDark ? 'Dark' : 'Light'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}