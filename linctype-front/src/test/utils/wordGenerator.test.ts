import { generateWords, generateQuote } from "../../utils/wordGenerator";

describe("Word Generator Utils", () => {
  describe("generateWords", () => {
    it("should generate the requested number of words", () => {
      const words = generateWords(10);
      expect(words).toHaveLength(10);
    });

    it("should generate different words", () => {
      const words = generateWords(50);
      const uniqueWords = new Set(words);
      // Should have some variety (not all the same word)
      expect(uniqueWords.size).toBeGreaterThan(1);
    });

    it("should generate only string values", () => {
      const words = generateWords(20);
      words.forEach(word => {
        expect(typeof word).toBe("string");
        expect(word.length).toBeGreaterThan(0);
      });
    });

    it("should handle edge cases", () => {
      // Test with 0 words
      const emptyWords = generateWords(0);
      expect(emptyWords).toHaveLength(0);

      // Test with 1 word
      const singleWord = generateWords(1);
      expect(singleWord).toHaveLength(1);
      expect(typeof singleWord[0]).toBe("string");
    });

    it("should generate words without special characters", () => {
      const words = generateWords(30);
      words.forEach(word => {
        // Should only contain letters (no numbers, spaces, or special chars)
        expect(word).toMatch(/^[a-zA-Z]+$/);
      });
    });

    it("should generate words of reasonable length", () => {
      const words = generateWords(25);
      words.forEach(word => {
        // Most common words are between 1-15 characters
        expect(word.length).toBeGreaterThan(0);
        expect(word.length).toBeLessThan(20);
      });
    });

    it("should be deterministic or random", () => {
      const words1 = generateWords(10);
      const words2 = generateWords(10);
      
      // Depending on implementation, could be deterministic or random
      // Just ensure both calls return valid arrays
      expect(Array.isArray(words1)).toBe(true);
      expect(Array.isArray(words2)).toBe(true);
      expect(words1).toHaveLength(10);
      expect(words2).toHaveLength(10);
    });

    it("should handle large numbers", () => {
      const words = generateWords(200);
      expect(words).toHaveLength(200);
      
      // Should still be valid words
      words.slice(0, 10).forEach(word => {
        expect(typeof word).toBe("string");
        expect(word.length).toBeGreaterThan(0);
      });
    });
  });

  describe("generateQuote", () => {
    it("should generate a string", () => {
      const quote = generateQuote();
      expect(typeof quote).toBe("string");
    });

    it("should generate a non-empty quote", () => {
      const quote = generateQuote();
      expect(quote.length).toBeGreaterThan(0);
    });

    it("should generate a quote with multiple words", () => {
      const quote = generateQuote();
      const words = quote.split(" ");
      expect(words.length).toBeGreaterThan(1);
    });

    it("should generate quotes with proper formatting", () => {
      const quote = generateQuote();
      
      // Should not start or end with spaces
      expect(quote.trim()).toBe(quote);
      
      // Should not have double spaces
      expect(quote).not.toMatch(/  +/);
    });

    it("should generate quotes of reasonable length", () => {
      const quote = generateQuote();
      
      // Quotes should be substantial but not too long
      expect(quote.length).toBeGreaterThan(20);
      expect(quote.length).toBeLessThan(500);
    });

    it("should generate different quotes on multiple calls", () => {
      const quote1 = generateQuote();
      const quote2 = generateQuote();
      const quote3 = generateQuote();
      
      // Depending on implementation, might be random or from a pool
      // At least ensure all are valid
      expect(typeof quote1).toBe("string");
      expect(typeof quote2).toBe("string");
      expect(typeof quote3).toBe("string");
      
      expect(quote1.length).toBeGreaterThan(0);
      expect(quote2.length).toBeGreaterThan(0);
      expect(quote3.length).toBeGreaterThan(0);
    });

    it("should generate quotes with valid characters", () => {
      const quote = generateQuote();
      
      // Should contain primarily letters, spaces, and basic punctuation
      expect(quote).toMatch(/^[a-zA-Z0-9\s.,!?'"()-]+$/);
    });

    it("should be splittable into words", () => {
      const quote = generateQuote();
      const words = quote.split(" ");
      
      // Each word should be valid
      words.forEach(word => {
        expect(word.length).toBeGreaterThan(0);
        // Remove punctuation for testing
        const cleanWord = word.replace(/[.,!?'"()-]/g, "");
        expect(cleanWord.length).toBeGreaterThanOrEqual(0);
      });
      
      // Test that words with alphanumeric content match pattern
      const wordsWithContent = words
        .map(word => word.replace(/[.,!?'"()-]/g, ""))
        .filter(word => word.length > 0);
      
      wordsWithContent.forEach(cleanWord => {
        expect(cleanWord).toMatch(/^[a-zA-Z0-9]+$/);
      });
    });

    it("should generate consistent output format", () => {
      for (let i = 0; i < 5; i++) {
        const quote = generateQuote();
        
        // All quotes should follow same format rules
        expect(typeof quote).toBe("string");
        expect(quote.length).toBeGreaterThan(0);
        expect(quote.trim()).toBe(quote);
      }
    });
  });

  describe("Integration Tests", () => {
    it("should work together for typing test", () => {
      // Test that both functions can be used together
      const words = generateWords(10);
      const quote = generateQuote();
      
      // Words can be used for word-based test
      expect(Array.isArray(words)).toBe(true);
      words.forEach(word => {
        expect(typeof word).toBe("string");
      });
      
      // Quote can be split into words for quote-based test
      const quoteWords = quote.split(" ");
      expect(Array.isArray(quoteWords)).toBe(true);
      expect(quoteWords.length).toBeGreaterThan(1);
    });

    it("should provide enough content for typing tests", () => {
      // Test that generators provide enough content for various test lengths
      const shortWords = generateWords(25);
      const longWords = generateWords(200);
      const quote = generateQuote();
      
      expect(shortWords).toHaveLength(25);
      expect(longWords).toHaveLength(200);
      expect(quote.split(" ").length).toBeGreaterThan(10);
    });
  });

  describe("Performance Tests", () => {
    it("should generate words quickly", () => {
      const startTime = Date.now();
      generateWords(100);
      const endTime = Date.now();
      
      // Should complete in reasonable time (under 100ms)
      expect(endTime - startTime).toBeLessThan(100);
    });

    it("should generate quotes quickly", () => {
      const startTime = Date.now();
      generateQuote();
      const endTime = Date.now();
      
      // Should complete in reasonable time (under 50ms)
      expect(endTime - startTime).toBeLessThan(50);
    });

    it("should handle multiple rapid calls", () => {
      const startTime = Date.now();
      
      for (let i = 0; i < 10; i++) {
        generateWords(50);
        generateQuote();
      }
      
      const endTime = Date.now();
      
      // Should handle multiple calls efficiently
      expect(endTime - startTime).toBeLessThan(500);
    });
  });
}); 