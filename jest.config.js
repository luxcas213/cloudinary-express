export default {
    transform: {
        "^.+\\.ts$": ["ts-jest", { useESM: true }],
    },
    extensionsToTreatAsEsm: [".ts"],
    testEnvironment: "node",
};
