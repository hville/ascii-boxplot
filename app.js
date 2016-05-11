/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use-strict'
	var view = __webpack_require__(1),
			Vdom = __webpack_require__(7),
			Calc = __webpack_require__(9)
	
	var calc = Calc()
	
	function render() {
		var data = calc.next()
		var vdom = Vdom(data.value)
		window.requestAnimationFrame(function(ms) {
			view(vdom)
			if (!data.done) render()
		})
	}
	
	render()


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var snabbdom = __webpack_require__(2),
			props = __webpack_require__(6)
	
	var	patch = snabbdom.init([ // Init patch function with choosen modules
		props // for setting properties on DOM elements
	])
	
	var oldNode = document.body //document.getElementById('container')
	
	module.exports = function view(vdom) {
		patch(oldNode, vdom)
		oldNode = vdom
	}


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	// jshint newcap: false
	/* global require, module, document, Node */
	'use strict';
	
	var VNode = __webpack_require__(3);
	var is = __webpack_require__(4);
	var domApi = __webpack_require__(5);
	
	function isUndef(s) { return s === undefined; }
	function isDef(s) { return s !== undefined; }
	
	var emptyNode = VNode('', {}, [], undefined, undefined);
	
	function sameVnode(vnode1, vnode2) {
	  return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel;
	}
	
	function createKeyToOldIdx(children, beginIdx, endIdx) {
	  var i, map = {}, key;
	  for (i = beginIdx; i <= endIdx; ++i) {
	    key = children[i].key;
	    if (isDef(key)) map[key] = i;
	  }
	  return map;
	}
	
	var hooks = ['create', 'update', 'remove', 'destroy', 'pre', 'post'];
	
	function init(modules, api) {
	  var i, j, cbs = {};
	
	  if (isUndef(api)) api = domApi;
	
	  for (i = 0; i < hooks.length; ++i) {
	    cbs[hooks[i]] = [];
	    for (j = 0; j < modules.length; ++j) {
	      if (modules[j][hooks[i]] !== undefined) cbs[hooks[i]].push(modules[j][hooks[i]]);
	    }
	  }
	
	  function emptyNodeAt(elm) {
	    return VNode(api.tagName(elm).toLowerCase(), {}, [], undefined, elm);
	  }
	
	  function createRmCb(childElm, listeners) {
	    return function() {
	      if (--listeners === 0) {
	        var parent = api.parentNode(childElm);
	        api.removeChild(parent, childElm);
	      }
	    };
	  }
	
	  function createElm(vnode, insertedVnodeQueue) {
	    var i, thunk, data = vnode.data;
	    if (isDef(data)) {
	      if (isDef(i = data.hook) && isDef(i = i.init)) i(vnode);
	      if (isDef(i = data.vnode)) {
	          thunk = vnode;
	          vnode = i;
	      }
	    }
	    var elm, children = vnode.children, sel = vnode.sel;
	    if (isDef(sel)) {
	      // Parse selector
	      var hashIdx = sel.indexOf('#');
	      var dotIdx = sel.indexOf('.', hashIdx);
	      var hash = hashIdx > 0 ? hashIdx : sel.length;
	      var dot = dotIdx > 0 ? dotIdx : sel.length;
	      var tag = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel;
	      elm = vnode.elm = isDef(data) && isDef(i = data.ns) ? api.createElementNS(i, tag)
	                                                          : api.createElement(tag);
	      if (hash < dot) elm.id = sel.slice(hash + 1, dot);
	      if (dotIdx > 0) elm.className = sel.slice(dot+1).replace(/\./g, ' ');
	      if (is.array(children)) {
	        for (i = 0; i < children.length; ++i) {
	          api.appendChild(elm, createElm(children[i], insertedVnodeQueue));
	        }
	      } else if (is.primitive(vnode.text)) {
	        api.appendChild(elm, api.createTextNode(vnode.text));
	      }
	      for (i = 0; i < cbs.create.length; ++i) cbs.create[i](emptyNode, vnode);
	      i = vnode.data.hook; // Reuse variable
	      if (isDef(i)) {
	        if (i.create) i.create(emptyNode, vnode);
	        if (i.insert) insertedVnodeQueue.push(vnode);
	      }
	    } else {
	      elm = vnode.elm = api.createTextNode(vnode.text);
	    }
	    if (isDef(thunk)) thunk.elm = vnode.elm;
	    return vnode.elm;
	  }
	
	  function addVnodes(parentElm, before, vnodes, startIdx, endIdx, insertedVnodeQueue) {
	    for (; startIdx <= endIdx; ++startIdx) {
	      api.insertBefore(parentElm, createElm(vnodes[startIdx], insertedVnodeQueue), before);
	    }
	  }
	
	  function invokeDestroyHook(vnode) {
	    var i, j, data = vnode.data;
	    if (isDef(data)) {
	      if (isDef(i = data.hook) && isDef(i = i.destroy)) i(vnode);
	      for (i = 0; i < cbs.destroy.length; ++i) cbs.destroy[i](vnode);
	      if (isDef(i = vnode.children)) {
	        for (j = 0; j < vnode.children.length; ++j) {
	          invokeDestroyHook(vnode.children[j]);
	        }
	      }
	      if (isDef(i = data.vnode)) invokeDestroyHook(i);
	    }
	  }
	
	  function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
	    for (; startIdx <= endIdx; ++startIdx) {
	      var i, listeners, rm, ch = vnodes[startIdx];
	      if (isDef(ch)) {
	        if (isDef(ch.sel)) {
	          invokeDestroyHook(ch);
	          listeners = cbs.remove.length + 1;
	          rm = createRmCb(ch.elm, listeners);
	          for (i = 0; i < cbs.remove.length; ++i) cbs.remove[i](ch, rm);
	          if (isDef(i = ch.data) && isDef(i = i.hook) && isDef(i = i.remove)) {
	            i(ch, rm);
	          } else {
	            rm();
	          }
	        } else { // Text node
	          api.removeChild(parentElm, ch.elm);
	        }
	      }
	    }
	  }
	
	  function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue) {
	    var oldStartIdx = 0, newStartIdx = 0;
	    var oldEndIdx = oldCh.length - 1;
	    var oldStartVnode = oldCh[0];
	    var oldEndVnode = oldCh[oldEndIdx];
	    var newEndIdx = newCh.length - 1;
	    var newStartVnode = newCh[0];
	    var newEndVnode = newCh[newEndIdx];
	    var oldKeyToIdx, idxInOld, elmToMove, before;
	
	    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
	      if (isUndef(oldStartVnode)) {
	        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
	      } else if (isUndef(oldEndVnode)) {
	        oldEndVnode = oldCh[--oldEndIdx];
	      } else if (sameVnode(oldStartVnode, newStartVnode)) {
	        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
	        oldStartVnode = oldCh[++oldStartIdx];
	        newStartVnode = newCh[++newStartIdx];
	      } else if (sameVnode(oldEndVnode, newEndVnode)) {
	        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
	        oldEndVnode = oldCh[--oldEndIdx];
	        newEndVnode = newCh[--newEndIdx];
	      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
	        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
	        api.insertBefore(parentElm, oldStartVnode.elm, api.nextSibling(oldEndVnode.elm));
	        oldStartVnode = oldCh[++oldStartIdx];
	        newEndVnode = newCh[--newEndIdx];
	      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
	        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
	        api.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
	        oldEndVnode = oldCh[--oldEndIdx];
	        newStartVnode = newCh[++newStartIdx];
	      } else {
	        if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
	        idxInOld = oldKeyToIdx[newStartVnode.key];
	        if (isUndef(idxInOld)) { // New element
	          api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
	          newStartVnode = newCh[++newStartIdx];
	        } else {
	          elmToMove = oldCh[idxInOld];
	          patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
	          oldCh[idxInOld] = undefined;
	          api.insertBefore(parentElm, elmToMove.elm, oldStartVnode.elm);
	          newStartVnode = newCh[++newStartIdx];
	        }
	      }
	    }
	    if (oldStartIdx > oldEndIdx) {
	      before = isUndef(newCh[newEndIdx+1]) ? null : newCh[newEndIdx+1].elm;
	      addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
	    } else if (newStartIdx > newEndIdx) {
	      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
	    }
	  }
	
	  function patchVnode(oldVnode, vnode, insertedVnodeQueue) {
	    var i, hook;
	    if (isDef(i = vnode.data) && isDef(hook = i.hook) && isDef(i = hook.prepatch)) {
	      i(oldVnode, vnode);
	    }
	    if (isDef(i = oldVnode.data) && isDef(i = i.vnode)) oldVnode = i;
	    if (isDef(i = vnode.data) && isDef(i = i.vnode)) {
	      patchVnode(oldVnode, i, insertedVnodeQueue);
	      vnode.elm = i.elm;
	      return;
	    }
	    var elm = vnode.elm = oldVnode.elm, oldCh = oldVnode.children, ch = vnode.children;
	    if (oldVnode === vnode) return;
	    if (!sameVnode(oldVnode, vnode)) {
	      var parentElm = api.parentNode(oldVnode.elm);
	      elm = createElm(vnode, insertedVnodeQueue);
	      api.insertBefore(parentElm, elm, oldVnode.elm);
	      removeVnodes(parentElm, [oldVnode], 0, 0);
	      return;
	    }
	    if (isDef(vnode.data)) {
	      for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode);
	      i = vnode.data.hook;
	      if (isDef(i) && isDef(i = i.update)) i(oldVnode, vnode);
	    }
	    if (isUndef(vnode.text)) {
	      if (isDef(oldCh) && isDef(ch)) {
	        if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue);
	      } else if (isDef(ch)) {
	        if (isDef(oldVnode.text)) api.setTextContent(elm, '');
	        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
	      } else if (isDef(oldCh)) {
	        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
	      } else if (isDef(oldVnode.text)) {
	        api.setTextContent(elm, '');
	      }
	    } else if (oldVnode.text !== vnode.text) {
	      api.setTextContent(elm, vnode.text);
	    }
	    if (isDef(hook) && isDef(i = hook.postpatch)) {
	      i(oldVnode, vnode);
	    }
	  }
	
	  return function(oldVnode, vnode) {
	    var i, elm, parent;
	    var insertedVnodeQueue = [];
	    for (i = 0; i < cbs.pre.length; ++i) cbs.pre[i]();
	
	    if (isUndef(oldVnode.sel)) {
	      oldVnode = emptyNodeAt(oldVnode);
	    }
	
	    if (sameVnode(oldVnode, vnode)) {
	      patchVnode(oldVnode, vnode, insertedVnodeQueue);
	    } else {
	      elm = oldVnode.elm;
	      parent = api.parentNode(elm);
	
	      createElm(vnode, insertedVnodeQueue);
	
	      if (parent !== null) {
	        api.insertBefore(parent, vnode.elm, api.nextSibling(elm));
	        removeVnodes(parent, [oldVnode], 0, 0);
	      }
	    }
	
	    for (i = 0; i < insertedVnodeQueue.length; ++i) {
	      insertedVnodeQueue[i].data.hook.insert(insertedVnodeQueue[i]);
	    }
	    for (i = 0; i < cbs.post.length; ++i) cbs.post[i]();
	    return vnode;
	  };
	}
	
	module.exports = {init: init};


