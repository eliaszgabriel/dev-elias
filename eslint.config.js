// eslint.config.js (ESLint 9 - flat config)
import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import pluginImport from "eslint-plugin-import";
import configPrettier from "eslint-config-prettier";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  // Ignora a pasta de build
  globalIgnores(["dist"]),

  // Base JS + React + Import + Prettier
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      import: pluginImport,
    },
    // Em flat config, "extends" aceita arrays de configs
    extends: [
      js.configs.recommended,
      react.configs.recommended, // Regras React
      reactHooks.configs["recommended-latest"], // Hooks
      reactRefresh.configs.vite, // Fast refresh no dev
      configPrettier, // Desliga conflitos com Prettier
    ],
    settings: {
      react: { version: "detect" },
      // Faz o ESLint entender o alias "@/..."
      "import/resolver": {
        alias: {
          map: [["@", "./src"]],
          extensions: [".js", ".jsx"],
        },
      },
    },
    rules: {
      // JSX moderno (sem precisar importar React)
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",

      // Evita falso positivo com constantes em CAPS etc.
      "no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^[A-Z_]" },
      ],

      // Boa prática de ordem de imports
      "import/order": [
        "warn",
        {
          groups: [
            ["builtin", "external", "internal"],
            ["parent", "sibling", "index"],
          ],
          pathGroups: [
            { pattern: "@/**", group: "internal", position: "before" },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],

      // Ajuda a detectar imports quebrados
      "import/no-unresolved": "error",
    },
  },
]);
