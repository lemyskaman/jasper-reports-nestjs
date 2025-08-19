module.exports = {
  testMatch: [
    "**/test/**/*.spec.ts",
    "**/test/**/*.e2e-spec.ts",
    "**/test/*.e2e-spec.ts",
    "**/src/**/*.spec.ts"
  ],
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: ".",
  testEnvironment: "node",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  coverageDirectory: "./coverage",
  collectCoverageFrom: ["src/**/*.(t|j)s"],
};
