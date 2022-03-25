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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _users_store_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./users-store.mjs */ \"./src/users-store.mjs\");\n\n\n// const READY_STATE = {\n//   CONNECTING: 0,\n//   OPEN: 1,\n//   CLOSING: 2,\n//   CLOSED: 3,\n// }\n\n// const DISCONNECT_TIMEOUT = 7000\n\nfunction CabinetClient (options) {\n  this.messages = []\n  this.connection = new WebSocket(options.uri)\n  // this.pong = false\n  this.cabinet = options.cabinet\n\n  // this.ping = () => {\n  //   console.log('_PING_')\n  //   if (this.connection.readyState > READY_STATE.OPEN) return\n  //   if (!this.pong) {\n  //     return this.connection.close()\n  //   }\n  //   this.pong = false\n  //   // this.connection.send(0x9)\n  //   setTimeout(this.ping, DISCONNECT_TIMEOUT)\n  // }\n\n  this.connection.onmessage = event => {\n    const message = JSON.parse(event.data)\n    // if (message === 'pong') {\n    //   this.pong = true\n    //   return\n    // }\n\n    const { type, data } = message\n    if (type === 'get') {\n      const { key, patches, users } = data\n      ;(0,_users_store_mjs__WEBPACK_IMPORTED_MODULE_0__.setUsersByKey)(key, users)\n      this.cabinet.applyOps(key, patches)\n    }\n  }\n\n  this.connection.onopen = event => {\n    // this.pong = true\n    // this.ping()\n    this.messages.forEach(message => {\n      this.sendMessage(message)\n    })\n  }\n\n  this.connection.onclose = event => {\n    ;(0,_users_store_mjs__WEBPACK_IMPORTED_MODULE_0__.clearStore)()\n  }\n\n  this.sendMessage = message => {\n    if (this.connection?.readyState === WebSocket.OPEN) {\n      this.connection.send(JSON.stringify(message))\n    } else {\n      // If a lot of changes happen all offline, this will cause an explosion of updates to all be sent.\n      // Merge messages together\n      if (message.type === 'set') {\n        const existingMessage = this.messages.find(message2 => message.data.key === message2.data.key)\n        if (existingMessage) {\n          existingMessage.data.patches.push(message.data.patches)\n          return\n        }\n      }\n      this.messages.push(message)\n    }\n  }\n\n  this.subscribe = (key, patches) => {\n    this.sendMessage({\n      type: 'subscribe',\n      data: { cabinet: '/shelves2', key, patches },\n    })\n  }\n\n  this.unsubscribe = key => {\n    this.sendMessage({\n      type: 'unsubscribe',\n      data: { cabinet: '/shelves2', key },\n    })\n  }\n\n  this.uri = options.uri\n}\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CabinetClient);\n\n\n//# sourceURL=webpack://game-server/./src/cabinet-client.mjs?");

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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var markdown__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! markdown */ \"./node_modules/markdown/lib/index.js\");\n/* harmony import */ var _silicon_jungle_cabinet__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @silicon-jungle/cabinet */ \"./node_modules/@silicon-jungle/cabinet/index.js\");\n/* harmony import */ var _cabinet_client_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./cabinet-client.mjs */ \"./src/cabinet-client.mjs\");\n/* harmony import */ var _cabinet_repository_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./cabinet-repository.mjs */ \"./src/cabinet-repository.mjs\");\n/* harmony import */ var _users_store_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./users-store.mjs */ \"./src/users-store.mjs\");\n\n\n// import Cabinet from './cabinet.js'\n\n\n\n\nwindow.addEventListener('load', () => {\n  const dataKey = window.location.pathname\n\n  const $ = (id) => document.getElementById(id)\n  const input = $('text-input')\n  const preview = $('preview')\n  const usersContainer = $('users-container')\n\n  const cabinet = new _silicon_jungle_cabinet__WEBPACK_IMPORTED_MODULE_1__[\"default\"](_cabinet_repository_mjs__WEBPACK_IMPORTED_MODULE_3__[\"default\"])\n  let onlineUsers = []\n\n  const setUsers = users => {\n    onlineUsers = users\n    usersContainer.innerHTML = `${users.length} guests <b>viewing</b> this page.`\n  }\n\n  ;(0,_users_store_mjs__WEBPACK_IMPORTED_MODULE_4__.subscribeToUsersByKey)(dataKey, setUsers)\n\n  const client = new _cabinet_client_mjs__WEBPACK_IMPORTED_MODULE_2__[\"default\"]({\n    uri: 'wss://silicon-jungle.herokuapp.com',\n    // uri: 'ws://localhost:3000',\n    cabinet,\n  })\n\n  let accessToken = localStorage.getItem('accessToken')\n\n  window.addEventListener('keydown', e => {\n    if (e.ctrlKey && e.shiftKey) {\n      if (e.which === 80) {\n        accessToken = prompt('Enter access token')\n        localStorage.setItem('accessToken', accessToken)\n      } else if (e.which === 86) {\n        input.style.display = input.style.display === 'block' ? 'none' : 'block'\n      }\n    }\n  })\n\n  let data = null\n  const setData = value => {\n    data = value\n  }\n\n  const subscriptionCallback = (key, shelf, patches) => {\n    if (data !== shelf.value) {\n      setData(shelf.value)\n      editor.setValue(shelf.value)\n    }\n  }\n\n  cabinet.getShelf(dataKey).then(shelf => {\n    client.subscribe(dataKey, shelf.history)\n    cabinet.addSubscription(dataKey, subscriptionCallback)\n  }).catch(error => {\n    console.log('_ERROR_', error)\n  })\n\n  const setValue = (key, value) => {\n    if (accessToken) {\n      setData(value)\n      cabinet.setState(key, value).then((patches) => {\n        client.sendMessage({\n          accessToken,\n          type: 'set',\n          data: {\n            cabinet: '/shelves2',\n            key,\n            patches,\n          },\n        })\n      }).catch(e => {\n        console.log('_ERROR_', e)\n      })\n    }\n  }\n\n  function Editor(input, preview) {\n    this.update = (sync = true) => {\n      preview.innerHTML = markdown__WEBPACK_IMPORTED_MODULE_0__.markdown.toHTML(input.value)\n      if (sync /* && input.value !== data */) {\n        setValue(dataKey, input.value)\n      }\n    }\n    this.setValue = (value) => {\n      input.innerHTML = value\n      input.value = value\n      preview.innerHTML = markdown__WEBPACK_IMPORTED_MODULE_0__.markdown.toHTML(value)\n    }\n    input.editor = this\n    this.update(false)\n  }\n\n  const editor = new Editor(input, preview)\n})\n\n\n//# sourceURL=webpack://game-server/./src/resource.mjs?");

