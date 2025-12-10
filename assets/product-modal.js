"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunktheme_template"] = self["webpackChunktheme_template"] || []).push([["product-modal"],{

/***/ "./.src/js/product-modal.js":
/*!**********************************!*\
  !*** ./.src/js/product-modal.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./global */ \"./.src/js/global.js\");\n/* eslint-disable no-undef, no-unused-vars, eqeqeq, camelcase, no-var, no-redeclare, no-useless-return, no-useless-constructor, no-self-assign */\n\n\n\nif (!customElements.get('product-modal')) {\n  customElements.define('product-modal', class ProductModal extends _global__WEBPACK_IMPORTED_MODULE_0__.ModalDialog {\n    constructor () {\n      super()\n    }\n\n    hide () {\n      super.hide()\n    }\n\n    show (opener) {\n      super.show(opener)\n      this.showActiveMedia()\n    }\n\n    showActiveMedia () {\n      this.querySelectorAll(`[data-media-id]:not([data-media-id=\"${this.openedBy.getAttribute('data-media-id')}\"])`).forEach((element) => {\n        element.classList.remove('active')\n      }\n      )\n      const activeMedia = this.querySelector(`[data-media-id=\"${this.openedBy.getAttribute('data-media-id')}\"]`)\n      const activeMediaTemplate = activeMedia.querySelector('template')\n      const activeMediaContent = activeMediaTemplate ? activeMediaTemplate.content : null\n      activeMedia.classList.add('active')\n      activeMedia.scrollIntoView()\n\n      const container = this.querySelector('[role=\"document\"]')\n      container.scrollLeft = (activeMedia.width - container.clientWidth) / 2\n\n      if (activeMedia.nodeName == 'DEFERRED-MEDIA' && activeMediaContent && activeMediaContent.querySelector('.js-youtube')) { activeMedia.loadContent() }\n    }\n  })\n}\n\n\n//# sourceURL=webpack://theme-template/./.src/js/product-modal.js?");

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["common"], () => (__webpack_exec__("./.src/js/product-modal.js")));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);