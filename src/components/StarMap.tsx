import React, { useEffect, useRef, useState } from "react";
import Papa from "papaparse";

interface Star {
  name: string;
  constellation: string;
  mag: number;
  ra: number;
  dec: number;
}

const StarMap: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stars, setStars] = useState<Star[]>([]);
  const [hoveredStar, setHoveredStar] = useState<Star | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  const getBounds = (stars: Star[]) => {
    const raValues = stars.map((s) => s.ra);
    const decValues = stars.map((s) => s.dec);
    return {
      raMin: Math.min(...raValues),
      raMax: Math.max(...raValues),
      decMin: Math.min(...decValues),
      decMax: Math.max(...decValues),
    };
  };

  useEffect(() => {
    if (!stars.length) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bounds = getBounds(stars);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    stars.forEach((star) => {
      const { x, y } = projectCoordinates(star, bounds, canvas);
      const radius = Math.max(1, 6 - star.mag); // ensure min size 1

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = "white";
      ctx.fill();

      if (star.mag < 2) {
        ctx.beginPath();
        ctx.arc(x, y, radius + 1, 0, 2 * Math.PI);
        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.fill();
      }
    });
  }, [stars]);


  const projectCoordinates = (star: Star, bounds: ReturnType<typeof getBounds>, canvas: HTMLCanvasElement) => {
    const xNorm = (star.ra - bounds.raMin) / (bounds.raMax - bounds.raMin || 1);
    const yNorm = 1 - (star.dec - bounds.decMin) / (bounds.decMax - bounds.decMin || 1); // invert Y
    const x = xNorm * canvas.width;
    const y = yNorm * canvas.height;
    return { x, y };
  };

  useEffect(() => {
    fetch("/stars.csv")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.text();
      })
      .then((text) => {
        const parsed = Papa.parse<Star>(text, { 
          header: true, 
          dynamicTyping: true,
          skipEmptyLines: true,
          transformHeader: (header) => header.trim().toLowerCase()
        });
        
        const validStars = parsed.data.filter((s) => 
          s.name && 
          typeof s.ra === 'number' && 
          typeof s.dec === 'number' && 
          typeof s.mag === 'number'
        );
        console.log(validStars);
        setStars(validStars);
      })
      .catch((err) => console.error("Failed to load CSV:", err));
  }, []);


  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !stars.length) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    setMousePos({ x: mouseX, y: mouseY });

    const bounds = getBounds(stars);
    let foundStar: Star | null = null;

    for (const star of stars) {
      const { x, y } = projectCoordinates(star, bounds, canvasRef.current);
      const radius = Math.max(1, 6 - star.mag);
      const dist = Math.hypot(mouseX - x, mouseY - y);
      if (dist < radius + 3) {
        foundStar = star;
        break;
      }
    }
    setHoveredStar(foundStar);
  };

  return (
    <div style={{ position: "relative" }}>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{ background: "black", border: "1px solid #333" }}
        onMouseMove={handleMouseMove}
      />
      {hoveredStar && mousePos && (
        <div style={{
          position: "absolute",
          left: mousePos.x + 10,
          top: mousePos.y + 10,
          background: "rgba(0,0,0,0.8)",
          color: "white",
          padding: "6px 10px",
          borderRadius: "4px",
          pointerEvents: "none",
          fontSize: "12px",
          whiteSpace: "nowrap",
          border: "1px solid rgba(255,255,255,0.2)"
        }}>
          <strong>{hoveredStar.name}</strong><br/>
          {hoveredStar.constellation !== "Unknown" && <>Constellation: {hoveredStar.constellation}<br/></>}
          Magnitude: {hoveredStar.mag.toFixed(1)}<br/>
          RA: {hoveredStar.ra.toFixed(2)}h, Dec: {hoveredStar.dec.toFixed(1)}°
        </div>
      )}
      <div style={{ color: "white", fontSize: "12px", marginTop: "10px" }}>
        Stars loaded: {stars.length}
      </div>
    </div>
  );
};

export default StarMap;
