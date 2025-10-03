import { useCallback, useMemo, useRef, useEffect, useState } from 'react';
import { debounce, throttle, memoize } from '../utils/performance';

// Hook for debounced values
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Hook for throttled values
export function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef<number>(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return throttledValue;
}

// Hook for memoized expensive calculations
export function useMemoizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T {
  return useCallback(memoize(callback), deps);
}

// Hook for performance monitoring
export function usePerformanceMonitor(label: string) {
  const startTime = useRef<number>(0);

  const start = useCallback(() => {
    startTime.current = performance.now();
  }, []);

  const end = useCallback(() => {
    const duration = performance.now() - startTime.current;
    console.log(`${label}: ${duration.toFixed(2)}ms`);
    return duration;
  }, [label]);

  return { start, end };
}

// Hook for intersection observer (lazy loading)
export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef<Element | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      options
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [options, hasIntersected]);

  return { ref, isIntersecting, hasIntersected };
}

// Hook for virtual scrolling
export function useVirtualScroll<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 5
) {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );
    const offsetY = startIndex * itemHeight;

    return { startIndex, endIndex, offsetY };
  }, [scrollTop, itemHeight, containerHeight, overscan, items.length]);

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.startIndex, visibleRange.endIndex + 1);
  }, [items, visibleRange.startIndex, visibleRange.endIndex]);

  const totalHeight = items.length * itemHeight;

  const handleScroll = useCallback(
    throttle((event: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(event.currentTarget.scrollTop);
    }, 16), // ~60fps
    []
  );

  return {
    visibleItems,
    totalHeight,
    offsetY: visibleRange.offsetY,
    handleScroll,
    startIndex: visibleRange.startIndex,
  };
}

// Hook for lazy loading components
export function useLazyComponent<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
) {
  const [Component, setComponent] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadComponent = useCallback(async () => {
    if (Component || loading) return;

    setLoading(true);
    setError(null);

    try {
      const module = await importFn();
      setComponent(() => module.default);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [Component, loading, importFn]);

  return {
    Component,
    loading,
    error,
    loadComponent,
    FallbackComponent: fallback,
  };
}

// Hook for memory management
export function useMemoryCleanup() {
  const cleanupFunctions = useRef<Set<() => void>>(new Set());

  const registerCleanup = useCallback((cleanupFn: () => void) => {
    cleanupFunctions.current.add(cleanupFn);
  }, []);

  const unregisterCleanup = useCallback((cleanupFn: () => void) => {
    cleanupFunctions.current.delete(cleanupFn);
  }, []);

  useEffect(() => {
    return () => {
      cleanupFunctions.current.forEach(cleanup => {
        try {
          cleanup();
        } catch (error) {
          console.error('Cleanup function failed:', error);
        }
      });
      cleanupFunctions.current.clear();
    };
  }, []);

  return { registerCleanup, unregisterCleanup };
}

// Hook for caching with TTL
export function useCache<T>(key: string, ttl: number = 5 * 60 * 1000) {
  const cache = useRef<Map<string, { data: T; timestamp: number }>>(new Map());

  const get = useCallback((cacheKey: string): T | null => {
    const item = cache.current.get(cacheKey);
    if (!item) return null;

    if (Date.now() - item.timestamp > ttl) {
      cache.current.delete(cacheKey);
      return null;
    }

    return item.data;
  }, [ttl]);

  const set = useCallback((cacheKey: string, data: T): void => {
    cache.current.set(cacheKey, {
      data,
      timestamp: Date.now(),
    });
  }, []);

  const clear = useCallback(() => {
    cache.current.clear();
  }, []);

  return { get, set, clear };
}

// Hook for performance metrics
export function usePerformanceMetrics() {
  const [metrics, setMetrics] = useState<Record<string, number>>({});

  const measure = useCallback((label: string, fn: () => void) => {
    const start = performance.now();
    fn();
    const duration = performance.now() - start;
    
    setMetrics(prev => ({
      ...prev,
      [label]: duration,
    }));
    
    return duration;
  }, []);

  const measureAsync = useCallback(async (label: string, fn: () => Promise<void>) => {
    const start = performance.now();
    await fn();
    const duration = performance.now() - start;
    
    setMetrics(prev => ({
      ...prev,
      [label]: duration,
    }));
    
    return duration;
  }, []);

  return { metrics, measure, measureAsync };
}

// Hook for bundle size monitoring
export function useBundleSize() {
  const [bundleSize, setBundleSize] = useState<number>(0);

  useEffect(() => {
    if (import.meta.env.DEV) {
      // In development, we can't easily measure bundle size
      // This would typically be done at build time
      console.log('Bundle size monitoring available in production builds');
    }
  }, []);

  return bundleSize;
}

// Hook for Web Vitals
export function useWebVitals() {
  const [vitals, setVitals] = useState<{
    lcp?: number;
    fid?: number;
    cls?: number;
  }>({});

  useEffect(() => {
    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      setVitals(prev => ({ ...prev, lcp: lastEntry.startTime }));
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        const fid = (entry as any).processingStart - entry.startTime;
        setVitals(prev => ({ ...prev, fid }));
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
          setVitals(prev => ({ ...prev, cls: clsValue }));
        }
      });
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });

    return () => {
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
    };
  }, []);

  return vitals;
}
