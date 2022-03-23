"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkgame_server"] = self["webpackChunkgame_server"] || []).push([["src_resource_mjs"],{

/***/ "./src/cabinet-client.mjs":
/*!********************************!*\
  !*** ./src/cabinet-client.mjs ***!
  \********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nfunction CabinetClient (options) {\n  this.messages = []\n  this.connection = new WebSocket(options.uri)\n  this.cabinet = options.cabinet\n\n  this.connection.onmessage = event => {\n    const message = JSON.parse(event.data)\n    const { type, data } = message\n    if (type === 'get') {\n      const { key, patches } = data\n      this.cabinet.applyOps(key, patches)\n    }\n  }\n\n  this.connection.onopen = event => {\n    this.messages.forEach(message => {\n      this.sendMessage(message)\n    })\n  }\n\n  this.sendMessage = message => {\n    if (this.connection?.readyState === WebSocket.OPEN) {\n      this.connection.send(JSON.stringify(message))\n    } else {\n      this.messages.push(message)\n    }\n  }\n\n  this.subscribe = (key, patches) => {\n    this.sendMessage({\n      type: 'subscribe',\n      data: { key, patches },\n    })\n  }\n\n  this.unsubscribe = key => {\n    this.sendMessage({\n      type: 'unsubscribe',\n      data: { key },\n    })\n  }\n\n  this.uri = options.uri\n}\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CabinetClient);\n\n\n//# sourceURL=webpack://game-server/./src/cabinet-client.mjs?");

/***/ }),

/***/ "./src/cabinet-repository.mjs":
/*!************************************!*\
  !*** ./src/cabinet-repository.mjs ***!
  \************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n// This is going to be annoying to implement? but then again do I really need it?\n// I think I'd need to store all the indices in local storage somewhere.\nconst getKeys = async () => []\n\nconst getShelfByKey = async key => {\n  const storedValue = window.localStorage.getItem(key)\n  return storedValue && JSON.parse(storedValue) || null\n}\n\nconst setShelfByKey = async (key, shelf) => {\n  localStorage.setItem(key, JSON.stringify(shelf))\n}\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n  getKeys,\n  getShelfByKey,\n  setShelfByKey,\n});\n\n\n//# sourceURL=webpack://game-server/./src/cabinet-repository.mjs?");

/***/ }),

/***/ "./src/resource.mjs":
/*!**************************!*\
  !*** ./src/resource.mjs ***!
  \**************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var markdown__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! markdown */ \"./node_modules/markdown/lib/index.js\");\n/* harmony import */ var _silicon_jungle_cabinet__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @silicon-jungle/cabinet */ \"./node_modules/@silicon-jungle/cabinet/index.js\");\n/* harmony import */ var _cabinet_client_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./cabinet-client.mjs */ \"./src/cabinet-client.mjs\");\n/* harmony import */ var _cabinet_repository_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./cabinet-repository.mjs */ \"./src/cabinet-repository.mjs\");\n\n\n// import Cabinet from './cabinet.js'\n\n\n\nconst cabinet = new _silicon_jungle_cabinet__WEBPACK_IMPORTED_MODULE_1__[\"default\"](_cabinet_repository_mjs__WEBPACK_IMPORTED_MODULE_3__[\"default\"])\nconst client = new _cabinet_client_mjs__WEBPACK_IMPORTED_MODULE_2__[\"default\"]({\n  // uri: 'wss://silicon-jungle.herokuapp.com',\n  uri: 'ws://localhost:3000',\n  cabinet,\n})\n\nconst $ = (id) => document.getElementById(id)\nconst input = $('text-input')\nconst preview = $('preview')\n\nlet accessToken = localStorage.getItem('accessToken')\n\nwindow.addEventListener('keydown', e => {\n  if (e.ctrlKey && e.shiftKey) {\n    if (e.which === 80) {\n      accessToken = prompt('Enter access token')\n      localStorage.setItem('accessToken', accessToken)\n    } else if (e.which === 86) {\n      console.log('_V_')\n      input.style.display = input.style.display === 'block' ? 'none' : 'block'\n    }\n  }\n})\n\nwindow.addEventListener('load', () => {\n  let data = null\n  const setData = value => {\n    data = value\n  }\n\n  const subscriptionCallback = (key, shelf, patches) => {\n    if (data !== shelf.value) {\n      setData(shelf.value)\n      editor.setValue(shelf.value)\n    }\n  }\n\n  const dataKey = window.location.pathname\n\n  cabinet.getShelf(dataKey).then(shelf => {\n    client.subscribe(dataKey, shelf.history)\n    cabinet.addSubscription(dataKey, subscriptionCallback)\n  }).catch(error => {\n    console.log('_ERROR_', error)\n  })\n\n  const setValue = (key, value) => {\n    if (accessToken) {\n      setData(value)\n      cabinet.setState(key, value).then((patches) => {\n        client.sendMessage({\n          accessToken,\n          type: 'set',\n          data: {\n            key,\n            patches,\n          },\n        })\n      }).catch(e => {\n        console.log('_ERROR_', e)\n      })\n    }\n  }\n\n  function Editor(input, preview) {\n    this.update = (sync = true) => {\n      preview.innerHTML = markdown__WEBPACK_IMPORTED_MODULE_0__.markdown.toHTML(input.value)\n      if (sync /* && input.value !== data */) {\n        setValue(dataKey, input.value)\n      }\n    }\n    this.setValue = (value) => {\n      input.innerHTML = value\n      input.value = value\n      preview.innerHTML = markdown__WEBPACK_IMPORTED_MODULE_0__.markdown.toHTML(value)\n    }\n    input.editor = this\n    this.update(false)\n  }\n\n  const editor = new Editor(input, preview)\n})\n\n\n//# sourceURL=webpack://game-server/./src/resource.mjs?");

/***/ })

}]);