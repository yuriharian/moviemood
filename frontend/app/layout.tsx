"use client";

import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [theme, setTheme] = useState("dark");
  const [animating, setAnimating] = useState(false);

  // Sincroniza tema com localStorage/document.documentElement
  useEffect(() => {
    const savedTheme =
      typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      setTheme("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  const toggleTheme = () => {
    setAnimating(true);
    setTimeout(() => setAnimating(false), 400);
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        {/* Script para aplicar o tema antes do React carregar */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme) {
                    document.documentElement.setAttribute('data-theme', theme);
                  } else {
                    document.documentElement.setAttribute('data-theme', 'dark');
                  }
                } catch(e){
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              })();
            `,
          }}
        />
        <style>{`
          .theme-toggle-btn {
            background: none;
            border: none;
            cursor: pointer;
            padding: 5px 12px;
            font-size: 1.3rem;
            display: flex;
            align-items: center;
            transition: color 0.3s;
            outline: none;
          }
          .theme-toggle-btn .icon {
            transition: transform 0.4s cubic-bezier(.68,-0.55,.27,1.55), color 0.3s;
            display: flex;
            align-items: center;
          }
          .theme-toggle-btn.animating .icon {
            transform: rotate(180deg) scale(1.2);
          }
        `}</style>
      </head>
      <body className={pathname === "/" ? "home-no-scroll" : ""}>
        <nav className="navbar">
          <div className="logo-container">
            <Link href="/">
              <Image
                src="/logo-v2.png"
                alt="Movie Mood Logo"
                width={1400}
                height={1400}
                className="logo-header"
              />
            </Link>
          </div>
          <ul>
            <li>
              <Link href="/">Início</Link>
            </li>
            {/* Exibe "Cadastro" e "Login" apenas se não estiver na página de usuário */}
            {pathname !== "/user" && (
              <>
                <li>
                  <Link href="/register">Cadastro</Link>
                </li>
                <li>
                  <Link href="/login">Login</Link>
                </li>
              </>
            )}
            <li>
              <Link href="/user">Usuário</Link>
            </li>
            <li>
              <button
                className={`theme-toggle-btn${animating ? " animating" : ""}`}
                onClick={toggleTheme}
                type="button"
                aria-label="Alternar tema"
              >
                <span className="icon" aria-hidden="true">
                  {theme === "dark" ? (
                    // Lua (tema escuro)
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M21 12.79A9 9 0 0111.21 3a7 7 0 108.79 9.79z"
                        fill="#FFD700"
                        stroke="#FFD700"
                        strokeWidth="2"
                      />
                    </svg>
                  ) : (
                    // Sol (tema claro)
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="5"
                        fill="#FFA500"
                        stroke="#FFA500"
                        strokeWidth="2"
                      />
                      <g stroke="#FFA500" strokeWidth="2">
                        <line x1="12" y1="1" x2="12" y2="3" />
                        <line x1="12" y1="21" x2="12" y2="23" />
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                        <line x1="1" y1="12" x2="3" y2="12" />
                        <line x1="21" y1="12" x2="23" y2="12" />
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                      </g>
                    </svg>
                  )}
                </span>
              </button>
            </li>
          </ul>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
