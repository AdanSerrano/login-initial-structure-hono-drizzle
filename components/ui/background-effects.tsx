'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface SpotlightProps {
  className?: string;
  fill?: string;
}

export function Spotlight({ className, fill = 'white' }: SpotlightProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!divRef.current) return;

    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setOpacity(1);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setOpacity(0);
  }, []);

  useEffect(() => {
    const div = divRef.current;
    if (!div) return;

    div.addEventListener('mousemove', handleMouseMove);
    div.addEventListener('mouseenter', handleMouseEnter);
    div.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      div.removeEventListener('mousemove', handleMouseMove);
      div.removeEventListener('mouseenter', handleMouseEnter);
      div.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseEnter, handleMouseLeave]);

  return (
    <div
      ref={divRef}
      className={cn('absolute inset-0 overflow-hidden', className)}
    >
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${fill}15, transparent 40%)`,
        }}
      />
    </div>
  );
}

interface GridBackgroundProps {
  className?: string;
  gridColor?: string;
}

export function GridBackground({ className, gridColor = 'rgba(0,0,0,0.03)' }: GridBackgroundProps) {
  return (
    <div
      className={cn('absolute inset-0 overflow-hidden', className)}
      style={{
        backgroundImage: `
          linear-gradient(${gridColor} 1px, transparent 1px),
          linear-gradient(90deg, ${gridColor} 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }}
    />
  );
}

interface DotPatternProps {
  className?: string;
  dotColor?: string;
  dotSize?: number;
  gap?: number;
}

export function DotPattern({
  className,
  dotColor = 'rgba(0,0,0,0.1)',
  dotSize = 1,
  gap = 20,
}: DotPatternProps) {
  return (
    <div
      className={cn('absolute inset-0 overflow-hidden', className)}
      style={{
        backgroundImage: `radial-gradient(${dotColor} ${dotSize}px, transparent ${dotSize}px)`,
        backgroundSize: `${gap}px ${gap}px`,
      }}
    />
  );
}

interface GradientBlobProps {
  className?: string;
  colors?: string[];
  animate?: boolean;
}

export function GradientBlob({
  className,
  colors = ['#8b5cf6', '#a855f7', '#d946ef'],
  animate = true,
}: GradientBlobProps) {
  return (
    <div className={cn('absolute blur-3xl opacity-30', className)}>
      <div
        className={cn(
          'aspect-square w-full rounded-full',
          animate && 'animate-blob'
        )}
        style={{
          background: `linear-gradient(135deg, ${colors.join(', ')})`,
        }}
      />
    </div>
  );
}

interface FloatingParticlesProps {
  className?: string;
  count?: number;
  color?: string;
}

export function FloatingParticles({
  className,
  count = 50,
  color = 'rgba(139, 92, 246, 0.5)',
}: FloatingParticlesProps) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full animate-float-particle"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: color,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

interface BeamProps {
  className?: string;
}

export function Beam({ className }: BeamProps) {
  return (
    <div className={cn('absolute inset-0 overflow-hidden', className)}>
      <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-violet-500/50 to-transparent animate-beam" />
      <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-purple-500/50 to-transparent animate-beam [animation-delay:1s]" />
      <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-fuchsia-500/50 to-transparent animate-beam [animation-delay:2s]" />
    </div>
  );
}

interface GlowingOrbProps {
  className?: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const orbSizes = {
  sm: 'w-32 h-32',
  md: 'w-64 h-64',
  lg: 'w-96 h-96',
  xl: 'w-[500px] h-[500px]',
};

export function GlowingOrb({ className, color = '#8b5cf6', size = 'lg' }: GlowingOrbProps) {
  return (
    <div
      className={cn(
        'absolute rounded-full blur-3xl opacity-20 animate-pulse-slow',
        orbSizes[size],
        className
      )}
      style={{
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      }}
    />
  );
}

interface MovingBorderProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  borderRadius?: string;
  duration?: number;
}

export function MovingBorder({
  children,
  className,
  containerClassName,
  borderRadius = '1rem',
  duration = 3000,
}: MovingBorderProps) {
  return (
    <div
      className={cn('relative p-[2px] overflow-hidden', containerClassName)}
      style={{ borderRadius }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(90deg, transparent, #8b5cf6, #a855f7, #d946ef, transparent)`,
          backgroundSize: '200% 100%',
          animation: `movingBorder ${duration}ms linear infinite`,
          borderRadius,
        }}
      />
      <div
        className={cn('relative bg-background', className)}
        style={{ borderRadius: `calc(${borderRadius} - 2px)` }}
      >
        {children}
      </div>
    </div>
  );
}

interface ShimmerButtonProps {
  children: React.ReactNode;
  className?: string;
  shimmerColor?: string;
  background?: string;
}

export function ShimmerButton({
  children,
  className,
  shimmerColor = 'rgba(255,255,255,0.1)',
  background = 'linear-gradient(135deg, #8b5cf6, #a855f7)',
}: ShimmerButtonProps) {
  return (
    <button
      className={cn(
        'relative overflow-hidden px-6 py-3 rounded-lg font-medium text-white',
        'transform transition-transform hover:scale-105 active:scale-95',
        className
      )}
      style={{ background }}
    >
      <span className="relative z-10">{children}</span>
      <div
        className="absolute inset-0 -translate-x-full animate-shimmer-slide"
        style={{
          background: `linear-gradient(90deg, transparent, ${shimmerColor}, transparent)`,
        }}
      />
    </button>
  );
}