/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = function(sel, data, children, text, elm) {
	  var key = data === undefined ? undefined : data.key;
	  return {sel: sel, data: data, children: children,
	          text: text, elm: elm, key: key};
	};


/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = {
	  array: Array.isArray,
	  primitive: function(s) { return typeof s === 'string' || typeof s === 'number'; },
	};


/***/ },
/* 5 */
/***/ function(module, exports) {

	function createElement(tagName){
	  return document.createElement(tagName);
	}
	
	function createElementNS(namespaceURI, qualifiedName){
	  return document.createElementNS(namespaceURI, qualifiedName);
	}
	
	function createTextNode(text){
	  return document.createTextNode(text);
	}
	
	
	function insertBefore(parentNode, newNode, referenceNode){
	  parentNode.insertBefore(newNode, referenceNode);
	}
	
	
	function removeChild(node, child){
	  node.removeChild(child);
	}
	
	function appendChild(node, child){
	  node.appendChild(child);
	}
	
	function parentNode(node){
	  return node.parentElement;
	}
	
	function nextSibling(node){
	  return node.nextSibling;
	}
	
	function tagName(node){
	  return node.tagName;
	}
	
	function setTextContent(node, text){
	  node.textContent = text;
	}
	
	module.exports = {
	  createElement: createElement,
	  createElementNS: createElementNS,
	  createTextNode: createTextNode,
	  appendChild: appendChild,
	  removeChild: removeChild,
	  insertBefore: insertBefore,
	  parentNode: parentNode,
	  nextSibling: nextSibling,
	  tagName: tagName,
	  setTextContent: setTextContent
	};


/***/ },
/* 6 */
/***/ function(module, exports) {

	function updateProps(oldVnode, vnode) {
	  var key, cur, old, elm = vnode.elm,
	      oldProps = oldVnode.data.props || {}, props = vnode.data.props || {};
	  for (key in oldProps) {
	    if (!props[key]) {
	      delete elm[key];
	    }
	  }
	  for (key in props) {
	    cur = props[key];
	    old = oldProps[key];
	    if (old !== cur && (key !== 'value' || elm[key] !== cur)) {
	      elm[key] = cur;
	    }
	  }
	}
	
	module.exports = {create: updateProps, update: updateProps};


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use-strict'
	var h = __webpack_require__(8)
	
	function dPath() {
		return Array.prototype.join.call(arguments,' ')
	}
	
	module.exports = function(data) {
	/*	var itm = {
			// POSITION
			px: +0, // %R
			py: +0,	// %R
			pa: +0, // rad
			// VELOCITY
			tv: +2, // R/T
			// DIRECTION
			ca: -2, // R/T**2
			cc: +2, // R/T**3
			// Branching
			nb: 1, // branching / T
			// CALCULATED
			ta: -2, // R/T**2, = -v/T
			dt: 0,
			cω: 0
		}*/
	
		//m('g', {key:'mRels'}, mArr)
		return h('svg', {props: {viewBox: vb.all}}, [
			h('g', {key: 0}, [
				h('path', {props: {
					d: ['M', 0, 0, 'C', data.px, data.py, data.px, data.py, data.px, data.py].join(' ')
				}})
			])
		])
	}


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var VNode = __webpack_require__(3);
	var is = __webpack_require__(4);
	
	function addNS(data, children) {
	  data.ns = 'http://www.w3.org/2000/svg';
	  if (children !== undefined) {
	    for (var i = 0; i < children.length; ++i) {
	      addNS(children[i].data, children[i].children);
	    }
	  }
	}
	
	module.exports = function h(sel, b, c) {
	  var data = {}, children, text, i;
	  if (arguments.length === 3) {
	    data = b;
	    if (is.array(c)) { children = c; }
	    else if (is.primitive(c)) { text = c; }
	  } else if (arguments.length === 2) {
	    if (is.array(b)) { children = b; }
	    else if (is.primitive(b)) { text = b; }
	    else { data = b; }
	  }
	  if (is.array(children)) {
	    for (i = 0; i < children.length; ++i) {
	      if (is.primitive(children[i])) children[i] = VNode(undefined, undefined, undefined, children[i]);
	    }
	  }
	  if (sel[0] === 's' && sel[1] === 'v' && sel[2] === 'g') {
	    addNS(data, children);
	  }
	  return VNode(sel, data, children, text, undefined);
	};


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var assign = __webpack_require__(10)
	
	function step(itm, opt) {
		if (itm.tv < 0) return itm
		//itm.cω = itm.ca / itms.tv // 1/T
		//itm.dt = opt.fdraw * opt.fcalc / itm.cω
		var dt = itm.tv / (itm.ca * opt.fdraw * opt.fcalc)
	
		itm.px += itm.tv * Math.cos(itm.pa) * dt
		itm.py += itm.tv * Math.sin(itm.pa) * dt
		itm.pa += itm.ca / itm.tv * dt
		itm.ca += itm.cc * dt
		itm.tv += itm.ta * dt
	
		return itm
	}
	
	module.exports = function(items, options) {
		// a pair of lines with each tip an attractor to the other
		var itm = {
			// POSITION
			px: +0, // %R
			py: +0,	// %R
			pa: +0, // rad
			// VELOCITY
			tv: +2, // R/T
			// DIRECTION
			ca: -2, // R/T**2
			cc: +2, // R/T**3
			// Branching
			nb: 1, // branching / T
			// CALCULATED
			ta: -2, // R/T**2, = -v/T
			dt: 0,
			cω: 0
		}
	
		var opt = assign({
			T: 1,
			R: 1,
			thick: 0.05, // uLength/uSpeed = uTime
			fdraw: 6, // elements/rotation
			fcalc: 5 // samples/elements = samples/(uRotVel*uTime) =
		}, options)
	
		return {next: function next() {
			if (itm.tv < 0) return {done: true, value: itm}
			for (var i=0; i<opt.fcalc; ++i) itm = step(itm, opt)
			return itm.tv < 0 ? {done: true, value: itm} : {value: itm}
		}}
	}


/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';
	/* eslint-disable no-unused-vars */
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;
	
	function toObject(val) {
		if (val === null || val === undefined) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}
	
		return Object(val);
	}
	
	function shouldUseNative() {
		try {
			if (!Object.assign) {
				return false;
			}
	
			// Detect buggy property enumeration order in older V8 versions.
	
			// https://bugs.chromium.org/p/v8/issues/detail?id=4118
			var test1 = new String('abc');  // eslint-disable-line
			test1[5] = 'de';
			if (Object.getOwnPropertyNames(test1)[0] === '5') {
				return false;
			}
	
			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test2 = {};
			for (var i = 0; i < 10; i++) {
				test2['_' + String.fromCharCode(i)] = i;
			}
			var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
				return test2[n];
			});
			if (order2.join('') !== '0123456789') {
				return false;
			}
	
			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test3 = {};
			'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
				test3[letter] = letter;
			});
			if (Object.keys(Object.assign({}, test3)).join('') !==
					'abcdefghijklmnopqrst') {
				return false;
			}
	
			return true;
		} catch (e) {
			// We don't expect any of the above to throw, but better to be safe.
			return false;
		}
	}
	
	module.exports = shouldUseNative() ? Object.assign : function (target, source) {
		var from;
		var to = toObject(target);
		var symbols;
	
		for (var s = 1; s < arguments.length; s++) {
			from = Object(arguments[s]);
	
			for (var key in from) {
				if (hasOwnProperty.call(from, key)) {
					to[key] = from[key];
				}
			}
	
			if (Object.getOwnPropertySymbols) {
				symbols = Object.getOwnPropertySymbols(from);
				for (var i = 0; i < symbols.length; i++) {
					if (propIsEnumerable.call(from, symbols[i])) {
						to[symbols[i]] = from[symbols[i]];
					}
				}
			}
		}
	
		return to;
	};


/***/ }
/******/ ]);
//# sourceMappingURL=app.js.map