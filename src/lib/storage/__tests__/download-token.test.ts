import { describe, expect, it } from "vitest";
import {
  canDownload,
  computeRemaining,
  isTokenExpired,
  DOWNLOAD_TOKEN_TTL_HOURS,
  MAX_DOWNLOADS,
} from "@/lib/storage/download-token";
import { generateToken } from "@/lib/utils";

describe("download token logic", () => {
  const now = new Date("2026-01-01T00:00:00Z");
  const pastExpiry = new Date("2025-12-31T00:00:00Z");
  const futureExpiry = new Date("2026-01-04T00:00:00Z");

  it("exposes a 72h lifetime and 5 max downloads by default", () => {
    expect(DOWNLOAD_TOKEN_TTL_HOURS).toBe(72);
    expect(MAX_DOWNLOADS).toBe(5);
  });

  it("detects expired tokens", () => {
    expect(isTokenExpired(pastExpiry, now)).toBe(true);
    expect(isTokenExpired(futureExpiry, now)).toBe(false);
  });

  it("computes remaining downloads without going negative", () => {
    expect(computeRemaining(5, 0)).toBe(5);
    expect(computeRemaining(5, 5)).toBe(0);
    expect(computeRemaining(5, 8)).toBe(0);
  });

  it("allows downloads only while active and within limit", () => {
    expect(canDownload(0, 5, futureExpiry, now)).toBe(true);
    expect(canDownload(4, 5, futureExpiry, now)).toBe(true);
    expect(canDownload(5, 5, futureExpiry, now)).toBe(false); // exhausted
    expect(canDownload(0, 5, pastExpiry, now)).toBe(false); // expired
  });

  it("generates cryptographically random hex tokens of the requested size", () => {
    const token = generateToken(32);
    expect(token).toHaveLength(64);
    expect(/^[0-9a-f]{64}$/.test(token)).toBe(true);
    expect(generateToken(32)).not.toBe(token);
  });
});