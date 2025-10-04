import React, { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useInView } from 'react-intersection-observer';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({ 
  children, 
  className = '', 
  delay = 0 
}) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const animation = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0px)' : 'translateY(50px)',
    delay: delay,
    config: { tension: 100, friction: 14 },
  });

  return (
    <animated.div ref={ref} style={animation} className={className}>
      {children}
    </animated.div>
  );
};

interface CountUpProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}

export const CountUp: React.FC<CountUpProps> = ({ 
  end, 
  duration = 2000, 
  prefix = '', 
  suffix = '' 
}) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const { number } = useSpring({
    from: { number: 0 },
    number: inView ? end : 0,
    delay: 200,
    config: { duration },
  });

  return (
    <animated.span ref={ref}>
      {number.to(n => `${prefix}${Math.floor(n).toLocaleString()}${suffix}`)}
    </animated.span>
  );
};

interface FloatingCardProps {
  children: React.ReactNode;
  className?: string;
  hoverScale?: number;
}

export const FloatingCard: React.FC<FloatingCardProps> = ({ 
  children, 
  className = '', 
  hoverScale = 1.05 
}) => {
  const [hovered, setHovered] = useState(false);
  
  const cardAnimation = useSpring({
    transform: hovered ? `scale(${hoverScale})` : 'scale(1)',
    boxShadow: hovered 
      ? '0 20px 40px rgba(0,0,0,0.15)' 
      : '0 10px 20px rgba(0,0,0,0.1)',
    config: { tension: 300, friction: 10 },
  });

  return (
    <animated.div
      style={cardAnimation}
      className={`cursor-pointer transition-all duration-200 ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </animated.div>
  );
};

interface ParallaxHeroProps {
  children: React.ReactNode;
}

export const ParallaxHero: React.FC<ParallaxHeroProps> = ({ children }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const parallaxStyle = useSpring({
    transform: `translateY(${scrollY * 0.5}px)`,
    config: { tension: 100, friction: 14 },
  });

  return (
    <animated.div style={parallaxStyle} className="relative">
      {children}
    </animated.div>
  );
};