/***/ }),

/***/ "./src/users-store.mjs":
/*!*****************************!*\
  !*** ./src/users-store.mjs ***!
  \*****************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"clearStore\": () => (/* binding */ clearStore),\n/* harmony export */   \"getUsersByKey\": () => (/* binding */ getUsersByKey),\n/* harmony export */   \"setUsersByKey\": () => (/* binding */ setUsersByKey),\n/* harmony export */   \"subscribeToUsersByKey\": () => (/* binding */ subscribeToUsersByKey),\n/* harmony export */   \"unsubscribeFromUsersByKey\": () => (/* binding */ unsubscribeFromUsersByKey)\n/* harmony export */ });\n/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! events */ \"./node_modules/events/events.js\");\n\n\nconst usersEmitter = new events__WEBPACK_IMPORTED_MODULE_0__()\nusersEmitter.setMaxListeners(0)\n\nlet usersStore = {}\n\nconst getUsersByKey = (key) => {\n  return usersStore[key]\n}\n\nconst setUsersByKey = (key, users) => {\n  usersStore[key] = users\n  usersEmitter.emit(key, users)\n}\n\nconst clearStore = () => {\n  const keys = Object.keys(usersStore)\n  keys.forEach(key => {\n    usersEmitter.emit(key, [])\n  })\n  usersStore = {}\n}\n\nconst subscribeToUsersByKey = (key, callback) => {\n  usersEmitter.addListener(key, callback)\n}\n\nconst unsubscribeFromUsersByKey = (key, callback) => {\n  usersEmitter.removeListener(key, callback)\n}\n\n\n//# sourceURL=webpack://game-server/./src/users-store.mjs?");

/***/ })

}]);