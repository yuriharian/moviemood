"use client";

import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="home-container">
      <Image
        src="/logo.png"
        alt="Movie Mood Logo"
        width={200}
        height={200}
        className="logo-home"
      />

      <div className="button-container">
        <Link href="/register">
          <button className="button">Cadastro</button>
        </Link>
        <Link href="/login">
          <button className="button">Login</button>
        </Link>
      </div>
    </div>
  );
}
