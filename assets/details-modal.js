"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunktheme_template"] = self["webpackChunktheme_template"] || []).push([["details-modal"],{

/***/ "./.src/js/details-modal.js":
/*!**********************************!*\
  !*** ./.src/js/details-modal.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./global */ \"./.src/js/global.js\");\n/* eslint-disable no-undef, no-unused-vars, eqeqeq, camelcase, no-var, no-redeclare, no-useless-return, no-useless-constructor, no-self-assign */\n\n\n\nclass DetailsModal extends HTMLElement {\n  constructor () {\n    super()\n    this.detailsContainer = this.querySelector('details')\n    this.summaryToggle = this.querySelector('summary')\n\n    this.detailsContainer.addEventListener(\n      'keyup',\n      (event) => event.code.toUpperCase() === 'ESCAPE' && this.close()\n    )\n    this.summaryToggle.addEventListener(\n      'click',\n      this.onSummaryClick.bind(this)\n    )\n    this.querySelector('button[type=\"button\"]').addEventListener(\n      'click',\n      this.close.bind(this)\n    )\n\n    this.summaryToggle.setAttribute('role', 'button')\n  }\n\n  isOpen () {\n    return this.detailsContainer.hasAttribute('open')\n  }\n\n  onSummaryClick (event) {\n    event.preventDefault()\n    event.target.closest('details').hasAttribute('open')\n      ? this.close()\n      : this.open(event)\n  }\n\n  onBodyClick (event) {\n    if (!this.contains(event.target) || event.target.classList.contains('modal-overlay')) this.close(false)\n  }\n\n  open (event) {\n    this.onBodyClickEvent =\n      this.onBodyClickEvent || this.onBodyClick.bind(this)\n    event.target.closest('details').setAttribute('open', true)\n    document.body.addEventListener('click', this.onBodyClickEvent)\n    document.body.classList.add('overflow-hidden')\n\n    ;(0,_global__WEBPACK_IMPORTED_MODULE_0__.trapFocus)(\n      this.detailsContainer.querySelector('[tabindex=\"-1\"]'),\n      this.detailsContainer.querySelector('input:not([type=\"hidden\"])')\n    )\n  }\n\n  close (focusToggle = true) {\n    (0,_global__WEBPACK_IMPORTED_MODULE_0__.removeTrapFocus)(focusToggle ? this.summaryToggle : null)\n    this.detailsContainer.removeAttribute('open')\n    document.body.removeEventListener('click', this.onBodyClickEvent)\n    document.body.classList.remove('overflow-hidden')\n  }\n}\n\ncustomElements.define('details-modal', DetailsModal)\n\n\n//# sourceURL=webpack://theme-template/./.src/js/details-modal.js?");

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["common"], () => (__webpack_exec__("./.src/js/details-modal.js")));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);