"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunktheme_template"] = self["webpackChunktheme_template"] || []).push([["cart-free-product"],{

/***/ "./.src/js/cart-free-product.js":
/*!**************************************!*\
  !*** ./.src/js/cart-free-product.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./global */ \"./.src/js/global.js\");\n/* eslint-disable no-undef, no-unused-vars, eqeqeq, camelcase, no-var, no-redeclare, no-useless-return, no-useless-constructor, no-self-assign */\n\n\n\nclass CartFreeProduct extends HTMLElement {\n  constructor () {\n    super()\n\n    this.loadingSpinner = this.querySelector('.loading-overlay')\n    this.getSectionsToRender = [\n      {\n        id: 'cart-icon-bubble',\n        section: 'cart-icon-bubble',\n        selector: '.shopify-section'\n      },\n      {\n        id: 'cart-notification',\n        section: 'cart-notification',\n        selector: '.js-contents'\n      }\n    ]\n\n    this.initEventlistener()\n  }\n  initEventlistener () {\n    fetch(window.Shopify.routes.root + 'cart.js', {\n      method: 'GET',\n      headers: {\n        'Content-Type': 'application/json'\n      }\n    })\n      .then((response) => response.json())\n      .then(async response => {\n        const cartItems = response.items\n        const freeProductsChildren = JSON.parse(localStorage.getItem(\"freeProducts\"))\n        for (var i = 0; i < freeProductsChildren.length; i++) {\n          const freeProductID = freeProductsChildren[i].id\n          const freeProductValue = freeProductsChildren[i].value\n          let isInCart = false\n          for (var index = 0; index < cartItems.length; index++ ){\n            if (cartItems[index].id == freeProductID){\n              isInCart = true;\n              break;\n            }\n          }\n          \n          if (isInCart == true && response.total_price < freeProductValue && cartItems[index].price == 0) {\n            (0,_global__WEBPACK_IMPORTED_MODULE_0__.updateItems)({\n              line: index+1,\n              quantity:0,\n              name: null,\n              sections: this.getSectionsToRender,\n              isRemovingItem: true\n            })\n  \n          }\n  \n        }\n      })\n      .catch((e) => {\n        // Silently handle error\n      })\n  }\n}\n\ncustomElements.define('cart-free-product', CartFreeProduct)\n\n\n//# sourceURL=webpack://theme-template/./.src/js/cart-free-product.js?");

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["common"], () => (__webpack_exec__("./.src/js/cart-free-product.js")));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);