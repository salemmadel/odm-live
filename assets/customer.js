/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunktheme_template"] = self["webpackChunktheme_template"] || []).push([["customer"],{

/***/ "./.src/js/customer.js":
/*!*****************************!*\
  !*** ./.src/js/customer.js ***!
  \*****************************/
/***/ (() => {

eval("/* Manage addresses buttons click */\n\nconst selectors = {\n  customerAddresses: '[data-customer-addresses]',\n  addressCountrySelect: '[data-address-country-select]',\n  addressContainer: '[data-address]',\n  toggleAddressButton: 'button[aria-expanded]',\n  cancelAddressButton: 'button[type=\"reset\"]',\n  deleteAddressButton: 'button[data-confirm-message]'\n}\n\nconst attributes = {\n  expanded: 'aria-expanded',\n  confirmMessage: 'data-confirm-message'\n}\n\nif (typeof $ !== 'undefined' && $('.customer.addresses').length) {\n  $(selectors.toggleAddressButton).on('click', function () {\n    this.setAttribute(\n      attributes.expanded,\n      (this.getAttribute(attributes.expanded) === 'false').toString()\n    )\n  })\n\n  $(selectors.deleteAddressButton).on('click', function (event) {\n    event.preventDefault()\n    var choice = confirm(this.getAttribute('data-confirm-message'))\n\n    if (choice) {\n      Shopify.postLink(this.dataset.target, {\n        parameters: { _method: 'delete' }\n      })\n    }\n  })\n  $(selectors.cancelAddressButton).on('click', function () {\n    var cancel = this.closest(selectors.addressContainer)\n      .querySelector(`[${attributes.expanded}]`)\n    cancel.setAttribute(\n      attributes.expanded,\n      (cancel.getAttribute(attributes.expanded) === 'false').toString()\n    )\n  })\n}\n\n\n//# sourceURL=webpack://theme-template/./.src/js/customer.js?");

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__("./.src/js/customer.js"));
/******/ }
]);