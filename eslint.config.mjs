import stylisticTs from "@stylistic/eslint-plugin-ts";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    files: ["**/*.ts"],
    plugins: {
      "@stylistic": stylisticTs,
      "@typescript-eslint": tseslint.plugin
    },
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: "latest",
      sourceType: "commonjs",
    }
  },
  { // Base rules
    rules: {
      "@typescript-eslint/explicit-function-return-type": ["warn", {
        allowExpressions: true,
      }],
      "@typescript-eslint/explicit-member-accessibility": "warn",
      "@typescript-eslint/member-ordering": ["warn", {
        classes: [
          "public-static-field",
          "protected-static-field",
          "private-static-field",
          "#private-static-field",
          "public-instance-field",
          "protected-instance-field",
          "private-instance-field",
          "#private-instance-field",
          "public-abstract-field",
          "protected-abstract-field",
          "public-constructor",
          "protected-constructor",
          "private-constructor",
          ["public-static-get", "public-static-set"],
          ["protected-static-get", "protected-static-set"],
          ["private-static-get", "private-static-set"],
          ["#private-static-get", "#private-static-set"],
          "public-static-method",
          "protected-static-method",
          "private-static-method",
          "#private-static-method",
          ["public-instance-get", "public-instance-set"],
          ["protected-instance-get", "protected-instance-set"],
          ["private-instance-get", "private-instance-set"],
          ["#private-instance-get", "#private-instance-set"],
          "public-instance-method",
          "protected-instance-method",
          "private-instance-method",
          "#private-instance-method",
          "public-abstract-method",
          "protected-abstract-method",
        ],
      }],
      "@typescript-eslint/naming-convention": ["warn",
        {
          selector: ["classProperty", "classMethod", "accessor"],
          format: ["camelCase"],
        }, {
          selector: ["classProperty", "classMethod"],
          modifiers: ["static"],
          format: ["camelCase", "UPPER_CASE"],
        }, {
          selector: ["variable", "function"],
          format: ["camelCase", "UPPER_CASE"],
        }, {
          selector: "parameter",
          format: ["camelCase"],

          filter: {
            regex: "^this$",
            match: false,
          },

          leadingUnderscore: "require",
        }, {
          selector: ["enum", "enumMember"],
          format: ["UPPER_CASE"],
        }, {
          selector: ["interface", "class"],
          format: ["PascalCase"],
        }
      ],
      "@typescript-eslint/no-empty-function": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-expressions": "warn",
      "@typescript-eslint/typedef": ["warn", {
        parameter: true,
        propertyDeclaration: true,
        variableDeclaration: true,
        variableDeclarationIgnoreFunction: true,
        memberVariableDeclaration: true,
      }],
      "no-cond-assign": "warn",
      "no-empty": "warn",
      "no-eval": "warn",
      "no-new-wrappers": "warn",
      "no-unused-labels": "warn",
    }
  },
  { // Stylistic rules
    rules: {
      "@stylistic/brace-style": ["warn", "1tbs", { allowSingleLine: true, }],
      "@stylistic/comma-dangle": "warn",
      "@stylistic/indent": ["warn", 2, {
        SwitchCase: 1,

        CallExpression: {
          arguments: "first",
        },

        FunctionDeclaration: {
          parameters: "first",
        },

        FunctionExpression: {
          parameters: "first",
        },
      }],
      "@stylistic/member-delimiter-style": "warn",
      "@stylistic/semi": "warn",
      "@stylistic/type-annotation-spacing": "warn",
    }
  }
);