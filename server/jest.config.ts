export default {
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: 'coverage',
    forceExit: true,
    maxWorkers: 1,
    moduleFileExtensions: ['js', 'mjs', 'cjs', 'ts', 'json', 'node'],
    testMatch: ['**/__tests__/**/*.[jt]s?(x)'],
    testTimeout: 30000,
    testPathIgnorePatterns: ['\\\\node_modules\\\\'],
    transform: {
        '^.+\\.(ts)$': ['ts-jest', { tsConfigFile: 'tsconfig.json' }],
    },
    preset: 'ts-jest',
    testEnvironment: 'node',
}
