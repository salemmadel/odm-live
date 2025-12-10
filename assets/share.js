"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunktheme_template"] = self["webpackChunktheme_template"] || []).push([["share"],{

/***/ "./.src/js/share.js":
/*!**************************!*\
  !*** ./.src/js/share.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _details_disclosure__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./details-disclosure */ \"./.src/js/details-disclosure.js\");\n/* eslint-disable no-undef, no-unused-vars, eqeqeq, camelcase, no-var, no-redeclare, no-useless-return, no-useless-constructor, no-self-assign */\n\n\n\nif (!customElements.get('share-button')) {\n  customElements.define('share-button', class ShareButton extends _details_disclosure__WEBPACK_IMPORTED_MODULE_0__.DetailsDisclosure {\n    constructor () {\n      super()\n\n      this.elements = {\n        shareButton: this.querySelector('button'),\n        shareSummary: this.querySelector('summary'),\n        closeButton: this.querySelector('.share-button__close'),\n        successMessage: this.querySelector('[id^=\"ShareMessage\"]'),\n        urlInput: this.querySelector('input')\n      }\n      this.urlToShare = this.elements.urlInput ? this.elements.urlInput.value : document.location.href\n\n      if (navigator.share) {\n        this.mainDetailsToggle.setAttribute('hidden', '')\n        this.elements.shareButton.classList.remove('hidden')\n        this.elements.shareButton.addEventListener('click', () => { navigator.share({ url: this.urlToShare, title: document.title }) })\n      } else {\n        this.mainDetailsToggle.addEventListener('toggle', this.toggleDetails.bind(this))\n        this.mainDetailsToggle.querySelector('.share-button__copy').addEventListener('click', this.copyToClipboard.bind(this))\n        this.mainDetailsToggle.querySelector('.share-button__close').addEventListener('click', this.close.bind(this))\n      }\n    }\n\n    toggleDetails () {\n      if (!this.mainDetailsToggle.open) {\n        this.elements.successMessage.classList.add('hidden')\n        this.elements.successMessage.textContent = ''\n        this.elements.closeButton.classList.add('hidden')\n        this.elements.shareSummary.focus()\n      }\n    }\n\n    copyToClipboard () {\n      navigator.clipboard.writeText(this.elements.urlInput.value).then(() => {\n        this.elements.successMessage.classList.remove('hidden')\n        this.elements.successMessage.textContent = window.accessibilityStrings.shareSuccess\n        this.elements.closeButton.classList.remove('hidden')\n        this.elements.closeButton.focus()\n      })\n    }\n\n    updateUrl (url) {\n      this.urlToShare = url\n      this.elements.urlInput.value = url\n    }\n  })\n}\n\n\n//# sourceURL=webpack://theme-template/./.src/js/share.js?");

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["common"], () => (__webpack_exec__("./.src/js/share.js")));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);