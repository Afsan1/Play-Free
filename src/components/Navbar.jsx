'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserButton, useAuth } from "@clerk/nextjs";
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
      <Link href="/" className={styles.logo}>
        FREE-PLAY
      </Link>

      <ul className={styles.navLinks}>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/movies">Movies</Link></li>
        <li><Link href="/series">Series</Link></li>
        <li><Link href="/anime">Anime</Link></li>
      </ul>

      <div className={styles.navActions}>
        <div className={styles.searchBox}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            placeholder="Search..." 
            suppressHydrationWarning
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                window.location.href = `/search?q=${e.target.value}`;
              }
            }} 
          />
        </div>

        <div className={styles.authWrapper}>
          {isLoaded && isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : isLoaded ? (
            <Link href="/sign-in" className={styles.signInBtn}>Sign In</Link>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
