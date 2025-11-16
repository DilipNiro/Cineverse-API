export default {
  testEnvironment: "node",
  transform: {},
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  testMatch: ["**/src/tests/**/*.js"],
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/tests/**",
    "!src/server.js",
  ],
  coverageDirectory: "coverage",
  verbose: true,
};

