"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/cli-cursor";
exports.ids = ["vendor-chunks/cli-cursor"];
exports.modules = {

/***/ "(rsc)/../../node_modules/cli-cursor/index.js":
/*!**********************************************!*\
  !*** ../../node_modules/cli-cursor/index.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var node_process__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! node:process */ \"node:process\");\n/* harmony import */ var restore_cursor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! restore-cursor */ \"(rsc)/../../node_modules/restore-cursor/index.js\");\n\n\n\nlet isHidden = false;\n\nconst cliCursor = {};\n\ncliCursor.show = (writableStream = node_process__WEBPACK_IMPORTED_MODULE_0__.stderr) => {\n\tif (!writableStream.isTTY) {\n\t\treturn;\n\t}\n\n\tisHidden = false;\n\twritableStream.write('\\u001B[?25h');\n};\n\ncliCursor.hide = (writableStream = node_process__WEBPACK_IMPORTED_MODULE_0__.stderr) => {\n\tif (!writableStream.isTTY) {\n\t\treturn;\n\t}\n\n\t(0,restore_cursor__WEBPACK_IMPORTED_MODULE_1__[\"default\"])();\n\tisHidden = true;\n\twritableStream.write('\\u001B[?25l');\n};\n\ncliCursor.toggle = (force, writableStream) => {\n\tif (force !== undefined) {\n\t\tisHidden = force;\n\t}\n\n\tif (isHidden) {\n\t\tcliCursor.show(writableStream);\n\t} else {\n\t\tcliCursor.hide(writableStream);\n\t}\n};\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (cliCursor);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi4vLi4vbm9kZV9tb2R1bGVzL2NsaS1jdXJzb3IvaW5kZXguanMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQW1DO0FBQ1E7O0FBRTNDOztBQUVBOztBQUVBLG1DQUFtQyxnREFBYztBQUNqRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLG1DQUFtQyxnREFBYztBQUNqRDtBQUNBO0FBQ0E7O0FBRUEsQ0FBQywwREFBYTtBQUNkO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQSxpRUFBZSxTQUFTLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9AZWxhbi9hcHAvLi4vLi4vbm9kZV9tb2R1bGVzL2NsaS1jdXJzb3IvaW5kZXguanM/YmFkNSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcHJvY2VzcyBmcm9tICdub2RlOnByb2Nlc3MnO1xuaW1wb3J0IHJlc3RvcmVDdXJzb3IgZnJvbSAncmVzdG9yZS1jdXJzb3InO1xuXG5sZXQgaXNIaWRkZW4gPSBmYWxzZTtcblxuY29uc3QgY2xpQ3Vyc29yID0ge307XG5cbmNsaUN1cnNvci5zaG93ID0gKHdyaXRhYmxlU3RyZWFtID0gcHJvY2Vzcy5zdGRlcnIpID0+IHtcblx0aWYgKCF3cml0YWJsZVN0cmVhbS5pc1RUWSkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGlzSGlkZGVuID0gZmFsc2U7XG5cdHdyaXRhYmxlU3RyZWFtLndyaXRlKCdcXHUwMDFCWz8yNWgnKTtcbn07XG5cbmNsaUN1cnNvci5oaWRlID0gKHdyaXRhYmxlU3RyZWFtID0gcHJvY2Vzcy5zdGRlcnIpID0+IHtcblx0aWYgKCF3cml0YWJsZVN0cmVhbS5pc1RUWSkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdHJlc3RvcmVDdXJzb3IoKTtcblx0aXNIaWRkZW4gPSB0cnVlO1xuXHR3cml0YWJsZVN0cmVhbS53cml0ZSgnXFx1MDAxQls/MjVsJyk7XG59O1xuXG5jbGlDdXJzb3IudG9nZ2xlID0gKGZvcmNlLCB3cml0YWJsZVN0cmVhbSkgPT4ge1xuXHRpZiAoZm9yY2UgIT09IHVuZGVmaW5lZCkge1xuXHRcdGlzSGlkZGVuID0gZm9yY2U7XG5cdH1cblxuXHRpZiAoaXNIaWRkZW4pIHtcblx0XHRjbGlDdXJzb3Iuc2hvdyh3cml0YWJsZVN0cmVhbSk7XG5cdH0gZWxzZSB7XG5cdFx0Y2xpQ3Vyc29yLmhpZGUod3JpdGFibGVTdHJlYW0pO1xuXHR9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGlDdXJzb3I7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/../../node_modules/cli-cursor/index.js\n");

/***/ })

};
;