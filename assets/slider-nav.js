/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunktheme_template"] = self["webpackChunktheme_template"] || []).push([["slider-nav"],{

/***/ "./.src/js/slider-nav.js":
/*!*******************************!*\
  !*** ./.src/js/slider-nav.js ***!
  \*******************************/
/***/ (() => {

eval("class SliderNav extends HTMLElement {\n  constructor () {\n    super()\n    console.log('loaded slider')\n\n    this.left = this.querySelector('[data-slide-left]')\n    this.right = this.querySelector('[data-slide-right]')\n    this.tags = this.querySelector('.tag-sorting')\n\n    // this.left.addEventListener('mousedown', this.toTheLeft);\n    this.right.addEventListener('click', this.toTheRight.bind(this))\n    this.left.addEventListener('click', this.toTheLeft.bind(this))\n  }\n\n  toTheRight () {\n    let done = false\n    const container = this.tags.getBoundingClientRect()\n\n    for (const tag of this.tags.children) {\n      const position = tag.getBoundingClientRect()\n\n      if (done) {\n        break\n      }\n      if (position.left > container.left && position.right > container.right + 10) {\n        tag.scrollIntoView({ block: 'nearest', behavior: 'smooth', inline: 'center' })\n        done = true\n      }\n    }\n  }\n\n  toTheLeft () {\n    let done = false\n    const container = this.tags.getBoundingClientRect()\n    let last = this.tags.children\n\n    for (const tag of this.tags.children) {\n      const position = tag.getBoundingClientRect()\n      if (done) {\n        break\n      } else if (position.right > container.right || position.left > container.left) {\n        last.scrollIntoView({ block: 'nearest', behavior: 'smooth', inline: 'center' })\n        done = true\n      } else if (position.right > container.left) {\n        tag.scrollIntoView({ block: 'nearest', behavior: 'smooth', inline: 'center' })\n        done = true\n      }\n      last = tag\n    }\n  }\n}\n\ncustomElements.define('slider-nav', SliderNav)\n\n\n//# sourceURL=webpack://theme-template/./.src/js/slider-nav.js?");

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__("./.src/js/slider-nav.js"));
/******/ }
]);