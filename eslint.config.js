import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
    { ignores: ['dist/**', 'node_modules/**'] },

    js.configs.recommended,

    /* Type-aware linting for source files. typescript-eslint runs on the
       TypeScript 6 API (the bare `typescript` dep); builds use TypeScript 7
       via the `typescript7` alias. This split goes away once typescript-eslint
       supports TS >= 7.1 — typescript-eslint#10940. */
    {
        files: ['**/*.ts'],
        extends: [tseslint.configs.recommendedTypeChecked],
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            /* A leading underscore marks a binding as deliberately unused. */
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                    ignoreRestSiblings: true,
                },
            ],

            /* node:test awaits the promises returned by describe/test itself. */
            '@typescript-eslint/no-floating-promises': [
                'error',
                {
                    allowForKnownSafeCalls: [
                        {
                            from: 'package',
                            package: 'node:test',
                            name: ['describe', 'it', 'test'],
                        },
                    ],
                },
            ],
        },
    },

    /* Config files aren't in tsconfig's `include`, so they get no type info. */
    {
        files: ['**/*.js'],
        extends: [tseslint.configs.disableTypeChecked],
        languageOptions: {
            globals: { console: 'readonly', process: 'readonly' },
        },
    },

    /* Prettier owns formatting; turn off every rule that would fight it. */
    prettier,
);
