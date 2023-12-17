https://github.com/postcss/autoprefixer#environment-variables
https://github.com/postcss/autoprefixer/blob/main/README.md

sass input: scss/main.scss
sass output: src/css/main.css
postcss input: src/css/main.css
postcss autoprefixer output: css/main.css

package.json, execute below CLI to watch both sass and postcss which are executed in parallel:
npm run sasscss