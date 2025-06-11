module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  plugins: ["@typescript-eslint", "react", "react-hooks"],
  rules: {
    // React specific rules
    "react/react-in-jsx-scope": "off", // Not needed in React 17+
    "react/prop-types": "off", // We're using TypeScript
    "react/display-name": "off",

    // TypeScript specific rules
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/no-require-imports": "error", // Allow require() in config files
    "@typescript-eslint/no-unsafe-function-type": "off", // Too strict for generated files
    "@typescript-eslint/no-empty-object-type": "off", // Too strict for generated files

    // General rules
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "no-debugger": "warn",
    "no-duplicate-imports": "error",
    "no-unused-expressions": "error",
    "prefer-const": "warn",
    "no-var": "error",
    eqeqeq: ["error", "always"],
    curly: ["error", "all"],
    semi: ["error", "always"],
    quotes: ["error", "single", { avoidEscape: true }],
  },
  overrides: [
    {
      files: ["*.test.ts", "*.test.tsx"],
      env: {
        jest: true,
      },
    },
    {
      files: ["*.config.js", "*.config.ts"],
      rules: {
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/no-require-imports": "off",
      },
    },
  ],
};
