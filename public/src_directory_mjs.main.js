"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkgame_server"] = self["webpackChunkgame_server"] || []).push([["src_directory_mjs"],{

/***/ "./src/directory.mjs":
/*!***************************!*\
  !*** ./src/directory.mjs ***!
  \***************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\nconst URL = 'https://silicon-jungle.herokuapp.com/shelves'\n// const URL = 'http://localhost:3000'\n\nfetch(URL).then((response) => {\n  return response.json()\n}).then((data) => {\n  const $ = (id) => document.getElementById(id)\n  const directoryContainer = $('directory-container')\n  directoryContainer.innerHTML = data.map(route => `<a href=\"${route}\">${route}</a>`).join('')\n}).catch(() => {\n})\n\n\n//# sourceURL=webpack://game-server/./src/directory.mjs?");

/***/ })

}]);