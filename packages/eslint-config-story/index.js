module.exports = {
    parser: "@typescript-eslint/parser",
    extends: [
      "eslint:recommended",
      "turbo",
      "prettier",
      "plugin:import/typescript",
      "plugin:@typescript-eslint/recommended",
      "plugin:@typescript-eslint/recommended-requiring-type-checking",
    ],
    plugins: ["@typescript-eslint", "eslint-plugin-tsdoc", "import"],
    rules: {
        // eslint
        "curly": "error",
        "eqeqeq": "error",
        "no-implicit-coercion": ["error", { boolean: false }],
        "no-unused-expressions": "error",
        "no-useless-computed-key": "error",

        // Typescript 
        "no-shadow": "off",
        "@typescript-eslint/no-shadow": "error",
        "@typescript-eslint/no-unused-vars": "error",

        // import rules
        "import/newline-after-import": "error",
        "import/no-cycle": "error",
        "import/no-useless-path-segments": "error",
    }
}