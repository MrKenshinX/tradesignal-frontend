'use client';
import { useEffect, useRef } from 'react';

interface Star {
  x: number; y: number; z: number; px: number; py: number;
}

export function StarfieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const STAR_COUNT = 200;
    const stars: Star[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: (Math.random() - 0.5) * canvas.width * 3,
        y: (Math.random() - 0.5) * canvas.height * 3,
        z: Math.random() * 1500,
        px: 0, py: 0,
      });
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(6, 11, 24, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      stars.forEach((star) => {
        star.z -= 2;
        if (star.z <= 0) {
          star.x = (Math.random() - 0.5) * canvas.width * 3;
          star.y = (Math.random() - 0.5) * canvas.height * 3;
          star.z = 1500;
          star.px = 0; star.py = 0;
        }

        const sx = (star.x / star.z) * 800 + cx;
        const sy = (star.y / star.z) * 800 + cy;
        const size = Math.max(0.1, (1 - star.z / 1500) * 2.5);
        const opacity = 1 - star.z / 1500;

        if (star.px !== 0) {
          ctx.beginPath();
          ctx.moveTo(star.px, star.py);
          ctx.lineTo(sx, sy);
          ctx.strokeStyle = `rgba(0, 212, 255, ${opacity * 0.6})`;
          ctx.lineWidth = size * 0.5;
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(sx, sy, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${opacity > 0.7 ? '0, 212, 255' : '255, 255, 255'}, ${opacity})`;
        ctx.fill();

        star.px = sx;
        star.py = sy;
      });

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  );
}
