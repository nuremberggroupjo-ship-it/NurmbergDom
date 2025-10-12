"use client";

import Image from "next/image";
import Game from "./components/index";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";

export default function Home() {
  const [isShown, setIsShown] = useState(false); // هل اللعبة شغالة
  const [showContact, setShowContact] = useState(false); // شاشة الاتصال
  const [go, setGo] = useState(true); // زر Go ظاهر؟
  const [isMobile, setIsMobile] = useState(false);
  const [showTouchControls, setShowTouchControls] = useState(false);

  const logoRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dotsRef = useRef<HTMLSpanElement>(null);

  // كشف هل الجهاز موبايل
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // انيميشن البداية
  useEffect(() => {
    if (logoRef.current && textRef.current && buttonRef.current && dotsRef.current) {
      gsap.fromTo(
        logoRef.current,
        { y: -80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
      );
      gsap.fromTo(
        textRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, delay: 0.5, ease: "power2.out" }
      );
      gsap.fromTo(
        buttonRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, delay: 1, ease: "power2.out" }
      );
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.3 });
      tl.to(dotsRef.current, { text: '...', duration: 0.5 })
        .to(dotsRef.current, { text: '', duration: 0.5 })
        .to(dotsRef.current, { text: '.', duration: 0.5 })
        .to(dotsRef.current, { text: '..', duration: 0.5 });
    }
  }, []);

  function onGameOver() {
    setIsShown(false);
    setShowContact(true);
    setGo(true);
    setShowTouchControls(false);
  }

  function onReplay() {
    setShowContact(false);
    setIsShown(true);
    setGo(false);
    if (isMobile) setShowTouchControls(true);
  }

  function startGame() {
    setIsShown(true);
    setGo(false);
    if (isMobile) setShowTouchControls(true);
  }

  return (
    <div className="flex flex-col items-center justify-center gap-10 min-h-screen bg-black text-white px-4 relative">
      {/* الشعار */}
      {!isShown && (
        <div
          ref={logoRef}
          className={`transition-opacity duration-300 ${isShown ? "opacity-0" : "opacity-100"}`}
        >
          <Image
            src="/logo.png"
            alt="Logo"
            width={300}
            height={180}
            className="drop-shadow-xl transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}

      {/* نص Coming Soon (يظهر فقط إذا اللعبة غير شغالة) */}
      {!isShown && !showContact && (
        <span
          ref={textRef}
          className="text-5xl md:text-6xl font-bold text-center select-none opacity-0"
        >
          Coming Soon
          <span ref={dotsRef} className="inline-block"></span>
        </span>
      )}

      {/* زر Go */}
      {go && !isShown && !showContact && (
        <button
          ref={buttonRef}
          onClick={startGame}
          className="opacity-0 transform translate-y-10 border-2 border-white text-white px-8 py-3 rounded-full text-xl font-medium hover:bg-white hover:text-black transition-all duration-300 shadow-md"
        >
          Play a quick game
        </button>
      )}

      {/* اللعبة */}
      {isShown && (
        <div className="mt-10 w-full max-w-5xl transition-transform duration-300 hover:scale-[1.02]">
          <Game
            onGameOver={onGameOver}
            showTouchControls={showTouchControls}
          />
        </div>
      )}

     

      {/* شاشة الاتصال تظهر عند انتهاء اللعبة */}
      {showContact && (
        <div
          className="w-full max-w-5xl mx-auto bg-black text-white font-semibold text-center py-4 rounded-t-lg select-none shadow-md border border-white"
          style={{
            width: "80vw",
            height: "40vh",
            maxWidth: "600px",
            maxHeight: "600px",
            margin: "auto",
            userSelect: "none",
            border: "2px solid white",
            borderRadius: "10px",
            overflow: "hidden",
            boxSizing: "content-box",
          }}
        >
          <div>Contact Us</div>
          <div className="mt-2 space-y-1">
            <div>
              Email:{" "}
              <a
                href="mailto:info@nurembergtech.com"
                className="text-white underline hover:text-gray-400"
              >
                info@nurembergtech.com
              </a>
            </div>
            <div>
              Phone:{" "}
              <a
                href="tel:+962796105229"
                className="text-white underline hover:text-gray-400"
              >
                +962 796-105-229
              </a>
            </div>
            <div>
              Land-line:{" "}
              <a
                href="tel: +96262227913"
                className="text-white underline hover:text-gray-400"
              >
                +962 62-227-913
              </a>
            </div>
            <div className="flex justify-center gap-6 mt-2">
            <a
  href="https://www.linkedin.com/company/nuremberg-group/"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="LinkedIn"
  className="hover:text-gray-400"
>
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 8h4V24h-4V8zm7.5 0h3.8v2.2h.05c.53-1 1.82-2.2 3.75-2.2 4 0 4.74 2.63 4.74 6v9h-4v-8c0-1.9-.03-4.3-2.6-4.3-2.6 0-3 2-3 4.2v8.1h-4V8z"/>
  </svg>
</a>

              <a
                href="https://www.facebook.com/share/1DBDtKg3tv/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="hover:text-gray-400"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12a10 10 0 10-11.5 9.87v-6.98H8v-2.9h2.5V9.5c0-2.48 1.5-3.86 3.8-3.86 1.1 0 2.3.2 2.3.2v2.5h-1.3c-1.3 0-1.7.8-1.7 1.6v2h2.9l-.5 2.9h-2.4v6.98A10 10 0 0022 12z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/nuremberggroup.jo?igsh=cjFkeHVvbnoxY3Jy"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:text-gray-400"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10 c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm10 2c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1zm-5 2a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6z" />
                </svg>
              </a>
            </div>
          </div>
          <button
            onClick={onReplay}
            className="mt-4 px-6 py-2  bg-white text-black rounded font-semibold hover:bg-gray-200 transition"
          >
            Replay
          </button>
        </div>
      )}
    </div>
  );
}
