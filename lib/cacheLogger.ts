/**
 * Cache Performance Logger
 * Tracks and logs cache hit/miss rates and performance metrics
 */

interface CacheMetrics {
  hits: number;
  misses: number;
  totalRequests: number;
  avgHitTime: number;
  avgMissTime: number;
  lastReset: number;
}

class CacheLogger {
  private metrics: CacheMetrics;
  private hitTimes: number[] = [];
  private missTimes: number[] = [];
  private enabled: boolean;

  constructor() {
    this.metrics = {
      hits: 0,
      misses: 0,
      totalRequests: 0,
      avgHitTime: 0,
      avgMissTime: 0,
      lastReset: Date.now(),
    };
    this.enabled =
      typeof window !== "undefined" && process.env.NODE_ENV === "development";
  }

  logHit(url: string, duration: number): void {
    if (!this.enabled) return;

    this.metrics.hits++;
    this.metrics.totalRequests++;
    this.hitTimes.push(duration);
    this.metrics.avgHitTime = this.calculateAverage(this.hitTimes);

    console.log(
      `%c[Cache HIT] %c${url} %c(${duration.toFixed(2)}ms)`,
      "color: #10b981; font-weight: bold",
      "color: #6b7280",
      "color: #059669"
    );

    this.logStats();
  }

  logMiss(url: string, duration: number): void {
    if (!this.enabled) return;

    this.metrics.misses++;
    this.metrics.totalRequests++;
    this.missTimes.push(duration);
    this.metrics.avgMissTime = this.calculateAverage(this.missTimes);

    console.log(
      `%c[Cache MISS] %c${url} %c(${duration.toFixed(2)}ms)`,
      "color: #f59e0b; font-weight: bold",
      "color: #6b7280",
      "color: #d97706"
    );

    this.logStats();
  }

  private calculateAverage(times: number[]): number {
    if (times.length === 0) return 0;
    const sum = times.reduce((a, b) => a + b, 0);
    return sum / times.length;
  }

  private logStats(): void {
    if (!this.enabled) return;

    const hitRate =
      this.metrics.totalRequests > 0
        ? ((this.metrics.hits / this.metrics.totalRequests) * 100).toFixed(1)
        : "0.0";

    const timeSinceReset = (
      (Date.now() - this.metrics.lastReset) /
      1000
    ).toFixed(0);

    console.log(
      `%c[Cache Stats] Hit Rate: ${hitRate}% | Hits: ${
        this.metrics.hits
      } | Misses: ${
        this.metrics.misses
      } | Avg Hit: ${this.metrics.avgHitTime.toFixed(
        2
      )}ms | Avg Miss: ${this.metrics.avgMissTime.toFixed(
        2
      )}ms | Session: ${timeSinceReset}s`,
      "color: #3b82f6; font-size: 10px"
    );
  }

  getMetrics(): CacheMetrics {
    return { ...this.metrics };
  }

  getHitRate(): number {
    if (this.metrics.totalRequests === 0) return 0;
    return (this.metrics.hits / this.metrics.totalRequests) * 100;
  }

  reset(): void {
    this.metrics = {
      hits: 0,
      misses: 0,
      totalRequests: 0,
      avgHitTime: 0,
      avgMissTime: 0,
      lastReset: Date.now(),
    };
    this.hitTimes = [];
    this.missTimes = [];

    if (this.enabled) {
      console.log(
        "%c[Cache Logger] Metrics reset",
        "color: #8b5cf6; font-weight: bold"
      );
    }
  }

  printReport(): void {
    if (!this.enabled) return;

    const hitRate = this.getHitRate().toFixed(1);
    const timeSinceReset = (
      (Date.now() - this.metrics.lastReset) /
      1000
    ).toFixed(0);

    console.group(
      "%c📊 Cache Performance Report",
      "color: #8b5cf6; font-weight: bold; font-size: 14px"
    );
    console.log(
      `%cSession Duration: %c${timeSinceReset}s`,
      "color: #6b7280",
      "color: #000; font-weight: bold"
    );
    console.log(
      `%cTotal Requests: %c${this.metrics.totalRequests}`,
      "color: #6b7280",
      "color: #000; font-weight: bold"
    );
    console.log(
      `%cCache Hits: %c${this.metrics.hits}`,
      "color: #6b7280",
      "color: #10b981; font-weight: bold"
    );
    console.log(
      `%cCache Misses: %c${this.metrics.misses}`,
      "color: #6b7280",
      "color: #f59e0b; font-weight: bold"
    );
    console.log(
      `%cHit Rate: %c${hitRate}%`,
      "color: #6b7280",
      "color: #3b82f6; font-weight: bold"
    );
    console.log(
      `%cAvg Hit Time: %c${this.metrics.avgHitTime.toFixed(2)}ms`,
      "color: #6b7280",
      "color: #10b981; font-weight: bold"
    );
    console.log(
      `%cAvg Miss Time: %c${this.metrics.avgMissTime.toFixed(2)}ms`,
      "color: #6b7280",
      "color: #f59e0b; font-weight: bold"
    );

    if (this.metrics.avgMissTime > 0) {
      const speedup = (
        this.metrics.avgMissTime / this.metrics.avgHitTime
      ).toFixed(1);
      console.log(
        `%cSpeedup Factor: %c${speedup}x faster`,
        "color: #6b7280",
        "color: #059669; font-weight: bold"
      );
    }

    console.groupEnd();
  }

  enable(): void {
    this.enabled = true;
    console.log(
      "%c[Cache Logger] Enabled",
      "color: #10b981; font-weight: bold"
    );
  }

  disable(): void {
    this.enabled = false;
  }
}

// Export singleton instance
export const cacheLogger = new CacheLogger();

// Global access for debugging
if (typeof window !== "undefined") {
  (window as any).cacheLogger = cacheLogger;
}
