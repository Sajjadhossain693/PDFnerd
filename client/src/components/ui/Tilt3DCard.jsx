import { useRef } from 'react';

/**
 * Tilt3DCard:
 * Provides cursor-driven 3D tilt with depth perspective and an interactive
 * radial spotlight sheen that follows the user's cursor across the surface.
 * Uses direct DOM manipulation via requestAnimationFrame to avoid re-rendering
 * children during mousemove events, preserving click detection and hit-testing in Chrome.
 */
export default function Tilt3DCard({
  children,
  className = '',
  maxTilt = 12,
  glare = true,
  scale = 1.02,
  ...props
}) {
  const cardRef = useRef(null);
  const innerRef = useRef(null);
  const glareRef = useRef(null);
  const rafId = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current || !innerRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }

    rafId.current = requestAnimationFrame(() => {
      if (innerRef.current) {
        innerRef.current.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`;
        innerRef.current.style.transition = 'transform 0.08s ease-out';
      }
      if (glare && glareRef.current) {
        glareRef.current.style.opacity = '0.18';
        glareRef.current.style.background = `radial-gradient(circle 240px at ${glareX.toFixed(1)}% ${glareY.toFixed(1)}%, rgba(255, 255, 255, 0.45), transparent 70%)`;
      }
    });
  };

  const handleMouseEnter = () => {
    if (innerRef.current) {
      innerRef.current.style.transition = 'transform 0.08s ease-out';
    }
  };

  const handleMouseLeave = () => {
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }
    if (innerRef.current) {
      innerRef.current.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
      innerRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    }
    if (glare && glareRef.current) {
      glareRef.current.style.opacity = '0';
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative ${className}`}
      {...props}
    >
      <div
        ref={innerRef}
        style={{
          transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          willChange: 'transform',
        }}
        className="w-full h-full rounded-inherit relative overflow-hidden"
      >
        {children}

        {/* Cursor-driven radial glare sheen */}
        {glare && (
          <div
            ref={glareRef}
            className="pointer-events-none absolute inset-0 z-30 rounded-inherit transition-opacity duration-300"
            style={{
              opacity: 0,
            }}
          />
        )}
      </div>
    </div>
  );
}
