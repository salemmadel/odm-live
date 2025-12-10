"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunktheme_template"] = self["webpackChunktheme_template"] || []).push([["cart"],{

/***/ "./.src/js/cart.js":
/*!*************************!*\
  !*** ./.src/js/cart.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./global */ \"./.src/js/global.js\");\n/* eslint-disable no-undef, no-unused-vars, eqeqeq, camelcase, no-var, no-redeclare, no-useless-return, no-useless-constructor, no-self-assign */\n\n\n\nclass CartRemoveButton extends HTMLElement {\n  constructor () {\n    super()\n\n    this.getSectionsToRender = [\n      {\n        id: 'main-cart-items',\n        section: document.getElementById('main-cart-items').dataset.id,\n        selector: '.js-contents'\n      },\n      {\n        id: 'cart-icon-bubble',\n        section: 'cart-icon-bubble',\n        selector: '.shopify-section'\n      },\n      {\n        id: 'cart-live-region-text',\n        section: 'cart-live-region-text',\n        selector: '.shopify-section'\n      },\n      {\n        id: 'cart-upsell-items',\n        section: 'cart-upsell-items'\n      },\n      {\n        id: 'main-cart-footer',\n        section: document.getElementById('main-cart-footer').dataset.id,\n        selector: '.js-contents'\n      }\n    ]\n\n    this.addEventListener('click', (event) => {\n      event.preventDefault()\n      if (this.closest('.cart-items')) {\n        (0,_global__WEBPACK_IMPORTED_MODULE_0__.updateItems)({\n          line: this.dataset.index,\n          quantity: 0,\n          name: null,\n          sections: this.getSectionsToRender,\n          cartType: 'main',\n          isRemovingItem: true\n        })\n      }\n    })\n  }\n}\n\ncustomElements.define('cart-remove-button', CartRemoveButton)\n\nclass CartItems extends HTMLElement {\n  constructor () {\n    super()\n\n    this.getSectionsToRender = [\n      {\n        id: 'main-cart-items',\n        section: document.getElementById('main-cart-items').dataset.id,\n        selector: '.cart__items'\n      },\n      {\n        id: 'cart-icon-bubble',\n        section: 'cart-icon-bubble',\n        selector: '.shopify-section'\n      },\n      {\n        id: 'cart-live-region-text',\n        section: 'cart-live-region-text',\n        selector: '.shopify-section'\n      },\n      {\n        id: 'main-cart-footer',\n        section: document.getElementById('main-cart-footer').dataset.id,\n        selector: '.js-contents'\n      }\n    ]\n\n    this.currentItemCount = Array.from(this.querySelectorAll('[name=\"updates[]\"]'))\n      .reduce((total, quantityInput) => total + parseInt(quantityInput.value), 0)\n\n    this.debouncedOnChange = (0,_global__WEBPACK_IMPORTED_MODULE_0__.debounce)((event) => {\n      this.onChange(event)\n    }, 300)\n\n    this.addEventListener('change', this.debouncedOnChange.bind(this))\n  }\n\n  onChange (event) {\n    (0,_global__WEBPACK_IMPORTED_MODULE_0__.updateItems)({\n      line: event.target.dataset.index,\n      quantity: event.target.value,\n      name: document.activeElement.getAttribute('name'),\n      sections: this.getSectionsToRender,\n      cartType: 'main',\n      isUpdatingQuantity: true\n    })\n  }\n}\n\ncustomElements.define('cart-items', CartItems)\n\n\n//# sourceURL=webpack://theme-template/./.src/js/cart.js?");

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["common"], () => (__webpack_exec__("./.src/js/cart.js")));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);