"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CHAT_LOGO_PATH, CHAT_LOGO_VIEWBOX } from "@/lib/chat-logo-path";
import { generateMaterializeShards } from "@/lib/loading/materialize-shards";

const [, , VB_W, VB_H] = CHAT_LOGO_VIEWBOX.split(" ").map(Number);

export function LogoMaterialize({
  ignite,
  reduced,
}: {
  ignite: boolean;
  reduced?: boolean;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [scale, setScale] = useState(1);

  // Only generate the randomized shards on the client AFTER hydration is complete.
  // During server render, it returns an empty array, matching perfectly with initial client hydration.
  const shards = useMemo(() => {
    return isMounted ? generateMaterializeShards(VB_W, VB_H) : [];
  }, [isMounted]);

  useEffect(() => {
    setIsMounted(true); // Triggers the client-side re-render to generate shards

    function updateScale() {
      const target = Math.min(Math.max(window.innerWidth * 0.6, 240), 480);
      setScale(target / VB_W);
    }
    
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  return (
    <div style={{ width: VB_W, height: VB_H, transform: `scale(${scale})` }}>
      <div
        className="relative"
        style={{
          width: VB_W,
          height: VB_H,
          clipPath: `path(evenodd, "${CHAT_LOGO_PATH}")`,
        }}
      >
        {shards.map((shard) => (
          <motion.div
            key={shard.id}
            className="absolute"
            style={{
              left: shard.x,
              top: shard.y,
              width: shard.w,
              height: shard.h,
              backgroundColor: shard.color,
            }}
            initial={
              reduced
                ? { opacity: 0 }
                : { x: shard.startDx, y: shard.startDy, opacity: 0 }
            }
            animate={{ x: 0, y: 0, opacity: 1 }}
            transition={
              reduced
                ? { duration: 0.4 }
                : { duration: shard.duration, delay: shard.delay, ease: [0.16, 1, 0.3, 1] }
            }
          />
        ))}

        {ignite && <div className="materialize-ignite absolute inset-0" />}
      </div>
    </div>
  );
}