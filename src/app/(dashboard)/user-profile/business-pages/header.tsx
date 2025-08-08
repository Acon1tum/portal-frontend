"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building, User, Menu, X, Search, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Businesses', href: '/businesses' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && pathname !== '/') return false;
    return pathname.startsWith(path);
  };

  return (
    <header className="bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Building className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-foreground">BusinessHub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out border-b-2 ${
                  isActive(item.href)
                    ? 'border-primary text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary transition"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <Link
              href="/search"
              className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary transition"
            >
              <Search className="h-5 w-5" />
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 text-foreground hover:text-primary transition"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary transition mr-2"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary transition"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <div className="pt-2 pb-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block pl-3 pr-4 py-2 text-base font-medium ${
                  isActive(item.href)
                    ? 'text-primary border-l-4 border-primary bg-primary/5'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary border-l-4 border-transparent'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 pb-2 border-t border-border">
              <Link
                href="/login"
                className="block pl-3 pr-4 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-secondary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="block pl-3 pr-4 py-2 text-base font-medium text-primary hover:text-primary hover:bg-primary/5"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}