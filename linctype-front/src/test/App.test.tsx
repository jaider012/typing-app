import "@testing-library/jest-dom";
import calculateScore from "../calculateScore";

describe("Typing Test Score Calculation Tests", () => {
  describe("calculateScore Function Tests", () => {
    it("should calculate score using the real formula: words * (wpm / 60) * accuracy * firstStrikeAccuracy * 10", () => {
      // This is the actual formula used in calculateScore.ts
      const words = 20;
      const wpm = 60;
      const accuracy = 95;
      const firstStrikeAccuracy = 90;
      
      const score = calculateScore(words, wpm, accuracy, firstStrikeAccuracy);
      
      // Expected: 20 * (60/60) * 95 * 90 * 10 = 20 * 1 * 95 * 90 * 10 = 171,000
      const expected = 20 * (60/60) * 95 * 90 * 10;
      expect(score).toBe(expected);
    });

    it("should calculate score with perfect metrics", () => {
      const score = calculateScore(50, 60, 100, 100);
      // Expected: 50 * (60/60) * 100 * 100 * 10 = 50 * 1 * 100 * 100 * 10 = 5,000,000
      const expected = 50 * (60/60) * 100 * 100 * 10;
      expect(score).toBe(expected);
    });

    it("should calculate score with lower accuracy", () => {
      const score = calculateScore(25, 40, 80, 75);
      // Expected: 25 * (40/60) * 80 * 75 * 10 = 25 * 0.667 * 80 * 75 * 10
      const expected = 25 * (40/60) * 80 * 75 * 10;
      expect(score).toBeCloseTo(expected, 1);
    });

    it("should return 0 when words is 0", () => {
      const score = calculateScore(0, 60, 100, 100);
      expect(score).toBe(0);
    });

    it("should return 0 when accuracy is 0", () => {
      const score = calculateScore(20, 50, 0, 90);
      expect(score).toBe(0);
    });

    it("should return 0 when first strike accuracy is 0", () => {
      const score = calculateScore(20, 50, 95, 0);
      expect(score).toBe(0);
    });
  });

  describe("Real World Typing Test Scenarios", () => {
    it("should calculate score for beginner typist", () => {
      const score = calculateScore(15, 25, 85, 80);
      // Expected: 15 * (25/60) * 85 * 80 * 10
      const expected = 15 * (25/60) * 85 * 80 * 10;
      expect(score).toBeCloseTo(expected, 1);
    });

    it("should calculate score for intermediate typist", () => {
      const score = calculateScore(30, 55, 92, 88);
      // Expected: 30 * (55/60) * 92 * 88 * 10
      const expected = 30 * (55/60) * 92 * 88 * 10;
      expect(score).toBeCloseTo(expected, 1);
    });

    it("should calculate score for advanced typist", () => {
      const score = calculateScore(45, 85, 97, 95);
      // Expected: 45 * (85/60) * 97 * 95 * 10
      const expected = 45 * (85/60) * 97 * 95 * 10;
      expect(score).toBeCloseTo(expected, 1);
    });

    it("should show progression with better performance", () => {
      const beginnerScore = calculateScore(10, 30, 80, 75);
      const intermediateScore = calculateScore(25, 55, 90, 85);
      const advancedScore = calculateScore(40, 80, 95, 92);
      
      expect(intermediateScore).toBeGreaterThan(beginnerScore);
      expect(advancedScore).toBeGreaterThan(intermediateScore);
    });
  });

  describe("Edge Cases", () => {
    it("should handle very high WPM", () => {
      const score = calculateScore(60, 150, 95, 90);
      const expected = 60 * (150/60) * 95 * 90 * 10;
      expect(score).toBe(expected);
    });

    it("should handle very low accuracy", () => {
      const score = calculateScore(10, 60, 20, 15);
      const expected = 10 * (60/60) * 20 * 15 * 10;
      expect(score).toBe(expected);
    });

    it("should return consistent results for same inputs", () => {
      const score1 = calculateScore(20, 45, 88, 85);
      const score2 = calculateScore(20, 45, 88, 85);
      expect(score1).toBe(score2);
    });
  });
});

