module.exports = {
    preset: "ts-jest",
    testEnvironment: "jest-environment-jsdom",
    testMatch: ["<rootDir>/src/**/renderer/components/**/*.spec.tsx"],
    moduleNameMapper: {
        "\\.css$": "<rootDir>/__mocks__/styleMock.js",
    },
    setupFilesAfterEnv: ["<rootDir>/testSetup/setupTests.ui.ts"],
    collectCoverage: true,
    collectCoverageFrom: ["src/**/*.(ts|tsx)"],
    coveragePathIgnorePatterns: ["/constants/", "/models/"],
}
