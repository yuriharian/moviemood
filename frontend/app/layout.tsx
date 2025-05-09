"use client";

import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Verifica se a rota atual é a inicial
  const showHeader = pathname !== "/";

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        {/* Exibe o header apenas se não estiver na página inicial */}
        {showHeader && (
          <nav className="navbar">
            <div className="logo-container">
              <Link href="/">
                <Image
                  src="/logo.png"
                  alt="Movie Mood Logo"
                  width={50}
                  height={50}
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
                {/* Link para a página de usuário */}
                <Link href="/user">Usuário</Link>
              </li>
            </ul>
          </nav>
        )}
        <main>{children}</main>
      </body>
    </html>
  );
}
