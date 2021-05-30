exports.id = "main";
exports.modules = {

/***/ "./src/server/server.js":
/*!******************************!*\
  !*** ./src/server/server.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _build_contracts_FlightSuretyApp_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../build/contracts/FlightSuretyApp.json */ \"./build/contracts/FlightSuretyApp.json\");\nvar _build_contracts_FlightSuretyApp_json__WEBPACK_IMPORTED_MODULE_0___namespace = /*#__PURE__*/__webpack_require__.t(/*! ../../build/contracts/FlightSuretyApp.json */ \"./build/contracts/FlightSuretyApp.json\", 1);\n/* harmony import */ var _config_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./config.json */ \"./src/server/config.json\");\nvar _config_json__WEBPACK_IMPORTED_MODULE_1___namespace = /*#__PURE__*/__webpack_require__.t(/*! ./config.json */ \"./src/server/config.json\", 1);\n/* harmony import */ var web3__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! web3 */ \"web3\");\n/* harmony import */ var web3__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(web3__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! express */ \"express\");\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_3__);\n\n\n\n\nlet config = _config_json__WEBPACK_IMPORTED_MODULE_1__['localhost'];\nlet web3 = new web3__WEBPACK_IMPORTED_MODULE_2___default.a(new web3__WEBPACK_IMPORTED_MODULE_2___default.a.providers.WebsocketProvider(config.url.replace('http', 'ws')));\nweb3.eth.defaultAccount = web3.eth.accounts[0];\nlet flightSuretyApp = new web3.eth.Contract(_build_contracts_FlightSuretyApp_json__WEBPACK_IMPORTED_MODULE_0__.abi, config.appAddress);\nflightSuretyApp.events.OracleRequest({\n  fromBlock: 0\n}, function (error, event) {\n  if (error) console.log(error);\n  console.log(event);\n});\nconst app = express__WEBPACK_IMPORTED_MODULE_3___default()();\napp.get('/api', (req, res) => {\n  res.send({\n    message: 'An API for use with your Dapp!'\n  });\n});\napp.get('/listFlights', (req, res) => {\n  var currentdate = new Date();\n  var datetime = \"Last Sync: \" + currentdate.getDate() + \"/\" + (currentdate.getMonth() + 1) + \"/\" + currentdate.getFullYear() + \" @ \" + currentdate.getHours() + \":\" + currentdate.getMinutes() + \":\" + currentdate.getSeconds();\n  res.send({\n    \"flights\": [{\n      \"code\": \"FLT-0001\",\n      \"airline\": \"ARL0001\"\n    }, {\n      \"code\": \"FLT-0002\",\n      \"airline\": \"ARL0002\"\n    }],\n    \"date\": dateTime\n  });\n});\n/* harmony default export */ __webpack_exports__[\"default\"] = (app);\n\n//# sourceURL=webpack:///./src/server/server.js?");

/***/ })

};