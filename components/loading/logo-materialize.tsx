"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CHAT_LOGO_PATH, CHAT_LOGO_VIEWBOX } from "@/lib/chat-logo-path";
import {
  generateMaterializeShards,
  type MaterializeShard,
} from "@/lib/loading/materialize-shards";

const [, , VB_W, VB_H] = CHAT_LOGO_VIEWBOX.split(" ").map(Number);

export function LogoMaterialize({
  ignite,
  reduced,
}: {
  ignite: boolean;
  reduced?: boolean;
}) {
  const [shards, setShards] = useState<MaterializeShard[] | null>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentionally client-only random visual data; generating it during render would mismatch between server and client
    setShards(generateMaterializeShards(VB_W, VB_H));
  }, []);

  useEffect(() => {
    function updateScale() {
      const target = Math.min(Math.max(window.innerWidth * 0.6, 240), 480);
      setScale(target / VB_W);
    }
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  if (!shards) return null;

  return (
    <div
      className="relative"
      style={{ width: VB_W, height: VB_H, transform: `scale(${scale})` }}
    >
      {!reduced && !ignite && (
        <div
          className="materialize-heartbeat absolute rounded-full"
          style={{
            left: "50%",
            top: "50%",
            width: VB_H * 1.4,
            height: VB_H * 1.4,
            transform: "translate(-50%, -50%)",
            border: "1px solid rgba(168,85,247,0.4)",
          }}
        />
      )}

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
            className={`absolute ${!reduced ? "materialize-shard-shimmer" : ""}`}
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

        {ignite && (
          <>
            <div className="materialize-ignite absolute inset-0" />
            <div className="materialize-rays absolute inset-0" />
          </>
        )}
      </div>
    </div>
  );
}