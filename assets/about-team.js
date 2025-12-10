/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunktheme_template"] = self["webpackChunktheme_template"] || []).push([["about-team"],{

/***/ "./.src/js/about-team.js":
/*!*******************************!*\
  !*** ./.src/js/about-team.js ***!
  \*******************************/
/***/ (() => {

eval("const AboutTeamButtons = document.querySelectorAll('.about-team-button')\nconst AboutTeamImages = document.querySelectorAll('.about-team-image')\n\nAboutTeamButtons.forEach((button) => {\n  const image = document.querySelector(`[id='${button.dataset.imageId}']`)\n\n  button.addEventListener('click', (e) => {\n    AboutTeamImages.forEach((image) => {\n      image.classList.remove('about-team-image-toggle')\n    })\n\n    AboutTeamButtons.forEach((button) => {\n      button.classList.remove('about-team-button-hover')\n    })\n\n    image.classList.toggle('about-team-image-toggle')\n    button.classList.toggle('about-team-button-hover')\n  })\n})\n\n\n//# sourceURL=webpack://theme-template/./.src/js/about-team.js?");

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__("./.src/js/about-team.js"));
/******/ }
]);