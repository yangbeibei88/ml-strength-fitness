# ML Strength Website Project

## Overview
This project is about developing a 5-page website for ML Strength, a fitness business that have five clubs in Brisbane, Ashgrove, Chermside, Graceville, and Westlake.

The website is deployed on Netlify for easy HTML validation and web accessibility validation during development, access to the site from the below link:

https://dulcet-semifreddo-e54283.netlify.app/

## Site Architecture
- root:
  - [index.html](./index.html)
  - [styleguide.html](./styleguide.html)
  - [favicon.ico](./favicon.ico)
  - [📁html](./html/) includes all html pages
  - [📁css](./css/) includes all css files
  - [📁js](./js/) includes all css files
  - [📁data](./data/) includes all json files used for this site
  - [📁img](./img/) includes images used for this site
  - [📁video](./video/) includes a video used for help link
  - [📁scss](./scss/) includes all scss files
  - [📁assets](./assets/) includes [assets/fonts](./assets/fonts/) used for the site and [assets/leaflet](./assets/leaflet/) files to be able to get map up and running
  - [📁logo](./logo/) site logo
  - [📁webfonts](./webfonts/) fontawesome fonts. Can only be in root
  - [📁src](./src/):
    - [📁src/css](./src/css/) scss output / postcss autoprefix input
    - [📁src/data](./src/data/) initially populated data to spreadsheets which are inputs of json files in [📁data](./data/)
  - [postcss.config.js](./postcss.config.js) enable Autoprefixer plugin
  - [package.json](./package.json) check dependencies and CLIs
  - [node_modules](./node_modules) downloaded packages


## Built With
This project was built with Vanilla HTML, CSS and Javascript.

## Dev Tools
Dev Tools used in this project include node.js, sass, and postcss's autoprefixer

### SASS
SASS is a css compiler. All styling work were done in scss folder.
In [📁scss](./scss) folder, sass partials (scss files started with underscore) were organised in subfolders. There is an _index.scss file located in each partial folder that loads all partial files in the same partial folder, that can be used by other partial files.

The structure was referenced from https://sass-guidelin.es/#architecture

### Autoprefixer
Postcss's Autoprefixer plugin was used during development. This plugin autoprefix browser's extensions to css files.

In this project:
- scss files in [📁scss](./scss/) folder first complied to [📁src/css](./src/css/) folder in which css files are ready to Autoprefixer;
- css files in [📁src/css](./src/css) folder then autoprefixed to [📁css](./css/) folder
- Command lines can be found in [package.json](./package.json):
  - `npm run sasscss`: compile scss to css and Autoprefixer watch both sass and postcss **[scss/main.scss](./scss/main.scss) to [src/css/main.css](./src/css/main.css)**, **[src/css/main.css](./src/css/main.css) to [css/main.css](./css/main.css)** in parallel.
  - `postcss:build-reset`: Autoprefixer reset.css. Build **[src/css/reset.css](./src/css/reset.css)** to **[css/reset.css](./css/reset.css)** (Since no further changes on reset css, I only need to build no watch)
  - `postcss:build-fa`: Autoprefixer fontawesome.css. Build **[src/css/fontawesome.css](./src/css/fontawesome.css)** to **[css/fontawesome.css](./css/fontawesome.css)** (Since no further changes on reset css, I only need to build no watch)
  - input output:
    - sass input: 
      - [scss/main.scss](./scss/main.scss)
      - [scss/reset.scss](./scss/main.scss)
      - [scss/fontawesome.scss](./scss/fontawesome.scss)
    - sass output & postcss input: 
      - [src/css/main.css](./src/css/main.css)
      - [src/css/reset.css](./src/css/reset.css)
      - [src/css/fontawesome.css](.src/css/fontawesome.css)
    - postcss autoprefixer output:
      - [css/main.css](./css/main.css)
      - [css/reset.css](./css/main.css)
      - [css/fontawesome.css](./css/main.css)


**Reference**
https://github.com/postcss/autoprefixer#environment-variables
https://github.com/postcss/autoprefixer/blob/main/README.md

## Libraries
Libraries used in this project including Google Fonts, Fontawesome, and Leaflet are hosted in local server rather than using CDN.

### Google Fonts
All font files located in [Google Fonts](./assets/fonts/) that were used for fontface in [./scss/base/_fontface.scss](./scss/base/_fontface.scss)

### Fontawesome
fontawesome imported from [node_modules/@fontawesome](./node_modules/@fortawesome) to [scss/fontawesome.scss](./scss/fontawesome.scss)

### Leaflet
Leaflet imported from [node_modules/leaflet](./node_modules/leaflet/) to [assets/leaflet](./assets/leaflet/)

## License
TAFE Queensland ICTWEB519_520_AT3

## Contact
- Beibei Yang (474326484), beibeiyang88@hotmail.com