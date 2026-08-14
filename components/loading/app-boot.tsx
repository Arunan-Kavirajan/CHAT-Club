"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LoadingScreen } from "./loading-screen";

const SESSION_KEY = "chat-boot-played";

export function AppBoot({ children }: { children: ReactNode }) {
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    const alreadyPlayed = sessionStorage.getItem(SESSION_KEY);
    if (alreadyPlayed) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- correcting from sessionStorage; BootScript + the [data-boot] CSS rules already guarantee no visible flash regardless of this state's timing
      setBooted(true);
    } else {
      sessionStorage.setItem(SESSION_KEY, "1");
    }
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = booted ? "" : "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [booted]);

  return (
    <>
      <AnimatePresence>
        {!booted && <LoadingScreen onComplete={() => setBooted(true)} />}
      </AnimatePresence>

      <motion.div
        className="boot-content-wrapper flex flex-col min-h-full"
        initial={false}
        animate={{ opacity: booted ? 1 : 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </>
  );
}