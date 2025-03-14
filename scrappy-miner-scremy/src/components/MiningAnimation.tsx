
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface MiningAnimationProps {
  isActive: boolean;
  isMining: boolean;
  wasSuccessful?: boolean;
  onAnimationComplete?: () => void;
}

const MiningAnimation: React.FC<MiningAnimationProps> = ({
  isActive,
  isMining,
  wasSuccessful,
  onAnimationComplete
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<JSX.Element[]>([]);
  
  // Create success particles animation
  useEffect(() => {
    if (wasSuccessful && !isMining) {
      const newParticles = Array.from({ length: 20 }).map((_, index) => {
        const size = Math.random() * 10 + 5;
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 60 + 40;
        const duration = Math.random() * 1 + 0.5;
        const delay = Math.random() * 0.2;
        
        return (
          <div
            key={index}
            className="absolute rounded-full bg-scremy"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              opacity: 0,
              transform: 'translate(-50%, -50%)',
              left: '50%',
              top: '50%',
              animation: `particle ${duration}s ease-out ${delay}s forwards`
            }}
          />
        );
      });
      
      setParticles(newParticles);
      
      // Clear particles after animation completes
      const timer = setTimeout(() => {
        setParticles([]);
        if (onAnimationComplete) onAnimationComplete();
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [wasSuccessful, isMining, onAnimationComplete]);

  // Add the particle animation style
  useEffect(() => {
    if (!containerRef.current) return;
    
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes particle {
        0% {
          opacity: 0.8;
          transform: translate(-50%, -50%) scale(0);
        }
        100% {
          opacity: 0;
          transform: translate(
            calc(-50% + var(--x) * var(--distance)),
            calc(-50% + var(--y) * var(--distance))
          ) scale(1);
        }
      }
    `;
    containerRef.current.appendChild(style);
    
    return () => {
      if (containerRef.current && containerRef.current.contains(style)) {
        containerRef.current.removeChild(style);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-64 overflow-hidden">
      {/* Background elements */}
      <div className={cn(
        "absolute inset-0 transition-opacity duration-500",
        isActive ? "opacity-100" : "opacity-0"
      )}>
        <div className="absolute inset-0 bg-gradient-to-b from-scremy/5 to-transparent" />
        
        {/* Center circle */}
        <div className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border transition-all duration-1000",
          isMining ? "border-scremy/40 animate-spin-slow" : "border-muted",
          wasSuccessful ? "scale-110" : "scale-100"
        )}>
          {/* Inner circles */}
          <div className={cn(
            "absolute inset-2 rounded-full border transition-all duration-700",
            isMining ? "border-scremy/30 animate-spin-slow" : "border-muted/50"
          )} />
          <div className={cn(
            "absolute inset-4 rounded-full border transition-all duration-500",
            isMining ? "border-scremy/20" : "border-muted/20"
          )} />
          
          {/* Center coin */}
          <div className={cn(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300",
            isMining ? "bg-scremy/10" : "bg-muted/10",
            wasSuccessful ? "scale-125" : "scale-100"
          )}>
            <span className={cn(
              "font-bold text-2xl transition-all duration-300",
              isMining ? "text-scremy animate-pulse-soft" : "text-muted-foreground",
              wasSuccessful ? "text-scremy scale-110" : ""
            )}>
              SCR
            </span>
          </div>
        </div>
        
        {/* Floating bits */}
        {isMining && (
          <>
            <div className="absolute top-1/3 left-1/4 w-3 h-3 rounded-full bg-scremy/30 animate-float" style={{ animationDelay: "0s" }} />
            <div className="absolute top-2/3 left-1/3 w-2 h-2 rounded-full bg-scremy/20 animate-float" style={{ animationDelay: "0.5s" }} />
            <div className="absolute top-1/2 left-3/4 w-4 h-4 rounded-full bg-scremy/40 animate-float" style={{ animationDelay: "1s" }} />
            <div className="absolute top-1/4 left-2/3 w-2 h-2 rounded-full bg-scremy/20 animate-float" style={{ animationDelay: "1.5s" }} />
          </>
        )}
      </div>
      
      {/* Dynamic particles on success */}
      {particles}
      
      {/* Hash visualization */}
      {isMining && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 max-w-full overflow-hidden">
          <div className="text-xs text-scremy/50 font-mono animate-pulse-soft overflow-hidden text-ellipsis whitespace-nowrap">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="opacity-70" style={{ animationDelay: `${i * 0.1}s` }}>
                {Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MiningAnimation;
