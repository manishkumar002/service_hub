
import React, { useEffect, useRef } from "react";

function FloatingBubbles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const bubbles = [];

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resizeCanvas);

    class Bubble {
      constructor(x, y, angle) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 2 + 2;

        const speed = Math.random() * 2 + 0.5;

        this.speedX = Math.cos(angle) * speed;
        this.speedY = Math.sin(angle) * speed;

        this.opacity = 1;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.opacity -= 0.01;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,220,255,${this.opacity})`;
        ctx.fill();
      }
    }

    const handleMove = (e) => {
      const header = document.querySelector(".site-header");
      const headerHeight = header ? header.offsetHeight : 0;

      let y = e.clientY;
      if (y <= headerHeight) {
        y = headerHeight + 2;
      }

      const total = 3;

      // circle explosion
      for (let i = 0; i < total; i++) {
        const angle = (Math.PI * 2 * i) / total;
        bubbles.push(new Bubble(e.clientX, y, angle));
      }
    };

    window.addEventListener("mousemove", handleMove);

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // random bubbles
      if (Math.random() < 0.01) {
        const header = document.querySelector(".site-header");
        const headerHeight = header ? header.offsetHeight : 0;

        const randomX = Math.random() * canvas.width;
        const randomY =
          Math.random() * (canvas.height - headerHeight) + headerHeight;

        const angle = Math.random() * Math.PI * 2;

        bubbles.push(new Bubble(randomX, randomY, angle));
      }

      for (let i = 0; i < bubbles.length; i++) {
        bubbles[i].update();
        bubbles[i].draw();

        if (bubbles[i].opacity <= 0) {
          bubbles.splice(i, 1);
          i--;
        }
      }

      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 1
      }}
    />
  );
}

export default FloatingBubbles;

