import type { ReactNode } from "react";

export function PhoneFrame({
  children,
  bottomNav,
}: {
  children: ReactNode;
  bottomNav?: ReactNode;
}) {
  return (
    <div className="phone-stage">
      <div className="phone">
        <div className="notch" />
        <div className="status-bar">
          <span className="time">9:41</span>
          <span className="icons">
            <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor">
              <rect x="0"  y="6" width="3" height="5" rx="0.5" />
              <rect x="4"  y="4" width="3" height="7" rx="0.5" />
              <rect x="8"  y="2" width="3" height="9" rx="0.5" />
              <rect x="12" y="0" width="3" height="11" rx="0.5" />
            </svg>
            <svg width="20" height="11" viewBox="0 0 20 11" fill="none" stroke="currentColor" strokeWidth="1.2">
              <rect x="0.6" y="0.6" width="16.8" height="9.8" rx="2" />
              <rect x="2"   y="2"   width="14"   height="7"   rx="1" fill="currentColor" />
              <rect x="18"  y="3.5" width="1.4"  height="4"   rx="0.5" fill="currentColor" />
            </svg>
          </span>
        </div>
        <div className="screen-area">{children}</div>
        {bottomNav}
      </div>
    </div>
  );
}
