"use client";

import { useState } from "react";

export interface MapRegion {
  id: string;
  name: string;
}

interface WorldMapProps {
  onContinentClick?: (region: MapRegion) => void;
}

// Equirectangular projection: x = (lon+180)*2.5, y = (90-lat)*2.5  →  900×450 viewport
const CONTINENTS: {
  id: string;
  name: string;
  color: string;
  hover: string;
  labelX: number;
  labelY: number;
  polygons: string[];
}[] = [
  {
    id: "americas",
    name: "Americas",
    color: "#ff7f50",
    hover: "#d95f30",
    labelX: 190,
    labelY: 165,
    polygons: [
      // North + South America combined (clockwise)
      "25,45 100,75 137,105 155,150 188,175 233,205 250,205 250,263 288,363 313,363 320,310 350,275 363,238 325,225 295,213 263,200 263,163 280,108 320,108 313,70 263,63 238,45 175,38 100,40",
      // Greenland
      "270,45 340,18 405,35 400,63 338,80 305,60",
    ],
  },
  {
    id: "europe",
    name: "Europe",
    color: "#f4a261",
    hover: "#d4823f",
    labelX: 488,
    labelY: 95,
    polygons: [
      "425,135 520,135 555,133 563,120 550,88 520,75 500,63 488,50 470,45 455,80 445,80 425,115",
    ],
  },
  {
    id: "africa",
    name: "Africa",
    color: "#95d44a",
    hover: "#6ab828",
    labelX: 490,
    labelY: 232,
    polygons: [
      "405,188 408,133 438,133 475,130 513,133 543,150 555,188 588,195 575,225 555,255 538,288 518,313 495,310 483,288 475,238 450,218 438,213",
    ],
  },
  {
    id: "asia",
    name: "Asia",
    color: "#48cae4",
    hover: "#20aac8",
    labelX: 678,
    labelY: 118,
    polygons: [
      // Asia main (includes Arabia beneath — Middle East drawn on top)
      "513,125 513,50 575,45 650,43 775,50 813,63 813,100 800,138 750,170 720,175 700,213 738,238 650,205 638,170 600,170 600,133 555,133",
    ],
  },
  {
    id: "middleeast",
    name: "Middle East",
    color: "#ffd166",
    hover: "#ffb030",
    labelX: 565,
    labelY: 168,
    polygons: [
      "513,133 600,133 613,163 600,195 575,200 555,188 543,150",
    ],
  },
  {
    id: "oceania",
    name: "Oceania",
    color: "#06d6a0",
    hover: "#04b680",
    labelX: 782,
    labelY: 300,
    polygons: [
      // Australia
      "735,280 745,275 775,255 795,255 790,263 795,270 805,270 830,288 838,295 835,320 818,325 810,320 795,313 775,305 750,310 735,295",
      // New Zealand (simplified)
      "868,328 875,318 882,320 879,335 871,338",
    ],
  },
];

export function WorldMap({ onContinentClick }: WorldMapProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div style={{ width: "100%", maxWidth: 900, margin: "0 auto" }}>
      <svg
        viewBox="0 0 900 450"
        style={{
          width: "100%",
          height: "auto",
          borderRadius: 16,
          boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
          display: "block",
        }}
        aria-label="World map — click a region to explore"
      >
        <defs>
          <linearGradient id="wm-ocean" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1565a8" />
            <stop offset="100%" stopColor="#0a3d7a" />
          </linearGradient>
          <filter id="wm-shadow" x="-5%" y="-5%" width="110%" height="110%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="rgba(0,0,0,0.3)" />
          </filter>
        </defs>

        {/* Ocean background */}
        <rect width="900" height="450" fill="url(#wm-ocean)" rx="16" ry="16" />

        {/* Graticule lines (subtle grid) */}
        {[-60, -30, 30, 60].map((lat) => (
          <line
            key={`lat-${lat}`}
            x1="0" y1={(90 - lat) * 2.5}
            x2="900" y2={(90 - lat) * 2.5}
            stroke="rgba(255,255,255,0.07)" strokeWidth="1"
          />
        ))}
        {[-120, -60, 0, 60, 120].map((lon) => (
          <line
            key={`lon-${lon}`}
            x1={(lon + 180) * 2.5} y1="0"
            x2={(lon + 180) * 2.5} y2="450"
            stroke="rgba(255,255,255,0.07)" strokeWidth="1"
          />
        ))}
        {/* Equator — slightly more visible */}
        <line
          x1="0" y1="225" x2="900" y2="225"
          stroke="rgba(255,255,255,0.18)" strokeWidth="1"
          strokeDasharray="6 4"
        />

        {/* Continents — drawn in z-order (Middle East on top of Asia) */}
        {CONTINENTS.map(({ id, name, color, hover, labelX, labelY, polygons }) => {
          const isHovered = hoveredId === id;
          return (
            <g
              key={id}
              style={{ cursor: "pointer" }}
              onMouseEnter={() => setHoveredId(id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => onContinentClick?.({ id, name })}
              role="button"
              aria-label={`Explore ${name} cuisine`}
            >
              {polygons.map((pts, i) => (
                <polygon
                  key={i}
                  points={pts}
                  fill={isHovered ? hover : color}
                  stroke="rgba(255,255,255,0.55)"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                  filter="url(#wm-shadow)"
                  style={{ transition: "fill 150ms ease" }}
                />
              ))}
              {/* Continent label */}
              <text
                x={labelX}
                y={labelY}
                textAnchor="middle"
                fill={isHovered ? "white" : "rgba(255,255,255,0.88)"}
                fontSize="10.5"
                fontWeight="800"
                fontFamily="system-ui, -apple-system, sans-serif"
                letterSpacing="0.05em"
                style={{
                  pointerEvents: "none",
                  userSelect: "none",
                  textTransform: "uppercase",
                  transition: "fill 150ms ease",
                  textShadow: "0 1px 3px rgba(0,0,0,0.6)",
                }}
              >
                {name}
              </text>
            </g>
          );
        })}

        {/* Hover tooltip banner at bottom of SVG */}
        {hoveredId && (
          <g style={{ pointerEvents: "none" }}>
            <rect
              x="50%" y="420" width="200" height="22"
              transform="translate(-100,0)"
              rx="11" fill="rgba(0,0,0,0.55)"
            />
            <text
              x="450" y="435"
              textAnchor="middle"
              fill="white"
              fontSize="11"
              fontWeight="700"
              fontFamily="system-ui, sans-serif"
              style={{ userSelect: "none" }}
            >
              Click to explore {CONTINENTS.find((c) => c.id === hoveredId)?.name}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
