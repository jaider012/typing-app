import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import App from "../App";
import calculateScore from "../calculateScore";

describe("App tests", () => {
  describe("Render components", () => {
    /**
     * TODO: Fix the following test by using the correct text to find the heading (h1)
     */
    it("App should render and contains the heading", () => {
      render(<App />);

      const headingText = "Change me!";
      const heading = screen.queryByText(headingText);
      expect(heading).toBeInTheDocument();
    });

    /**
     * TODO: Implement the following test by using the correct functions
     * to find h3 tag and assert the test
     */
    it("App should render and contains the sub heading", () => {
      expect(false).toBeTruthy(); // This should be removed when test is implemented
    });
  });

  describe("Testing function", () => {
    /**
     * TODO: Fix the following test by finding the expected score to assert the test
     */
    it("Test calculateScore", () => {
      const score = calculateScore(3, 15, 100, 90);
      const expectedScore = 0;

      expect(score).toBe(expectedScore);
    });
  });
});
