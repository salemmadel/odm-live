"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunktheme_template"] = self["webpackChunktheme_template"] || []).push([["pickup-availability"],{

/***/ "./.src/js/pickup-availability.js":
/*!****************************************!*\
  !*** ./.src/js/pickup-availability.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./global */ \"./.src/js/global.js\");\n/* eslint-disable no-undef, no-unused-vars, eqeqeq, camelcase, no-var, no-redeclare, no-useless-return, no-useless-constructor, no-self-assign */\n\n\n\nif (!customElements.get('pickup-availability')) {\n  customElements.define('pickup-availability', class PickupAvailability extends HTMLElement {\n    constructor () {\n      super()\n\n      if (!this.hasAttribute('available')) return\n\n      this.errorHtml = this.querySelector('template').content.firstElementChild.cloneNode(true)\n      this.onClickRefreshList = this.onClickRefreshList.bind(this)\n      this.fetchAvailability(this.dataset.variantId)\n    }\n\n    fetchAvailability (variantId) {\n      let rootUrl = this.dataset.rootUrl\n      if (!rootUrl.endsWith('/')) {\n        rootUrl = rootUrl + '/'\n      }\n      const variantSectionUrl = `${rootUrl}variants/${variantId}/?section_id=pickup-availability`\n\n      fetch(variantSectionUrl)\n        .then(response => response.text())\n        .then(text => {\n          const sectionInnerHTML = new DOMParser()\n            .parseFromString(text, 'text/html')\n            .querySelector('.shopify-section')\n          this.renderPreview(sectionInnerHTML)\n        })\n        .catch(e => {\n          const button = this.querySelector('button')\n          if (button) button.removeEventListener('click', this.onClickRefreshList)\n          this.renderError()\n        })\n    }\n\n    onClickRefreshList (evt) {\n      this.fetchAvailability(this.dataset.variantId)\n    }\n\n    renderError () {\n      this.innerHTML = ''\n      this.appendChild(this.errorHtml)\n\n      this.querySelector('button').addEventListener('click', this.onClickRefreshList)\n    }\n\n    renderPreview (sectionInnerHTML) {\n      const drawer = document.querySelector('pickup-availability-drawer')\n      if (drawer) drawer.remove()\n      if (!sectionInnerHTML.querySelector('pickup-availability-preview')) {\n        this.innerHTML = ''\n        this.removeAttribute('available')\n        return\n      }\n\n      this.innerHTML = sectionInnerHTML.querySelector('pickup-availability-preview').outerHTML\n      this.setAttribute('available', '')\n\n      document.body.appendChild(sectionInnerHTML.querySelector('pickup-availability-drawer'))\n\n      const button = this.querySelector('button')\n      if (button) {\n        button.addEventListener('click', (evt) => {\n          document.querySelector('pickup-availability-drawer').show(evt.target)\n        })\n      }\n    }\n  })\n}\n\nif (!customElements.get('pickup-availability-drawer')) {\n  customElements.define('pickup-availability-drawer', class PickupAvailabilityDrawer extends HTMLElement {\n    constructor () {\n      super()\n\n      this.onBodyClick = this.handleBodyClick.bind(this)\n\n      this.querySelector('button').addEventListener('click', () => {\n        this.hide()\n      })\n\n      this.addEventListener('keyup', () => {\n        if (event.code.toUpperCase() === 'ESCAPE') this.hide()\n      })\n    }\n\n    handleBodyClick (evt) {\n      const target = evt.target\n      if (target != this && !target.closest('pickup-availability-drawer') && target.id != 'ShowPickupAvailabilityDrawer') {\n        this.hide()\n      }\n    }\n\n    hide () {\n      this.removeAttribute('open')\n      document.body.removeEventListener('click', this.onBodyClick)\n      document.body.classList.remove('overflow-hidden')\n      ;(0,_global__WEBPACK_IMPORTED_MODULE_0__.removeTrapFocus)(this.focusElement)\n    }\n\n    show (focusElement) {\n      this.focusElement = focusElement\n      this.setAttribute('open', '')\n      document.body.addEventListener('click', this.onBodyClick)\n      document.body.classList.add('overflow-hidden')\n      ;(0,_global__WEBPACK_IMPORTED_MODULE_0__.trapFocus)(this)\n    }\n  })\n}\n\n\n//# sourceURL=webpack://theme-template/./.src/js/pickup-availability.js?");

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["common"], () => (__webpack_exec__("./.src/js/pickup-availability.js")));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);