/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunktheme_template"] = self["webpackChunktheme_template"] || []).push([["password-modal"],{

/***/ "./.src/js/password-modal.js":
/*!***********************************!*\
  !*** ./.src/js/password-modal.js ***!
  \***********************************/
/***/ (() => {

eval("/* eslint-disable no-undef, no-unused-vars, eqeqeq, camelcase, no-var, no-redeclare, no-useless-return, no-useless-constructor, no-self-assign */\n\nclass PasswordModal extends DetailsModal {\n  constructor () {\n    super()\n\n    if (this.querySelector('input[aria-invalid=\"true\"]')) this.open({ target: this.querySelector('details') })\n  }\n}\n\ncustomElements.define('password-modal', PasswordModal)\n\n\n//# sourceURL=webpack://theme-template/./.src/js/password-modal.js?");

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__("./.src/js/password-modal.js"));
/******/ }
]);