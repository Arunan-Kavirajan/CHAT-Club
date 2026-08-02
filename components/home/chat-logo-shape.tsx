import { CHAT_LOGO_PATH, CHAT_LOGO_VIEWBOX } from "@/lib/chat-logo-path";

type Props = {
  className?: string;
  fill?: string;
  style?: React.CSSProperties;
};

/** Vector-traced CHAT logo — crisp at any display size, no raster scaling artifacts. */
export function ChatLogoShape({ className, fill = "currentColor", style }: Props) {
  return (
    <svg
      viewBox={CHAT_LOGO_VIEWBOX}
      className={className}
      style={{ width: "100%", height: "100%", ...style }}
      preserveAspectRatio="xMidYMid meet"
    >
      <path d={CHAT_LOGO_PATH} fill={fill} fillRule="evenodd" />
    </svg>
  );
}