import React, { useEffect, useState } from 'react';

const SakuraParticles: React.FC = () => {
  const [particles, setParticles] = useState<Array<{ id: number; left: string; duration: string; delay: string; size: string; type: 'petal' | 'snow' }>>([]);

  useEffect(() => {
    const particleCount = 28; // 18 petals + 10 snowflakes
    const newParticles = Array.from({ length: particleCount }).map((_, i) => {
      const isPetal = i < 18;
      const size = isPetal ? Math.random() * 10 + 10 + 'px' : Math.random() * 4 + 4 + 'px'; // Petals 10-20px, Snow 4-8px

      return {
        id: i,
        left: Math.random() * 100 + '%',
        duration: Math.random() * 20 + 20 + 's', // 20-40s duration
        delay: -Math.random() * 40 + 's', // Start immediately with negative delay
        size,
        type: isPetal ? 'petal' : 'snow' as const,
      };
    });
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]">
      {particles.map((p) => (
        <div
          key={p.id}
          className={`absolute opacity-20 animate-sakura-fall ${p.type === 'petal'
              ? 'bg-gradient-to-br from-sakura-light to-sakura rounded-[150%_0_150%_0]'
              : 'bg-white rounded-full blur-[1px]'
            }`}
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animationDuration: p.duration,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  );
};

export default SakuraParticles;
