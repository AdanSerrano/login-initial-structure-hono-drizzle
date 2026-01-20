'use client';

import { ReactNode, CSSProperties } from 'react';
import { useInView } from '@/hooks/use-in-view';
import { cn } from '@/lib/utils';

type AnimationVariant =
  | 'fade-up'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'zoom-in'
  | 'zoom-out'
  | 'flip-up'
  | 'flip-down'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'rotate-in'
  | 'blur-in';

interface ScrollAnimationProps {
  children: ReactNode;
  variant?: AnimationVariant;
  delay?: number;
  duration?: number;
  className?: string;
  threshold?: number;
  once?: boolean;
}

const animations: Record<AnimationVariant, { initial: CSSProperties; animate: CSSProperties }> = {
  'fade-up': {
    initial: { opacity: 0, transform: 'translateY(40px)' },
    animate: { opacity: 1, transform: 'translateY(0)' },
  },
  'fade-down': {
    initial: { opacity: 0, transform: 'translateY(-40px)' },
    animate: { opacity: 1, transform: 'translateY(0)' },
  },
  'fade-left': {
    initial: { opacity: 0, transform: 'translateX(-40px)' },
    animate: { opacity: 1, transform: 'translateX(0)' },
  },
  'fade-right': {
    initial: { opacity: 0, transform: 'translateX(40px)' },
    animate: { opacity: 1, transform: 'translateX(0)' },
  },
  'zoom-in': {
    initial: { opacity: 0, transform: 'scale(0.8)' },
    animate: { opacity: 1, transform: 'scale(1)' },
  },
  'zoom-out': {
    initial: { opacity: 0, transform: 'scale(1.2)' },
    animate: { opacity: 1, transform: 'scale(1)' },
  },
  'flip-up': {
    initial: { opacity: 0, transform: 'perspective(600px) rotateX(20deg)' },
    animate: { opacity: 1, transform: 'perspective(600px) rotateX(0)' },
  },
  'flip-down': {
    initial: { opacity: 0, transform: 'perspective(600px) rotateX(-20deg)' },
    animate: { opacity: 1, transform: 'perspective(600px) rotateX(0)' },
  },
  'slide-up': {
    initial: { transform: 'translateY(100%)' },
    animate: { transform: 'translateY(0)' },
  },
  'slide-down': {
    initial: { transform: 'translateY(-100%)' },
    animate: { transform: 'translateY(0)' },
  },
  'slide-left': {
    initial: { transform: 'translateX(-100%)' },
    animate: { transform: 'translateX(0)' },
  },
  'slide-right': {
    initial: { transform: 'translateX(100%)' },
    animate: { transform: 'translateX(0)' },
  },
  'rotate-in': {
    initial: { opacity: 0, transform: 'rotate(-10deg) scale(0.9)' },
    animate: { opacity: 1, transform: 'rotate(0) scale(1)' },
  },
  'blur-in': {
    initial: { opacity: 0, filter: 'blur(10px)' },
    animate: { opacity: 1, filter: 'blur(0)' },
  },
};

export function ScrollAnimation({
  children,
  variant = 'fade-up',
  delay = 0,
  duration = 0.6,
  className,
  threshold = 0.1,
  once = true,
}: ScrollAnimationProps) {
  const { ref, hasBeenInView } = useInView<HTMLDivElement>({
    threshold,
    triggerOnce: once,
  });

  const animation = animations[variant];
  const isVisible = hasBeenInView;

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{
        ...animation.initial,
        ...(isVisible ? animation.animate : {}),
        transition: `all ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
        willChange: 'transform, opacity, filter',
      }}
    >
      {children}
    </div>
  );
}

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  threshold?: number;
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.1,
  threshold = 0.1,
}: StaggerContainerProps) {
  const { ref, hasBeenInView } = useInView<HTMLDivElement>({
    threshold,
    triggerOnce: true,
  });

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{
        ['--stagger-delay' as string]: `${staggerDelay}s`,
      }}
      data-visible={hasBeenInView}
    >
      {children}
    </div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  index: number;
  className?: string;
  variant?: AnimationVariant;
  duration?: number;
}

export function StaggerItem({
  children,
  index,
  className,
  variant = 'fade-up',
  duration = 0.5,
}: StaggerItemProps) {
  const animation = animations[variant];

  return (
    <div
      className={cn(
        'stagger-item',
        className
      )}
      style={{
        ...animation.initial,
        transition: `all ${duration}s cubic-bezier(0.16, 1, 0.3, 1)`,
        transitionDelay: `calc(var(--stagger-delay, 0.1s) * ${index})`,
      }}
      data-index={index}
    >
      {children}
    </div>
  );
}

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
}

export function TextReveal({ text, className, delay = 0 }: TextRevealProps) {
  const { ref, hasBeenInView } = useInView<HTMLSpanElement>({
    threshold: 0.5,
    triggerOnce: true,
  });

  const words = text.split(' ');

  return (
    <span ref={ref} className={cn('inline-block', className)}>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden mr-[0.25em]"
        >
          <span
            className="inline-block"
            style={{
              transform: hasBeenInView ? 'translateY(0)' : 'translateY(100%)',
              opacity: hasBeenInView ? 1 : 0,
              transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1)`,
              transitionDelay: `${delay + i * 0.05}s`,
            }}
          >
            {word}
          </span>
        </span>
      ))}
    </span>
  );
}

interface CountUpProps {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

export function CountUp({ end, suffix = '', prefix = '', duration = 2, className }: CountUpProps) {
  const { ref, hasBeenInView } = useInView<HTMLSpanElement>({
    threshold: 0.5,
    triggerOnce: true,
  });

  return (
    <span
      ref={ref}
      className={cn('tabular-nums', className)}
      style={{
        ['--count-end' as string]: end,
        ['--count-duration' as string]: `${duration}s`,
      }}
    >
      {prefix}
      <span
        className="inline-block"
        style={{
          counterReset: hasBeenInView ? `count ${end}` : 'count 0',
          animation: hasBeenInView ? `countUp ${duration}s ease-out forwards` : 'none',
        }}
      >
        {hasBeenInView ? end : 0}
      </span>
      {suffix}
    </span>
  );
}

interface ParallaxProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

export function Parallax({ children, speed = 0.5, className }: ParallaxProps) {
  const { ref, isInView } = useInView<HTMLDivElement>({
    threshold: 0,
    rootMargin: '100px',
    triggerOnce: false,
  });

  return (
    <div
      ref={ref}
      className={cn('will-change-transform', className)}
      style={{
        transform: isInView ? `translateY(calc(var(--scroll-y, 0) * ${speed}px))` : 'none',
      }}
    >
      {children}
    </div>
  );
}
