import { useEffect, useRef } from "react";

export function StarfieldBackground({
  // estrelas "fixas"
  density = 0.00016, // quanto mais alto, mais estrelas
  speed = 0.08, // queda vertical das estrelas fixas

  // cadentes (meteoros)
  shootRate = 0.0012, // chance por frame de nascer um meteoro
  meteorSpeed = 420, // px/seg na diagonal do meteoro
  trailLength = 14, // quantos pontos o rastro guarda
  meteorWidth = 1.5, // espessura do traço do meteoro

  className = "",
}) {
  const ref = useRef(null);
  const rafRef = useRef();

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d", { alpha: true });

    let w = 0,
      h = 0,
      dpr = Math.max(1, window.devicePixelRatio || 1);
    let stars = [];
    let meteors = [];
    let lastTs = 0;

    function resize() {
      const rw = window.innerWidth;
      const rh = window.innerHeight;

      // escala para DPR
      canvas.style.width = rw + "px";
      canvas.style.height = rh + "px";
      canvas.width = Math.floor(rw * dpr);
      canvas.height = Math.floor(rh * dpr);

      w = canvas.width;
      h = canvas.height;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // normaliza desenho
      const count = Math.floor(rw * rh * density);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * rw,
        y: Math.random() * rh,
        r: Math.random() * 1.1 + 0.3,
        a: Math.random() * 0.6 + 0.2,
      }));
    }
    resize();
    window.addEventListener("resize", resize);

    function spawnMeteor() {
      // nasce no terço superior com leve viés à direita
      const rw = canvas.clientWidth;
      const rh = canvas.clientHeight;

      const sx = Math.random() * rw * 0.8 + rw * 0.1;
      const sy = Math.random() * rh * 0.3;

      // direção levemente diagonal (≈ 135°)
      const angle = Math.PI * (0.7 + Math.random() * 0.06);
      const vx = Math.cos(angle) * meteorSpeed;
      const vy = Math.sin(angle) * meteorSpeed;

      const life = 0.8 + Math.random() * 0.9; // 0.8–1.7s
      meteors.push({
        x: sx,
        y: sy,
        vx,
        vy,
        age: 0,
        life,
        path: [], // histórico p/ rastro
      });

      // evita acumular meteoro demais
      if (meteors.length > 24) meteors.shift();
    }

    function draw(ts) {
      const tsSec = ts / 1000;
      const dt = lastTs ? Math.min(0.033, tsSec - lastTs) : 0; // clamp ~30fps dt
      lastTs = tsSec;

      const rw = canvas.clientWidth;
      const rh = canvas.clientHeight;

      // Limpa canvas
      ctx.clearRect(0, 0, rw, rh);

      // Estrelas fixas
      ctx.globalCompositeOperation = "source-over";
      for (const s of stars) {
        ctx.fillStyle = `rgba(255,255,255,${s.a})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();

        s.y += speed; // queda lenta
        if (s.y > rh + 5) s.y = -5;
      }

      // Criar novos meteoros (estocástico)
      if (Math.random() < shootRate) spawnMeteor();

      // Desenhar meteoros com rastro
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.age += dt;

        // atualiza posição
        m.x += m.vx * dt;
        m.y += m.vy * dt;

        // guarda histórico do rastro
        m.path.unshift({ x: m.x, y: m.y });
        if (m.path.length > trailLength) m.path.pop();

        // vida normalizada 0..1
        const t = Math.min(1, m.age / m.life);
        const alphaHead = (1 - t) * 0.9 + 0.1; // some suavemente

        // desenha do fim para o começo, reduzindo opacidade/espessura
        for (let p = 0; p < m.path.length - 1; p++) {
          const a = alphaHead * (1 - p / m.path.length); // fade rastro
          const wLine = meteorWidth * (1 - p / (m.path.length * 1.15)); // afina

          const p0 = m.path[p];
          const p1 = m.path[p + 1];

          // gradiente do segmento
          const grd = ctx.createLinearGradient(p0.x, p0.y, p1.x, p1.y);
          grd.addColorStop(0, `rgba(255,255,255,${a})`);
          grd.addColorStop(1, `rgba(255,255,255,${Math.max(0, a - 0.25)})`);

          ctx.strokeStyle = grd;
          ctx.lineWidth = wLine;
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.stroke();
        }

        // remove se saiu da tela ou a vida acabou
        const out =
          m.x < -50 || m.x > rw + 50 || m.y > rh + 50 || m.age > m.life;
        if (out) meteors.splice(i, 1);
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [density, speed, shootRate, meteorSpeed, trailLength, meteorWidth]);

  return (
    <canvas
      ref={ref}
      className={`absolute inset-0 z-0 ${className}`}
      style={{ pointerEvents: "none", background: "transparent" }}
    />
  );
}
