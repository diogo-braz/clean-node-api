/** @type {import('jest').Config} */
const config = {
  collectCoverageFrom: [
    "<rootDir>/src/**/*.ts",
    "!<rootDir>/src/main/**"
  ],
  coverageDirectory: "coverage",
  coverageProvider: "babel",
  roots: ["<rootDir>/src"],
  preset: "@shelf/jest-mongodb",
  transform: {
    "\\.ts$": "ts-jest"
  }
};

module.exports = config;
