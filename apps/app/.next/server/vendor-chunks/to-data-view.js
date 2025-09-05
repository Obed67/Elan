"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/to-data-view";
exports.ids = ["vendor-chunks/to-data-view"];
exports.modules = {

/***/ "(rsc)/../../node_modules/to-data-view/index.js":
/*!************************************************!*\
  !*** ../../node_modules/to-data-view/index.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ toDataView)\n/* harmony export */ });\nfunction toDataView (data) {\n  if (data instanceof Int8Array || data instanceof Uint8Array || data instanceof Uint8ClampedArray) {\n    return new DataView(data.buffer, data.byteOffset, data.byteLength)\n  }\n\n  if (data instanceof ArrayBuffer) {\n    return new DataView(data)\n  }\n\n  throw new TypeError('Expected `data` to be an ArrayBuffer, Buffer, Int8Array, Uint8Array or Uint8ClampedArray')\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi4vLi4vbm9kZV9tb2R1bGVzL3RvLWRhdGEtdmlldy9pbmRleC5qcyIsIm1hcHBpbmdzIjoiOzs7O0FBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9AZWxhbi9hcHAvLi4vLi4vbm9kZV9tb2R1bGVzL3RvLWRhdGEtdmlldy9pbmRleC5qcz8wYjI1Il0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHRvRGF0YVZpZXcgKGRhdGEpIHtcbiAgaWYgKGRhdGEgaW5zdGFuY2VvZiBJbnQ4QXJyYXkgfHwgZGF0YSBpbnN0YW5jZW9mIFVpbnQ4QXJyYXkgfHwgZGF0YSBpbnN0YW5jZW9mIFVpbnQ4Q2xhbXBlZEFycmF5KSB7XG4gICAgcmV0dXJuIG5ldyBEYXRhVmlldyhkYXRhLmJ1ZmZlciwgZGF0YS5ieXRlT2Zmc2V0LCBkYXRhLmJ5dGVMZW5ndGgpXG4gIH1cblxuICBpZiAoZGF0YSBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB7XG4gICAgcmV0dXJuIG5ldyBEYXRhVmlldyhkYXRhKVxuICB9XG5cbiAgdGhyb3cgbmV3IFR5cGVFcnJvcignRXhwZWN0ZWQgYGRhdGFgIHRvIGJlIGFuIEFycmF5QnVmZmVyLCBCdWZmZXIsIEludDhBcnJheSwgVWludDhBcnJheSBvciBVaW50OENsYW1wZWRBcnJheScpXG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/../../node_modules/to-data-view/index.js\n");

/***/ })

};
;