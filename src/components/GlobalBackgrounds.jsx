// src/components/GlobalBackgrounds.jsx
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

import { StarfieldBackground } from "./StarfieldBackground";
import { GalaxyNebulaBackground } from "./GalaxyNebulaBackground";
import TechLinesBackground from "./TechLinesBackground";

/**
 * Fundo global persistente em todas as páginas.
 * Cria um portal fixo atrás de todo o conteúdo.
 */
export default function GlobalBackgrounds() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 -z-50 pointer-events-none"
      style={{ zIndex: 10 }}
      aria-hidden
    >
      {/* Fundo nebuloso suave */}
      <GalaxyNebulaBackground
        blobs={7}
        maxRadius={460}
        speed={0.05}
        hueBase={195} // tonalidade azulada/ciano
        alpha={0.05} // transparência (ajusta a força da cor)
      />

      {/* Linhas técnicas (parallax leve) */}
      <TechLinesBackground />

      {/* Estrelas + estrelas cadentes */}
      <StarfieldBackground
        density={0.00016} // densidade de estrelas
        speed={0.06} // velocidade da "queda" das estrelas
        shootRate={0.003} // frequência das cadentes
        meteorSpeed={360} // velocidade dos rastros
        trailLength={16} // comprimento do rastro
        meteorWidth={1.6} // espessura
      />
    </div>,
    document.body
  );
}
