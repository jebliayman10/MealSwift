import { PhoneFrame } from "./PhoneFrame";
import { BottomNav } from "./BottomNav";

export function StubScreen({
  active,
  title,
  sub,
}: {
  active: string;
  title: string;
  sub: string;
}) {
  return (
    <PhoneFrame bottomNav={<BottomNav active={active} />}>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "40px 28px",
          gap: 12,
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-d)",
            fontSize: 24,
            fontWeight: 700,
            color: "var(--stone-900)",
          }}
        >
          {title}
        </h1>
        <p style={{ fontSize: 14, color: "var(--stone-500)", lineHeight: 1.55 }}>{sub}</p>
      </div>
    </PhoneFrame>
  );
}
