import { useEffect, useRef } from "react";

/**
 * Fundo nebuloso com “blobs” de cor que se movem lentamente.
 * Transparente por padrão (não tampa seu conteúdo).
 *
 * Props:
 * - blobs:        quantidade de blobs (default 6)
 * - maxRadius:    raio máximo em px (default 420)
 * - speed:        velocidade de drift (0.02 ~ 0.1 recomendado)
 * - hueBase:      matiz base (ex.: 195 ~ ciano)
 * - alpha:        opacidade máxima de cada blob (0.04 ~ 0.16)
 * - className:    classes extras (opcional)
 */
export function GalaxyNebulaBackground({
  blobs = 6,
  maxRadius = 420,
  speed = 0.05,
  hueBase = 195,
  alpha = 0.1,
  className = "",
}) {
  const ref = useRef(null);
  const rafRef = useRef();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true }); // fundo transparente

    let w = 0,
      h = 0,
      t = 0;
    let nodes = [];

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;

      // cria blobs com posições/velocidades diferentes
      nodes = Array.from({ length: blobs }, () => {
        const r = (0.55 + Math.random() * 0.45) * maxRadius; // 55% ~ 100% do max
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r,
          // drift suave em direções variadas
          vx: (Math.random() * 2 - 1) * speed,
          vy: (Math.random() * 2 - 1) * speed,
          // tons variando ao redor do hueBase
          hue: hueBase + (Math.random() * 30 - 15),
          // alpha de cada blob (ligeira variação)
          a: alpha * (0.7 + Math.random() * 0.6),
        };
      });
    }
    resize();
    window.addEventListener("resize", resize);

    function tick(ts) {
      t = ts * 0.001; // segundos
      ctx.clearRect(0, 0, w, h);

      // composição aditiva para somar cores
      ctx.globalCompositeOperation = "lighter";

      // camada sutil de “fumaça” (granulado bem leve)
      // (mantém transparente sem apagar seu fundo)
      // opcional: comente se não quiser o véu
      // ctx.fillStyle = "rgba(0,0,0,0.0)";
      // ctx.fillRect(0, 0, w, h);

      for (const n of nodes) {
        // move lentamente
        n.x += n.vx;
        n.y += n.vy;

        // bounce macio na borda
        if (n.x < -n.r) n.x = w + n.r;
        if (n.x > w + n.r) n.x = -n.r;
        if (n.y < -n.r) n.y = h + n.r;
        if (n.y > h + n.r) n.y = -n.r;

        // “respiração” leve no raio
        const rr = n.r * (0.97 + Math.sin(t + n.hue) * 0.02);

        // gradiente radial do blob
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, rr);
        const c1 = `hsla(${n.hue}, 95%, 60%, ${n.a})`;
        const c2 = `hsla(${n.hue + 8}, 90%, 55%, ${n.a * 0.5})`;
        grad.addColorStop(0.0, c1);
        grad.addColorStop(0.45, c2);
        grad.addColorStop(1.0, "rgba(0,0,0,0)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(n.x, n.y, rr, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [blobs, maxRadius, speed, hueBase, alpha]);

  return (
    <canvas
      ref={ref}
      className={`absolute inset-0 ${className}`}
      style={{
        pointerEvents: "none",
        background: "transparent",
      }}
      aria-hidden="true"
    />
  );
}
