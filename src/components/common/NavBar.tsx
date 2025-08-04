'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import Button from '../ui/Button';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50">
      <nav className="bg-black/20 backdrop-blur-lg border-b border-white/30 shadow-md py-3 md:px-18">
        <div className="mx-auto flex items-center justify-between">
          <div className="text-xl font-bold text-white"><Link href={"/"} >Venum B2B</Link></div>

          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white focus:outline-none"
            >
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          <ul className="hidden md:flex gap-6 text-white font-medium">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/services">Services</Link>
            </li>
            <li>
              <Link href="/my-items">My Items</Link>
            </li>
            <li>
              <Link href="/blog">Blogs</Link>
            </li>
            <li>
              <Link href="/about">About Us</Link>
            </li>
            <li>
              <Link href="/contact">Contact Us</Link>
            </li>
          </ul>

          <Button />
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <ul className="md:hidden mt-4 space-y-3 px-4 text-white font-medium">
            <li>
              <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
            </li>
            <li>
              <Link href="/about" onClick={() => setMenuOpen(false)}>About</Link>
            </li>
            <li>
              <Link href="/services" onClick={() => setMenuOpen(false)}>Services</Link>
            </li>
            <li>
              <Link href="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
