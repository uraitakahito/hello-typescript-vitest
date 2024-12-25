//
// eslint-config-airbnb*
//
// > Use eslint v8 until such time as our configs support v9:
//   https://github.com/airbnb/javascript/issues/2961
//
// Backwards compatibility utility is available:
//   https://eslint.org/blog/2022/08/new-config-system-part-2/#backwards-compatibility-utility
//
// peerDependencies:
//   https://github.com/airbnb/javascript/blob/11f986fdc7d6b4c80e396437e9c45c939362bdee/packages/eslint-config-airbnb-base/package.json#L82-L85
//

/**
 * Naming conventions
 */
const commonWarnNamingRules = [
  // https://google.github.io/styleguide/tsguide.html#naming-rules-by-identifier-type
  {
    selector: 'variable',
    format: ['camelCase'],
  },

  //
  // Only symbols declared on the module level, static fields of module level classes, and values of module level enums, may use CONST_CASE.
  // https://google.github.io/styleguide/tsguide.html#identifiers-constants
  //
  {
    selector: ['enum', 'enumMember'],
    format: ['UPPER_CASE'],
  },

  {
    selector: 'function',
    format: ['camelCase'],
    leadingUnderscore: 'allow',
  },

  // https://google.github.io/styleguide/tsguide.html#class-members
  {
    selector: 'accessor',
    format: ['camelCase'],
  },

  {
    selector: 'parameter',
    format: ['camelCase'],
    leadingUnderscore: 'allow',
  },

  {
    selector: 'class',
    format: ['PascalCase'],
  },

  //
  // Type parameters, like in Array<T>, may use a single upper case character (T) or UpperCamelCase
  // https://google.github.io/styleguide/tsguide.html#identifiers-type-parameters
  //
  {
    selector: 'typeParameter',
    format: ['PascalCase'],
  },

  // Enforce that boolean variables are prefixed with an allowed verb
  {
    selector: ['memberLike', 'variableLike'],
    types: ['boolean'],
    format: ['PascalCase'],
    prefix: ['can', 'did', 'has', 'is', 'must', 'need', 'should', 'will'],
  },
];

/** 共通命名rules */
const namingRules = {
  '@typescript-eslint/naming-convention': [
    'warn',
    ...commonWarnNamingRules,
  ],
};

module.exports = {
  root: true,
  parserOptions: {
    project: './tsconfig.json',
  },
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  extends: [
    //
    // This package provides Airbnb's .eslintrc as an extensible shared config.
    //
    // If you don't need React support:
    // https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb/index.js
    "airbnb-base",
    // If you need React support:
    // https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb-base/index.js
    // 'airbnb',

    //
    // Enhances Airbnb's ESLint config with TypeScript support
    //
    // If you don't need React support:
    "airbnb-typescript/base",
    // If you need React support:
    // 'airbnb-typescript',
  ],
  overrides: [
    {
      files: ['vite.config.*[cmjt]*s', 'vitest.config.*[cmjt]*s'],
      rules: {
        // https://typescript-eslint.io/rules/naming-convention/
        '@typescript-eslint/naming-convention': 'off',
        // https://github.com/import-js/eslint-plugin-import/blob/v2.31.0/docs/rules/no-extraneous-dependencies.md
        'import/no-extraneous-dependencies': 'off',
      },
    }
  ],
  rules: {
    ...namingRules,
  },
};
