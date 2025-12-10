/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunktheme_template"] = self["webpackChunktheme_template"] || []).push([["theme-editor"],{

/***/ "./.src/js/theme-editor.js":
/*!*********************************!*\
  !*** ./.src/js/theme-editor.js ***!
  \*********************************/
/***/ (() => {

eval("/* eslint-disable no-undef, no-unused-vars, eqeqeq, camelcase, no-var, no-redeclare, no-useless-return, no-useless-constructor, no-self-assign */\n\ndocument.addEventListener('shopify:block:select', function (event) {\n  const blockSelectedIsSlide = event.target.classList.contains('slideshow__slide')\n  if (!blockSelectedIsSlide) return\n\n  const parentSlideshowComponent = event.target.closest('slideshow-component')\n  parentSlideshowComponent.pause()\n\n  setTimeout(function () {\n    parentSlideshowComponent.slider.scrollTo({\n      left: event.target.offsetLeft\n    })\n  }, 200)\n})\n\ndocument.addEventListener('shopify:block:deselect', function (event) {\n  const blockDeselectedIsSlide = event.target.classList.contains('slideshow__slide')\n  if (!blockDeselectedIsSlide) return\n  const parentSlideshowComponent = event.target.closest('slideshow-component')\n  if (parentSlideshowComponent.autoplayButtonIsSetToPlay) parentSlideshowComponent.play()\n})\n\n\n//# sourceURL=webpack://theme-template/./.src/js/theme-editor.js?");

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__("./.src/js/theme-editor.js"));
/******/ }
]);