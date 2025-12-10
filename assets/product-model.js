/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunktheme_template"] = self["webpackChunktheme_template"] || []).push([["product-model"],{

/***/ "./.src/js/product-model.js":
/*!**********************************!*\
  !*** ./.src/js/product-model.js ***!
  \**********************************/
/***/ (() => {

eval("/* eslint-disable no-undef, no-unused-vars, eqeqeq, camelcase, no-var, no-redeclare, no-useless-return, no-useless-constructor, no-self-assign */\n\nif (!customElements.get('product-model')) {\n  customElements.define('product-model', class ProductModel extends DeferredMedia {\n    constructor () {\n      super()\n    }\n\n    loadContent () {\n      super.loadContent()\n\n      Shopify.loadFeatures([\n        {\n          name: 'model-viewer-ui',\n          version: '1.0',\n          onLoad: this.setupModelViewerUI.bind(this)\n        }\n      ])\n    }\n\n    setupModelViewerUI (errors) {\n      if (errors) return\n\n      this.modelViewerUI = new Shopify.ModelViewerUI(this.querySelector('model-viewer'))\n    }\n  })\n}\n\nwindow.ProductModel = {\n  loadShopifyXR () {\n    Shopify.loadFeatures([\n      {\n        name: 'shopify-xr',\n        version: '1.0',\n        onLoad: this.setupShopifyXR.bind(this)\n      }\n    ])\n  },\n\n  setupShopifyXR (errors) {\n    if (errors) return\n\n    if (!window.ShopifyXR) {\n      document.addEventListener('shopify_xr_initialized', () =>\n        this.setupShopifyXR()\n      )\n      return\n    }\n\n    document.querySelectorAll('[id^=\"ProductJSON-\"]').forEach((modelJSON) => {\n      window.ShopifyXR.addModels(JSON.parse(modelJSON.textContent))\n      modelJSON.remove()\n    })\n    window.ShopifyXR.setupXRElements()\n  }\n}\n\nwindow.addEventListener('DOMContentLoaded', () => {\n  if (window.ProductModel) window.ProductModel.loadShopifyXR()\n})\n\n\n//# sourceURL=webpack://theme-template/./.src/js/product-model.js?");

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__("./.src/js/product-model.js"));
/******/ }
]);