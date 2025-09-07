"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/is-unicode-supported";
exports.ids = ["vendor-chunks/is-unicode-supported"];
exports.modules = {

/***/ "(rsc)/../../node_modules/is-unicode-supported/index.js":
/*!********************************************************!*\
  !*** ../../node_modules/is-unicode-supported/index.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ isUnicodeSupported)\n/* harmony export */ });\n/* harmony import */ var node_process__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! node:process */ \"node:process\");\n\n\nfunction isUnicodeSupported() {\n\tconst {env} = node_process__WEBPACK_IMPORTED_MODULE_0__;\n\tconst {TERM, TERM_PROGRAM} = env;\n\n\tif (node_process__WEBPACK_IMPORTED_MODULE_0__.platform !== 'win32') {\n\t\treturn TERM !== 'linux'; // Linux console (kernel)\n\t}\n\n\treturn Boolean(env.WT_SESSION) // Windows Terminal\n\t\t|| Boolean(env.TERMINUS_SUBLIME) // Terminus (<0.2.27)\n\t\t|| env.ConEmuTask === '{cmd::Cmder}' // ConEmu and cmder\n\t\t|| TERM_PROGRAM === 'Terminus-Sublime'\n\t\t|| TERM_PROGRAM === 'vscode'\n\t\t|| TERM === 'xterm-256color'\n\t\t|| TERM === 'alacritty'\n\t\t|| TERM === 'rxvt-unicode'\n\t\t|| TERM === 'rxvt-unicode-256color'\n\t\t|| env.TERMINAL_EMULATOR === 'JetBrains-JediTerm';\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi4vLi4vbm9kZV9tb2R1bGVzL2lzLXVuaWNvZGUtc3VwcG9ydGVkL2luZGV4LmpzIiwibWFwcGluZ3MiOiI7Ozs7O0FBQW1DOztBQUVwQjtBQUNmLFFBQVEsS0FBSyxFQUFFLHlDQUFPO0FBQ3RCLFFBQVEsb0JBQW9COztBQUU1QixLQUFLLGtEQUFnQjtBQUNyQiwyQkFBMkI7QUFDM0I7O0FBRUE7QUFDQTtBQUNBLDBCQUEwQixXQUFXO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9AZWxhbi9hcHAvLi4vLi4vbm9kZV9tb2R1bGVzL2lzLXVuaWNvZGUtc3VwcG9ydGVkL2luZGV4LmpzPzViZGMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHByb2Nlc3MgZnJvbSAnbm9kZTpwcm9jZXNzJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaXNVbmljb2RlU3VwcG9ydGVkKCkge1xuXHRjb25zdCB7ZW52fSA9IHByb2Nlc3M7XG5cdGNvbnN0IHtURVJNLCBURVJNX1BST0dSQU19ID0gZW52O1xuXG5cdGlmIChwcm9jZXNzLnBsYXRmb3JtICE9PSAnd2luMzInKSB7XG5cdFx0cmV0dXJuIFRFUk0gIT09ICdsaW51eCc7IC8vIExpbnV4IGNvbnNvbGUgKGtlcm5lbClcblx0fVxuXG5cdHJldHVybiBCb29sZWFuKGVudi5XVF9TRVNTSU9OKSAvLyBXaW5kb3dzIFRlcm1pbmFsXG5cdFx0fHwgQm9vbGVhbihlbnYuVEVSTUlOVVNfU1VCTElNRSkgLy8gVGVybWludXMgKDwwLjIuMjcpXG5cdFx0fHwgZW52LkNvbkVtdVRhc2sgPT09ICd7Y21kOjpDbWRlcn0nIC8vIENvbkVtdSBhbmQgY21kZXJcblx0XHR8fCBURVJNX1BST0dSQU0gPT09ICdUZXJtaW51cy1TdWJsaW1lJ1xuXHRcdHx8IFRFUk1fUFJPR1JBTSA9PT0gJ3ZzY29kZSdcblx0XHR8fCBURVJNID09PSAneHRlcm0tMjU2Y29sb3InXG5cdFx0fHwgVEVSTSA9PT0gJ2FsYWNyaXR0eSdcblx0XHR8fCBURVJNID09PSAncnh2dC11bmljb2RlJ1xuXHRcdHx8IFRFUk0gPT09ICdyeHZ0LXVuaWNvZGUtMjU2Y29sb3InXG5cdFx0fHwgZW52LlRFUk1JTkFMX0VNVUxBVE9SID09PSAnSmV0QnJhaW5zLUplZGlUZXJtJztcbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/../../node_modules/is-unicode-supported/index.js\n");

/***/ })

};
;