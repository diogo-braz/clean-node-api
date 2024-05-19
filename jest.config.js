/** @type {import('jest').Config} */
const config = {
  collectCoverageFrom: [
    "<rootDir>/src/**/*.ts",
    "!<rootDir>/src/main/**"
  ],
  coverageDirectory: "coverage",
  coverageProvider: "babel",
  moduleNameMapper: {
    "@/tests/(.+)": "<rootDir>/tests/$1",
    "@/(.+)": "<rootDir>/src/$1"
  },
  roots: ["<rootDir>/src", "<rootDir>/tests"],
  preset: "@shelf/jest-mongodb",
  transform: {
    "\\.ts$": "ts-jest"
  }
};

module.exports = config;
