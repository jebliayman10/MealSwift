"use client";

import { useEffect, useRef, useCallback } from "react";

export interface ContinentDot {
  id: string;
  lon: number;
  lat: number;
  name: string;
  col: string;
  flag: string;
}

export const CONTINENT_DOTS: ContinentDot[] = [
  { id: "europe",      lon: 15,  lat: 50,  name: "Europe",      col: "#f4a261", flag: "🍝" },
  { id: "asia",        lon: 100, lat: 30,  name: "Asia",         col: "#48cae4", flag: "🍜" },
  { id: "africa",      lon: 20,  lat: 5,   name: "Africa",       col: "#95d44a", flag: "🥘" },
  { id: "americas",   lon: -80, lat: 12,  name: "Americas",     col: "#ff7f50", flag: "🌮" },
  { id: "middleeast", lon: 45,  lat: 28,  name: "Middle East",  col: "#ffd166", flag: "🧆" },
  { id: "oceania",    lon: 135, lat: -25, name: "Oceania",      col: "#06d6a0", flag: "🐟" },
];

export function Globe({
  width = 320,
  height = 200,
  radius = 90,
  className,
  style,
  onContinentClick,
}: {
  width?: number;
  height?: number;
  radius?: number;
  className?: string;
  style?: React.CSSProperties;
  onContinentClick?: (continent: ContinentDot) => void;
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const rotYRef      = useRef(0);
  const velYRef      = useRef(0.005);
  const isDragRef    = useRef(false);
  const lastXRef     = useRef(0);
  const moveDistRef  = useRef(0);   // total drag distance — distinguishes click from drag
  const rafRef       = useRef(0);
  const onClickRef   = useRef(onContinentClick);

  useEffect(() => { onClickRef.current = onContinentClick; }, [onContinentClick]);

  const toXY = useCallback((lon: number, lat: number, rotY: number, rotX: number, R: number, CX: number, CY: number) => {
    const lam = (lon * Math.PI) / 180 + rotY;
    const phi = (lat * Math.PI) / 180 + rotX;
    const x = R * Math.cos(phi) * Math.sin(lam);
    const y = R * Math.sin(phi);
    const z = R * Math.cos(phi) * Math.cos(lam);
    return { x: CX + x, y: CY - y, z };
  }, []);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width  = width  * dpr;
    canvas.height = height * dpr;
    canvas.style.width  = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    const W  = width, H = height, R = radius;
    const CX = W / 2, CY = H / 2;
    const rotX = 0.28;

    // Landmass blobs: [lon, lat, radiusDeg]
    const LAND: [number, number, number, string][] = [
      // Europe
      [10, 55, 18, "#4a9e5c"],  [20, 45, 14, "#4a9e5c"],  [5, 52, 12, "#4a9e5c"],
      // Asia
      [80, 40, 28, "#3d8b55"],  [110, 25, 22, "#3d8b55"],  [130, 45, 16, "#4a9e5c"],
      [60, 55, 20, "#3d8b55"],  [90, 55, 18, "#3d8b55"],   [45, 30, 14, "#5aab69"],
      // Africa
      [18, 10, 28, "#5aab69"],  [20, -15, 22, "#4a9e5c"],  [30, 5, 18, "#5aab69"],
      [35, -25, 15, "#4a9e5c"],
      // Americas
      [-90, 45, 22, "#4a9e5c"], [-80, 35, 18, "#4a9e5c"], [-100, 55, 18, "#3d8b55"],
      [-70, 5,  18, "#5aab69"], [-60, -15, 22, "#4a9e5c"], [-65, -35, 16, "#4a9e5c"],
      // Australia / Oceania
      [133, -25, 20, "#4a9e5c"], [150, -30, 12, "#5aab69"],
      // Greenland
      [-42, 70, 14, "#6ab87a"],
      // Middle East
      [45, 30, 12, "#5aab69"],
    ];

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      /* Atmosphere glow */
      const atmo = ctx.createRadialGradient(CX, CY, R * 0.75, CX, CY, R * 1.45);
      atmo.addColorStop(0, "rgba(56,140,230,0.22)");
      atmo.addColorStop(0.6, "rgba(30,100,200,0.08)");
      atmo.addColorStop(1, "transparent");
      ctx.fillStyle = atmo;
      ctx.beginPath();
      ctx.arc(CX, CY, R * 1.45, 0, Math.PI * 2);
      ctx.fill();

      /* Ocean */
      const ocean = ctx.createRadialGradient(CX - R * 0.3, CY - R * 0.3, R * 0.05, CX, CY, R);
      ocean.addColorStop(0,   "#5baff5");
      ocean.addColorStop(0.35,"#2176c7");
      ocean.addColorStop(0.75,"#1254a4");
      ocean.addColorStop(1,   "#0c3a7a");
      ctx.fillStyle = ocean;
      ctx.beginPath();
      ctx.arc(CX, CY, R, 0, Math.PI * 2);
      ctx.fill();

      /* Clip everything to sphere */
      ctx.save();
      ctx.beginPath();
      ctx.arc(CX, CY, R, 0, Math.PI * 2);
      ctx.clip();

      /* Landmass blobs */
      LAND.forEach(([lon, lat, sz, col]) => {
        const p = toXY(lon, lat, rotYRef.current, rotX, R, CX, CY);
        if (p.z < -10) return;
        const sc = Math.max(0.4, p.z / R);
        const rx = sz * (R / 90) * sc * 1.0;
        const ry = sz * (R / 90) * sc * 0.75;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, rx, ry, 0, 0, Math.PI * 2);
        ctx.fillStyle = col;
        ctx.fill();
        // Add slight texture variation
        ctx.beginPath();
        ctx.ellipse(p.x - rx * 0.15, p.y - ry * 0.1, rx * 0.6, ry * 0.5, 0.3, 0, Math.PI * 2);
        ctx.fillStyle = col + "aa";
        ctx.fill();
      });

      ctx.restore();

      /* Grid lines (atop ocean, below dots) */
      ctx.save();
      ctx.beginPath();
      ctx.arc(CX, CY, R, 0, Math.PI * 2);
      ctx.clip();
      ctx.strokeStyle = "rgba(160,210,255,0.18)";
      ctx.lineWidth = 0.6;
      for (let la = -60; la <= 60; la += 30) {
        ctx.beginPath();
        let f = true;
        for (let lo = -180; lo <= 180; lo += 4) {
          const p = toXY(lo, la, rotYRef.current, rotX, R, CX, CY);
          if (p.z > -10) { f ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y); f = false; }
          else f = true;
        }
        ctx.stroke();
      }
      for (let lo = 0; lo < 360; lo += 30) {
        ctx.beginPath();
        let f = true;
        for (let la = -85; la <= 85; la += 4) {
          const p = toXY(lo, la, rotYRef.current, rotX, R, CX, CY);
          if (p.z > -10) { f ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y); f = false; }
          else f = true;
        }
        ctx.stroke();
      }
      ctx.restore();

      /* Continent dots + labels */
      CONTINENT_DOTS.forEach((d) => {
        const p = toXY(d.lon, d.lat, rotYRef.current, rotX, R, CX, CY);
        if (p.z < 0) return;
        const sc = Math.max(0.45, p.z / R);

        // Glow halo
        const gl = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 28 * sc);
        gl.addColorStop(0, d.col + "99");
        gl.addColorStop(0.5, d.col + "44");
        gl.addColorStop(1, "transparent");
        ctx.fillStyle = gl;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 28 * sc, 0, Math.PI * 2);
        ctx.fill();

        // Dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, 8 * sc, 0, Math.PI * 2);
        ctx.fillStyle = d.col;
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.85)";
        ctx.lineWidth = 2 * sc;
        ctx.stroke();

        // Label
        if (sc > 0.42) {
          const fs = Math.round(Math.max(10, 13 * sc));
          ctx.font = `700 ${fs}px DM Sans, sans-serif`;
          ctx.textAlign = "center";
          ctx.shadowColor = "rgba(0,0,0,0.75)";
          ctx.shadowBlur = 8;
          ctx.fillStyle = "white";
          ctx.fillText(d.name, p.x, p.y + 20 * sc);
          ctx.shadowBlur = 0;
        }
      });

      /* Specular shine */
      const shine = ctx.createRadialGradient(CX - R * 0.38, CY - R * 0.38, 4, CX - R * 0.2, CY - R * 0.2, R * 0.65);
      shine.addColorStop(0, "rgba(255,255,255,0.20)");
      shine.addColorStop(0.4, "rgba(255,255,255,0.06)");
      shine.addColorStop(1, "transparent");
      ctx.fillStyle = shine;
      ctx.beginPath();
      ctx.arc(CX, CY, R, 0, Math.PI * 2);
      ctx.fill();

      /* Rim shadow */
      const rim = ctx.createRadialGradient(CX, CY, R * 0.78, CX, CY, R);
      rim.addColorStop(0, "transparent");
      rim.addColorStop(1, "rgba(5,20,50,0.50)");
      ctx.fillStyle = rim;
      ctx.beginPath();
      ctx.arc(CX, CY, R, 0, Math.PI * 2);
      ctx.fill();

      /* Auto-rotate */
      if (!isDragRef.current) {
        rotYRef.current += velYRef.current;
        velYRef.current = velYRef.current * 0.998 + 0.005 * 0.002;
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    const onDown = (e: PointerEvent) => {
      isDragRef.current = true;
      moveDistRef.current = 0;
      lastXRef.current = e.clientX;
      velYRef.current = 0;
      try { canvas.setPointerCapture(e.pointerId); } catch { /* ignore */ }
    };
    const onMove = (e: PointerEvent) => {
      if (!isDragRef.current) return;
      const dx = e.clientX - lastXRef.current;
      moveDistRef.current += Math.abs(dx);
      velYRef.current = dx * 0.01;
      rotYRef.current += velYRef.current;
      lastXRef.current = e.clientX;
    };
    const onUp = (e: PointerEvent) => {
      isDragRef.current = false;

      // Only treat as a click if the pointer barely moved (< 6px total)
      if (moveDistRef.current > 6) return;

      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      for (const d of CONTINENT_DOTS) {
        const p = toXY(d.lon, d.lat, rotYRef.current, rotX, R, CX, CY);
        if (p.z < 0) continue;
        const sc = Math.max(0.45, p.z / R);
        // Generous hit radius — easier to tap the label area below the dot
        const hitR = 52 * sc;
        const ddx = mx - p.x, ddy = my - (p.y + 10 * sc); // centre on label too
        if (ddx * ddx + ddy * ddy <= hitR * hitR) {
          onClickRef.current?.(d);
          break;
        }
      }
    };

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup",   onUp);

    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup",   onUp);
    };
  }, [radius, width, height, toXY]);

  return (
    <canvas
      ref={ref}
      width={width}
      height={height}
      className={className}
      style={{ cursor: "grab", ...style }}
    />
  );
}
