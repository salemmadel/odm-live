/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunktheme_template"] = self["webpackChunktheme_template"] || []).push([["show-more"],{

/***/ "./.src/js/show-more.js":
/*!******************************!*\
  !*** ./.src/js/show-more.js ***!
  \******************************/
/***/ (() => {

eval("/* eslint-disable no-undef, no-unused-vars, eqeqeq, camelcase, no-var, no-redeclare, no-useless-return, no-useless-constructor, no-self-assign */\n\nclass ShowMoreButton extends HTMLElement {\n  constructor () {\n    super()\n    const button = this.querySelector('button')\n    button.addEventListener('click', (event) => {\n      this.expandShowMore(event)\n      const nextElementToFocus = event.target.closest('.parent-display').querySelector('.show-more-item')\n      if (nextElementToFocus && !nextElementToFocus.classList.contains('hidden')) {\n        nextElementToFocus.querySelector('input').focus()\n      }\n    })\n  }\n\n  expandShowMore (event) {\n    const parentDisplay = event.target.closest('[id^=\"Show-More-\"]').closest('.parent-display')\n    const parentWrap = parentDisplay.querySelector('.parent-wrap')\n    this.querySelectorAll('.label-text').forEach(element => element.classList.toggle('hidden'))\n    parentDisplay.querySelectorAll('.show-more-item').forEach(item => item.classList.toggle('hidden'))\n  }\n}\n\ncustomElements.define('show-more-button', ShowMoreButton)\n\n\n//# sourceURL=webpack://theme-template/./.src/js/show-more.js?");

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__("./.src/js/show-more.js"));
/******/ }
]);