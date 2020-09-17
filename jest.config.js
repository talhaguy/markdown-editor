module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["<rootDir>/src/**/*.spec.ts"],
    collectCoverage: true,
    collectCoverageFrom: ["src/**/*.(ts|tsx)"],
    coveragePathIgnorePatterns: ["/constants/", "/models/"],
}
