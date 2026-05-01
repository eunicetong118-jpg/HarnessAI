"use client";

import React, { useEffect, useRef } from 'react';

export default function GoldCoinRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    const coins: Coin[] = [];
    const coinCount = 80; // More prominent

    class Coin {
      x: number;
      y: number;
      size: number;
      speed: number;
      opacity: number;
      rotationX: number;
      rotationY: number;
      rotationZ: number;
      rotationSpeedX: number;
      rotationSpeedY: number;
      rotationSpeedZ: number;
      type: 'coin' | 'dollar';

      constructor() {
        this.reset();
        this.y = Math.random() * height; // Initial scatter
      }

      reset() {
        this.x = Math.random() * width;
        this.y = -50;
        this.size = Math.random() * 15 + 10; // Larger
        this.speed = Math.random() * 3 + 2;
        this.opacity = Math.random() * 0.6 + 0.3; // More visible
        this.rotationX = Math.random() * Math.PI * 2;
        this.rotationY = Math.random() * Math.PI * 2;
        this.rotationZ = Math.random() * Math.PI * 2;
        this.rotationSpeedX = Math.random() * 0.1;
        this.rotationSpeedY = Math.random() * 0.1;
        this.rotationSpeedZ = Math.random() * 0.05;
        this.type = Math.random() > 0.3 ? 'coin' : 'dollar';
      }

      update() {
        this.y += this.speed;
        this.rotationX += this.rotationSpeedX;
        this.rotationY += this.rotationSpeedY;
        this.rotationZ += this.rotationSpeedZ;

        if (this.y > height + 50) {
          this.reset();
        }
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.translate(this.x, this.y);

        // 3D-ish rotation effect using scaling
        const scaleX = Math.cos(this.rotationX);
        const scaleY = Math.sin(this.rotationY);
        ctx.scale(scaleX, scaleY);
        ctx.rotate(this.rotationZ);

        ctx.globalAlpha = this.opacity;

        if (this.type === 'coin') {
          // Draw gold coin
          const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
          gradient.addColorStop(0, '#FDE047'); // yellow-300
          gradient.addColorStop(0.5, '#F59E0B'); // amber-500
          gradient.addColorStop(1, '#B45309'); // amber-700

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(0, 0, this.size, 0, Math.PI * 2);
          ctx.fill();

          // Coin edge
          ctx.strokeStyle = '#78350F';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Inner detail
          ctx.strokeStyle = '#FDE047';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(0, 0, this.size * 0.7, 0, Math.PI * 2);
          ctx.stroke();

          ctx.fillStyle = '#78350F';
          ctx.font = `bold ${this.size}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('$', 0, 0);
        } else {
          // Draw floating dollar sign
          ctx.fillStyle = '#22C55E'; // green-500
          ctx.font = `bold ${this.size * 1.5}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#166534';
          ctx.fillText('$', 0, 0);
        }

        ctx.restore();
      }
    }

    for (let i = 0; i < coinCount; i++) {
      coins.push(new Coin());
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      coins.forEach((coin) => {
        coin.update();
        coin.draw();
      });
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
}
