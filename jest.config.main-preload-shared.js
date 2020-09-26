module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["<rootDir>/src/**/service/**/*.spec.ts"],
    collectCoverage: true,
    collectCoverageFrom: ["src/**/*.ts"],
    coveragePathIgnorePatterns: ["/constants/", "/models/"],
}
