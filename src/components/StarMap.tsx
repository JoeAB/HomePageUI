import React, { useEffect, useRef, useState } from "react";
import Papa from "papaparse";

interface Star {
  name: string;
  ra: number;
  dec: number;
  mag: number;
  dist_pc: number;
  sp_type: string;
  dist_ly: number;
}

const StarMap: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stars, setStars] = useState<Star[]>([]);
  const [displayStars, setDisplayStars] = useState<Star[]>([]);
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

  const projectCoordinates = (
    star: Star,
    bounds: ReturnType<typeof getBounds>,
    canvas: HTMLCanvasElement
  ) => {
    const xNorm = (star.ra - bounds.raMin) / (bounds.raMax - bounds.raMin || 1);
    const yNorm = 1 - (star.dec - bounds.decMin) / (bounds.decMax - bounds.decMin || 1); 
    return { x: xNorm * canvas.width, y: yNorm * canvas.height };
  };

  const drawStars = (starsToDraw: Star[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bounds = getBounds(starsToDraw);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    starsToDraw.forEach((star) => {
      const { x, y } = projectCoordinates(star, bounds, canvas);
      const radius = Math.max(1, 6 - star.mag);

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
  };

  const pickRandomStars = () => {
    if (!stars.length) return;
    const shuffled = [...stars].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 25);
    setDisplayStars(selected);
    drawStars(selected);
  };

  useEffect(() => {
    fetch("/stars.csv")
      .then((res) => res.text())
      .then((text) => {
        const parsed = Papa.parse<Star>(text, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
        });
        setStars(parsed.data);
      })
      .catch((err) => console.error("CSV load error:", err));
  }, []);

  useEffect(() => {
    if (stars.length) pickRandomStars();
  }, [stars]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !displayStars.length) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    setMousePos({ x: mouseX, y: mouseY });

    const bounds = getBounds(displayStars);
    let foundStar: Star | null = null;

    for (const star of displayStars) {
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
        <div
          style={{
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
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <strong>{hoveredStar.name}</strong>
          <br />
          Magnitude: {hoveredStar.mag.toFixed(1)}
          <br />
          RA: {hoveredStar.ra.toFixed(2)}h, Dec: {hoveredStar.dec.toFixed(1)}°
        </div>
      )}
      <div style={{ color: "white", fontSize: "12px", marginTop: "10px" }}>
        Stars loaded: {stars.length} | Showing: {displayStars.length}
      </div>
      <button onClick={pickRandomStars} style={{ marginTop: "10px" }}>
        Redraw
      </button>
    </div>
  );
};

export default StarMap;
