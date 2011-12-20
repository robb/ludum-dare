//     Zepto.js
//     (c) 2010, 2011 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

(function(undefined){
  if (String.prototype.trim === undefined) // fix for iOS 3.2
    String.prototype.trim = function(){ return this.replace(/^\s+/, '').replace(/\s+$/, '') };

  // For iOS 3.x
  // from https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/reduce
  if (Array.prototype.reduce === undefined)
    Array.prototype.reduce = function(fun){
      if(this === void 0 || this === null) throw new TypeError();
      var t = Object(this), len = t.length >>> 0, k = 0, accumulator;
      if(typeof fun != 'function') throw new TypeError();
      if(len == 0 && arguments.length == 1) throw new TypeError();

      if(arguments.length >= 2)
       accumulator = arguments[1];
      else
        do{
          if(k in t){
            accumulator = t[k++];
            break;
          }
          if(++k >= len) throw new TypeError();
        } while (true);

      while (k < len){
        if(k in t) accumulator = fun.call(undefined, accumulator, t[k], k, t);
        k++;
      }
      return accumulator;
    };

})();
//     Zepto.js
//     (c) 2010, 2011 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

var Zepto = (function() {
  var undefined, key, $$, classList, emptyArray = [], slice = emptyArray.slice,
    document = window.document,
    elementDisplay = {}, classCache = {},
    getComputedStyle = document.defaultView.getComputedStyle,
    cssNumber = { 'column-count': 1, 'columns': 1, 'font-weight': 1, 'line-height': 1,'opacity': 1, 'z-index': 1, 'zoom': 1 },
    fragmentRE = /^\s*<(\w+)[^>]*>/,
    elementTypes = [1, 9, 11],
    adjacencyOperators = [ 'after', 'prepend', 'before', 'append' ],
    table = document.createElement('table'),
    tableRow = document.createElement('tr'),
    containers = {
      'tr': document.createElement('tbody'),
      'tbody': table, 'thead': table, 'tfoot': table,
      'td': tableRow, 'th': tableRow,
      '*': document.createElement('div')
    },
    readyRE = /complete|loaded|interactive/,
    classSelectorRE = /^\.([\w-]+)$/,
    idSelectorRE = /^#([\w-]+)$/,
    tagSelectorRE = /^[\w-]+$/;

  function isF(value) { return ({}).toString.call(value) == "[object Function]" }
  function isO(value) { return value instanceof Object }
  function isA(value) { return value instanceof Array }
  function likeArray(obj) { return typeof obj.length == 'number' }

  function compact(array) { return array.filter(function(item){ return item !== undefined && item !== null }) }
  function flatten(array) { return array.length > 0 ? [].concat.apply([], array) : array }
  function camelize(str)  { return str.replace(/-+(.)?/g, function(match, chr){ return chr ? chr.toUpperCase() : '' }) }
  function dasherize(str){
    return str.replace(/::/g, '/')
           .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
           .replace(/([a-z\d])([A-Z])/g, '$1_$2')
           .replace(/_/g, '-')
           .toLowerCase();
  }
  function uniq(array)    { return array.filter(function(item,index,array){ return array.indexOf(item) == index }) }

  function classRE(name){
    return name in classCache ?
      classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'));
  }

  function maybeAddPx(name, value) { return (typeof value == "number" && !cssNumber[dasherize(name)]) ? value + "px" : value; }

  function defaultDisplay(nodeName) {
    var element, display;
    if (!elementDisplay[nodeName]) {
      element = document.createElement(nodeName);
      document.body.appendChild(element);
      display = getComputedStyle(element, '').getPropertyValue("display");
      element.parentNode.removeChild(element);
      display == "none" && (display = "block");
      elementDisplay[nodeName] = display;
    }
    return elementDisplay[nodeName];
  }

  function fragment(html, name) {
    if (name === undefined) fragmentRE.test(html) && RegExp.$1;
    if (!(name in containers)) name = '*';
    var container = containers[name];
    container.innerHTML = '' + html;
    return slice.call(container.childNodes);
  }

  function Z(dom, selector){
    dom = dom || emptyArray;
    dom.__proto__ = Z.prototype;
    dom.selector = selector || '';
    return dom;
  }

  function $(selector, context){
    if (!selector) return Z();
    if (context !== undefined) return $(context).find(selector);
    else if (isF(selector)) return $(document).ready(selector);
    else if (selector instanceof Z) return selector;
    else {
      var dom;
      if (isA(selector)) dom = compact(selector);
      else if (elementTypes.indexOf(selector.nodeType) >= 0 || selector === window)
        dom = [selector], selector = null;
      else if (fragmentRE.test(selector))
        dom = fragment(selector.trim(), RegExp.$1), selector = null;
      else if (selector.nodeType && selector.nodeType == 3) dom = [selector];
      else dom = $$(document, selector);
      return Z(dom, selector);
    }
  }

  $.extend = function(target){
    slice.call(arguments, 1).forEach(function(source) {
      for (key in source) target[key] = source[key];
    })
    return target;
  }

  $.qsa = $$ = function(element, selector){
    var found;
    return (element === document && idSelectorRE.test(selector)) ?
      ( (found = element.getElementById(RegExp.$1)) ? [found] : emptyArray ) :
      slice.call(
        classSelectorRE.test(selector) ? element.getElementsByClassName(RegExp.$1) :
        tagSelectorRE.test(selector) ? element.getElementsByTagName(selector) :
        element.querySelectorAll(selector)
      );
  }

  function filtered(nodes, selector){
    return selector === undefined ? $(nodes) : $(nodes).filter(selector);
  }

  function funcArg(context, arg, idx, payload){
   return isF(arg) ? arg.call(context, idx, payload) : arg;
  }

  $.isFunction = isF;
  $.isObject = isO;
  $.isArray = isA;

  $.map = function(elements, callback) {
    var value, values = [], i, key;
    if (likeArray(elements))
      for (i = 0; i < elements.length; i++) {
        value = callback(elements[i], i);
        if (value != null) values.push(value);
      }
    else
      for (key in elements) {
        value = callback(elements[key], key);
        if (value != null) values.push(value);
      }
    return flatten(values);
  }

  $.each = function(elements, callback) {
    var i, key;
    if (likeArray(elements))
      for(i = 0; i < elements.length; i++) {
        if(callback(i, elements[i]) === false) return elements;
      }
    else
      for(key in elements) {
        if(callback(key, elements[key]) === false) return elements;
      }
    return elements;
  }

  $.fn = {
    forEach: emptyArray.forEach,
    reduce: emptyArray.reduce,
    push: emptyArray.push,
    indexOf: emptyArray.indexOf,
    concat: emptyArray.concat,
    map: function(fn){
      return $.map(this, function(el, i){ return fn.call(el, i, el) });
    },
    slice: function(){
      return $(slice.apply(this, arguments));
    },
    ready: function(callback){
      if (readyRE.test(document.readyState)) callback($);
      else document.addEventListener('DOMContentLoaded', function(){ callback($) }, false);
      return this;
    },
    get: function(idx){ return idx === undefined ? this : this[idx] },
    size: function(){ return this.length },
    remove: function () {
      return this.each(function () {
        if (this.parentNode != null) {
          this.parentNode.removeChild(this);
        }
      });
    },
    each: function(callback){
      this.forEach(function(el, idx){ callback.call(el, idx, el) });
      return this;
    },
    filter: function(selector){
      return $([].filter.call(this, function(element){
        return element.parentNode && $$(element.parentNode, selector).indexOf(element) >= 0;
      }));
    },
    end: function(){
      return this.prevObject || $();
    },
    andSelf:function(){
      return this.add(this.prevObject || $())
    },
    add:function(selector,context){
      return $(uniq(this.concat($(selector,context))));
    },
    is: function(selector){
      return this.length > 0 && $(this[0]).filter(selector).length > 0;
    },
    not: function(selector){
      var nodes=[];
      if (isF(selector) && selector.call !== undefined)
        this.each(function(idx){
          if (!selector.call(this,idx)) nodes.push(this);
        });
      else {
        var excludes = typeof selector == 'string' ? this.filter(selector) :
          (likeArray(selector) && isF(selector.item)) ? slice.call(selector) : $(selector);
        this.forEach(function(el){
          if (excludes.indexOf(el) < 0) nodes.push(el);
        });
      }
      return $(nodes);
    },
    eq: function(idx){
      return idx === -1 ? this.slice(idx) : this.slice(idx, + idx + 1);
    },
    first: function(){ var el = this[0]; return el && !isO(el) ? el : $(el) },
    last: function(){ var el = this[this.length - 1]; return el && !isO(el) ? el : $(el) },
    find: function(selector){
      var result;
      if (this.length == 1) result = $$(this[0], selector);
      else result = this.map(function(){ return $$(this, selector) });
      return $(result);
    },
    closest: function(selector, context){
      var node = this[0], candidates = $$(context || document, selector);
      if (!candidates.length) node = null;
      while (node && candidates.indexOf(node) < 0)
        node = node !== context && node !== document && node.parentNode;
      return $(node);
    },
    parents: function(selector){
      var ancestors = [], nodes = this;
      while (nodes.length > 0)
        nodes = $.map(nodes, function(node){
          if ((node = node.parentNode) && node !== document && ancestors.indexOf(node) < 0) {
            ancestors.push(node);
            return node;
          }
        });
      return filtered(ancestors, selector);
    },
    parent: function(selector){
      return filtered(uniq(this.pluck('parentNode')), selector);
    },
    children: function(selector){
      return filtered(this.map(function(){ return slice.call(this.children) }), selector);
    },
    siblings: function(selector){
      return filtered(this.map(function(i, el){
        return slice.call(el.parentNode.children).filter(function(child){ return child!==el });
      }), selector);
    },
    empty: function(){ return this.each(function(){ this.innerHTML = '' }) },
    pluck: function(property){ return this.map(function(){ return this[property] }) },
    show: function(){
      return this.each(function() {
        this.style.display == "none" && (this.style.display = null);
        if (getComputedStyle(this, '').getPropertyValue("display") == "none") {
          this.style.display = defaultDisplay(this.nodeName)
        }
      })
    },
    replaceWith: function(newContent) {
      return this.each(function() {
        $(this).before(newContent).remove();
      });
    },
    wrap: function(newContent) {
      return this.each(function() {
        $(this).wrapAll($(newContent)[0].cloneNode(false));
      });
    },
    wrapAll: function(newContent) {
      if (this[0]) {
        $(this[0]).before(newContent = $(newContent));
        newContent.append(this);
      }
      return this;
    },
    unwrap: function(){
      this.parent().each(function(){
        $(this).replaceWith($(this).children());
      });
      return this;
    },
    hide: function(){
      return this.css("display", "none")
    },
    toggle: function(setting){
      return (setting === undefined ? this.css("display") == "none" : setting) ? this.show() : this.hide();
    },
    prev: function(){ return $(this.pluck('previousElementSibling')) },
    next: function(){ return $(this.pluck('nextElementSibling')) },
    html: function(html){
      return html === undefined ?
        (this.length > 0 ? this[0].innerHTML : null) :
        this.each(function (idx) {
          var originHtml = this.innerHTML;
          $(this).empty().append( funcArg(this, html, idx, originHtml) );
        });
    },
    text: function(text){
      return text === undefined ?
        (this.length > 0 ? this[0].textContent : null) :
        this.each(function(){ this.textContent = text });
    },
    attr: function(name, value){
      var res;
      return (typeof name == 'string' && value === undefined) ?
        (this.length == 0 ? undefined :
          (name == 'value' && this[0].nodeName == 'INPUT') ? this.val() :
          (!(res = this[0].getAttribute(name)) && name in this[0]) ? this[0][name] : res
        ) :
        this.each(function(idx){
          if (isO(name)) for (key in name) this.setAttribute(key, name[key])
          else this.setAttribute(name, funcArg(this, value, idx, this.getAttribute(name)));
        });
    },
    removeAttr: function(name) {
      return this.each(function() { this.removeAttribute(name); });
    },
    data: function(name, value){
      return this.attr('data-' + name, value);
    },
    val: function(value){
      return (value === undefined) ?
        (this.length > 0 ? this[0].value : null) :
        this.each(function(idx){
          this.value = funcArg(this, value, idx, this.value);
        });
    },
    offset: function(){
      if(this.length==0) return null;
      var obj = this[0].getBoundingClientRect();
      return {
        left: obj.left + window.pageXOffset,
        top: obj.top + window.pageYOffset,
        width: obj.width,
        height: obj.height
      };
    },
    css: function(property, value){
      if (value === undefined && typeof property == 'string') {
        return(
          this.length == 0
            ? undefined
            : this[0].style[camelize(property)] || getComputedStyle(this[0], '').getPropertyValue(property)
        );
      }
      var css = '';
      for (key in property) css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';';
      if (typeof property == 'string') css = dasherize(property) + ":" + maybeAddPx(property, value);
      return this.each(function() { this.style.cssText += ';' + css });
    },
    index: function(element){
      return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0]);
    },
    hasClass: function(name){
      if (this.length < 1) return false;
      else return classRE(name).test(this[0].className);
    },
    addClass: function(name){
      return this.each(function(idx) {
        classList = [];
        var cls = this.className, newName = funcArg(this, name, idx, cls);
        newName.split(/\s+/g).forEach(function(klass) {
          if (!$(this).hasClass(klass)) {
            classList.push(klass)
          }
        }, this);
        classList.length && (this.className += (cls ? " " : "") + classList.join(" "))
      });
    },
    removeClass: function(name){
      return this.each(function(idx) {
        if(name === undefined)
          return this.className = '';
        classList = this.className;
        funcArg(this, name, idx, classList).split(/\s+/g).forEach(function(klass) {
          classList = classList.replace(classRE(klass), " ")
        });
        this.className = classList.trim()
      });
    },
    toggleClass: function(name, when){
      return this.each(function(idx){
        var newName = funcArg(this, name, idx, this.className);
        (when === undefined ? !$(this).hasClass(newName) : when) ?
          $(this).addClass(newName) : $(this).removeClass(newName);
      });
    }
  };

  'filter,add,not,eq,first,last,find,closest,parents,parent,children,siblings'.split(',').forEach(function(property){
    var fn = $.fn[property];
    $.fn[property] = function() {
      var ret = fn.apply(this, arguments);
      ret.prevObject = this;
      return ret;
    }
  });

  ['width', 'height'].forEach(function(dimension){
    $.fn[dimension] = function(value) {
      var offset, Dimension = dimension.replace(/./, function(m) { return m[0].toUpperCase() });
      if (value === undefined) return this[0] == window ? window['inner' + Dimension] :
        this[0] == document ? document.documentElement['offset' + Dimension] :
        (offset = this.offset()) && offset[dimension];
      else return this.each(function(idx){
        var el = $(this);
        el.css(dimension, funcArg(this, value, idx, el[dimension]()));
      });
    }
  });

  function insert(operator, target, node) {
    var parent = (operator % 2) ? target : target.parentNode;
    parent && parent.insertBefore(node,
      !operator ? target.nextSibling :      // after
      operator == 1 ? parent.firstChild :   // prepend
      operator == 2 ? target :              // before
      null);                                // append
  }

  function traverseNode (node, fun) {
    fun(node);
    for (var key in node.childNodes) {
      traverseNode(node.childNodes[key], fun);
    }
  }

  adjacencyOperators.forEach(function(key, operator) {
    $.fn[key] = function(html){
      var nodes = isO(html) ? html : fragment(html);
      if (!('length' in nodes) || nodes.nodeType) nodes = [nodes];
      if (nodes.length < 1) return this;
      var size = this.length, copyByClone = size > 1, inReverse = operator < 2;

      return this.each(function(index, target){
        for (var i = 0; i < nodes.length; i++) {
          var node = nodes[inReverse ? nodes.length-i-1 : i];
          traverseNode(node, function (node) {
            if (node.nodeName != null && node.nodeName.toUpperCase() === 'SCRIPT' && (!node.type || node.type === 'text/javascript')) {
              window['eval'].call(window, node.innerHTML);
            }
          });
          if (copyByClone && index < size - 1) node = node.cloneNode(true);
          insert(operator, target, node);
        }
      });
    };

    var reverseKey = (operator % 2) ? key+'To' : 'insert'+(operator ? 'Before' : 'After');
    $.fn[reverseKey] = function(html) {
      $(html)[key](this);
      return this;
    };
  });

  Z.prototype = $.fn;

  return $;
})();

window.Zepto = Zepto;
'$' in window || (window.$ = Zepto);
//     Zepto.js
//     (c) 2010, 2011 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

(function($){
  var $$ = $.qsa, handlers = {}, _zid = 1, specialEvents={};

  specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents';

  function zid(element) {
    return element._zid || (element._zid = _zid++);
  }
  function findHandlers(element, event, fn, selector) {
    event = parse(event);
    if (event.ns) var matcher = matcherFor(event.ns);
    return (handlers[zid(element)] || []).filter(function(handler) {
      return handler
        && (!event.e  || handler.e == event.e)
        && (!event.ns || matcher.test(handler.ns))
        && (!fn       || handler.fn == fn)
        && (!selector || handler.sel == selector);
    });
  }
  function parse(event) {
    var parts = ('' + event).split('.');
    return {e: parts[0], ns: parts.slice(1).sort().join(' ')};
  }
  function matcherFor(ns) {
    return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)');
  }

  function eachEvent(events, fn, iterator){
    if ($.isObject(events)) $.each(events, iterator);
    else events.split(/\s/).forEach(function(type){ iterator(type, fn) });
  }

  function add(element, events, fn, selector, getDelegate){
    var id = zid(element), set = (handlers[id] || (handlers[id] = []));
    eachEvent(events, fn, function(event, fn){
      var delegate = getDelegate && getDelegate(fn, event),
        callback = delegate || fn;
      var proxyfn = function (event) {
        var result = callback.apply(element, [event].concat(event.data));
        if (result === false) event.preventDefault();
        return result;
      };
      var handler = $.extend(parse(event), {fn: fn, proxy: proxyfn, sel: selector, del: delegate, i: set.length});
      set.push(handler);
      element.addEventListener(handler.e, proxyfn, false);
    });
  }
  function remove(element, events, fn, selector){
    var id = zid(element);
    eachEvent(events || '', fn, function(event, fn){
      findHandlers(element, event, fn, selector).forEach(function(handler){
        delete handlers[id][handler.i];
        element.removeEventListener(handler.e, handler.proxy, false);
      });
    });
  }

  $.event = { add: add, remove: remove }

  $.fn.bind = function(event, callback){
    return this.each(function(){
      add(this, event, callback);
    });
  };
  $.fn.unbind = function(event, callback){
    return this.each(function(){
      remove(this, event, callback);
    });
  };
  $.fn.one = function(event, callback){
    return this.each(function(i, element){
      add(this, event, callback, null, function(fn, type){
        return function(){
          var result = fn.apply(element, arguments);
          remove(element, type, fn);
          return result;
        }
      });
    });
  };

  var returnTrue = function(){return true},
      returnFalse = function(){return false},
      eventMethods = {
        preventDefault: 'isDefaultPrevented',
        stopImmediatePropagation: 'isImmediatePropagationStopped',
        stopPropagation: 'isPropagationStopped'
      };
  function createProxy(event) {
    var proxy = $.extend({originalEvent: event}, event);
    $.each(eventMethods, function(name, predicate) {
      proxy[name] = function(){
        this[predicate] = returnTrue;
        return event[name].apply(event, arguments);
      };
      proxy[predicate] = returnFalse;
    })
    return proxy;
  }

  // emulates the 'defaultPrevented' property for browsers that have none
  function fix(event) {
    if (!('defaultPrevented' in event)) {
      event.defaultPrevented = false;
      var prevent = event.preventDefault;
      event.preventDefault = function() {
        this.defaultPrevented = true;
        prevent.call(this);
      }
    }
  }

  $.fn.delegate = function(selector, event, callback){
    return this.each(function(i, element){
      add(element, event, callback, selector, function(fn){
        return function(e){
          var evt, match = $(e.target).closest(selector, element).get(0);
          if (match) {
            evt = $.extend(createProxy(e), {currentTarget: match, liveFired: element});
            return fn.apply(match, [evt].concat([].slice.call(arguments, 1)));
          }
        }
      });
    });
  };
  $.fn.undelegate = function(selector, event, callback){
    return this.each(function(){
      remove(this, event, callback, selector);
    });
  }

  $.fn.live = function(event, callback){
    $(document.body).delegate(this.selector, event, callback);
    return this;
  };
  $.fn.die = function(event, callback){
    $(document.body).undelegate(this.selector, event, callback);
    return this;
  };

  $.fn.on = function(event, selector, callback){
    return selector === undefined || $.isFunction(selector) ?
      this.bind(event, selector) : this.delegate(selector, event, callback);
  };
  $.fn.off = function(event, selector, callback){
    return selector === undefined || $.isFunction(selector) ?
      this.unbind(event, selector) : this.undelegate(selector, event, callback);
  };

  $.fn.trigger = function(event, data){
    if (typeof event == 'string') event = $.Event(event);
    fix(event);
    event.data = data;
    return this.each(function(){ this.dispatchEvent(event) });
  };

  // triggers event handlers on current element just as if an event occurred,
  // doesn't trigger an actual event, doesn't bubble
  $.fn.triggerHandler = function(event, data){
    var e, result;
    this.each(function(i, element){
      e = createProxy(typeof event == 'string' ? $.Event(event) : event);
      e.data = data; e.target = element;
      $.each(findHandlers(element, event.type || event), function(i, handler){
        result = handler.proxy(e);
        if (e.isImmediatePropagationStopped()) return false;
      });
    });
    return result;
  };

  // shortcut methods for `.bind(event, fn)` for each event type
  ('focusin focusout load resize scroll unload click dblclick '+
  'mousedown mouseup mousemove mouseover mouseout '+
  'change select keydown keypress keyup error').split(' ').forEach(function(event) {
    $.fn[event] = function(callback){ return this.bind(event, callback) };
  });

  ['focus', 'blur'].forEach(function(name) {
    $.fn[name] = function(callback) {
      if (callback) this.bind(name, callback);
      else if (this.length) try { this.get(0)[name]() } catch(e){};
      return this;
    };
  });

  $.Event = function(type, props) {
    var event = document.createEvent(specialEvents[type] || 'Events'), bubbles = true;
    if (props) for (var name in props) (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name]);
    event.initEvent(type, bubbles, true, null, null, null, null, null, null, null, null, null, null, null, null);
    return event;
  };

})(Zepto);
//     Zepto.js
//     (c) 2010, 2011 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

(function($){
  function detect(ua){
    var os = (this.os = {}), browser = (this.browser = {}),
      webkit = ua.match(/WebKit\/([\d.]+)/),
      android = ua.match(/(Android)\s+([\d.]+)/),
      ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
      iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
      webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
      touchpad = webos && ua.match(/TouchPad/),
      blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/);

    if (webkit) browser.version = webkit[1];
    browser.webkit = !!webkit;

    if (android) os.android = true, os.version = android[2];
    if (iphone) os.ios = true, os.version = iphone[2].replace(/_/g, '.'), os.iphone = true;
    if (ipad) os.ios = true, os.version = ipad[2].replace(/_/g, '.'), os.ipad = true;
    if (webos) os.webos = true, os.version = webos[2];
    if (touchpad) os.touchpad = true;
    if (blackberry) os.blackberry = true, os.version = blackberry[2];
  }

  // ### $.os
  //
  // Object containing information about browser platform
  //
  // *Example:*
  //
  //     $.os.ios      // => true if running on Apple iOS
  //     $.os.android  // => true if running on Android
  //     $.os.webos    // => true if running on HP/Palm WebOS
  //     $.os.touchpad // => true if running on a HP TouchPad
  //     $.os.version  // => string with a version number, e.g.
  //                         "4.0", "3.1.1", "2.1", etc.
  //     $.os.iphone   // => true if running on iPhone
  //     $.os.ipad     // => true if running on iPad
  //     $.os.blackberry // => true if running on BlackBerry
  //
  // ### $.browser
  //
  // *Example:*
  //
  //     $.browser.webkit  // => true if the browser is WebKit-based
  //     $.browser.version // => WebKit version string
  detect.call($, navigator.userAgent);

  // make available to unit tests
  $.__detect = detect;

})(Zepto);
//     Zepto.js
//     (c) 2010, 2011 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

(function($, undefined){
  var prefix = '', eventPrefix, endEventName, endAnimationName,
    vendors = {Webkit: 'webkit', Moz: '', O: 'o', ms: 'MS'},
    document = window.document, testEl = document.createElement('div'),
    supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i;

  function downcase(str) { return str.toLowerCase() }
  function normalizeEvent(name) { return eventPrefix ? eventPrefix + name : downcase(name) };

  $.each(vendors, function(vendor, event){
    if (testEl.style[vendor + 'TransitionProperty'] !== undefined) {
      prefix = '-' + downcase(vendor) + '-';
      eventPrefix = event;
      return false;
    }
  });

  $.fx = {
    off: (eventPrefix === undefined && testEl.style.transitionProperty === undefined),
    cssPrefix: prefix,
    transitionEnd: normalizeEvent('TransitionEnd'),
    animationEnd: normalizeEvent('AnimationEnd')
  };

  $.fn.animate = function(properties, duration, ease, callback){
    if ($.isObject(duration))
      ease = duration.easing, callback = duration.complete, duration = duration.duration;
    if (duration) duration = duration / 1000;
    return this.anim(properties, duration, ease, callback);
  };

  $.fn.anim = function(properties, duration, ease, callback){
    var transforms, cssProperties = {}, key, that = this, wrappedCallback, endEvent = $.fx.transitionEnd;
    if (duration === undefined) duration = 0.4;
    if ($.fx.off) duration = 0;

    if (typeof properties == 'string') {
      // keyframe animation
      cssProperties[prefix + 'animation-name'] = properties;
      cssProperties[prefix + 'animation-duration'] = duration + 's';
      endEvent = $.fx.animationEnd;
    } else {
      // CSS transitions
      for (key in properties)
        if (supportedTransforms.test(key)) {
          transforms || (transforms = []);
          transforms.push(key + '(' + properties[key] + ')');
        }
        else cssProperties[key] = properties[key];

      if (transforms) cssProperties[prefix + 'transform'] = transforms.join(' ');
      if (!$.fx.off) cssProperties[prefix + 'transition'] = 'all ' + duration + 's ' + (ease || '');
    }

    wrappedCallback = function(){
      var props = {};
      props[prefix + 'transition'] = props[prefix + 'animation-name'] = 'none';
      $(this).css(props);
      callback && callback.call(this);
    }
    if (duration > 0) this.one(endEvent, wrappedCallback);

    setTimeout(function() {
      that.css(cssProperties);
      if (duration <= 0) setTimeout(function() {
        that.each(function(){ wrappedCallback.call(this) });
      }, 0);
    }, 0);

    return this;
  };

  testEl = null;
})(Zepto);
//     Zepto.js
//     (c) 2010, 2011 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

(function($){
  var jsonpID = 0,
      isObject = $.isObject,
      document = window.document,
      key,
      name;

  // trigger a custom event and return false if it was cancelled
  function triggerAndReturn(context, eventName, data) {
    var event = $.Event(eventName);
    $(context).trigger(event, data);
    return !event.defaultPrevented;
  }

  // trigger an Ajax "global" event
  function triggerGlobal(settings, context, eventName, data) {
    if (settings.global) return triggerAndReturn(context || document, eventName, data);
  }

  // Number of active Ajax requests
  $.active = 0;

  function ajaxStart(settings) {
    if (settings.global && $.active++ === 0) triggerGlobal(settings, null, 'ajaxStart');
  }
  function ajaxStop(settings) {
    if (settings.global && !(--$.active)) triggerGlobal(settings, null, 'ajaxStop');
  }

  // triggers an extra global event "ajaxBeforeSend" that's like "ajaxSend" but cancelable
  function ajaxBeforeSend(xhr, settings) {
    var context = settings.context;
    if (settings.beforeSend.call(context, xhr, settings) === false ||
        triggerGlobal(settings, context, 'ajaxBeforeSend', [xhr, settings]) === false)
      return false;

    triggerGlobal(settings, context, 'ajaxSend', [xhr, settings]);
  }
  function ajaxSuccess(data, xhr, settings) {
    var context = settings.context, status = 'success';
    settings.success.call(context, data, status, xhr);
    triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data]);
    ajaxComplete(status, xhr, settings);
  }
  // type: "timeout", "error", "abort", "parsererror"
  function ajaxError(error, type, xhr, settings) {
    var context = settings.context;
    settings.error.call(context, xhr, type, error);
    triggerGlobal(settings, context, 'ajaxError', [xhr, settings, error]);
    ajaxComplete(type, xhr, settings);
  }
  // status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
  function ajaxComplete(status, xhr, settings) {
    var context = settings.context;
    settings.complete.call(context, xhr, status);
    triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings]);
    ajaxStop(settings);
  }

  // Empty function, used as default callback
  function empty() {}

  // ### $.ajaxJSONP
  //
  // Load JSON from a server in a different domain (JSONP)
  //
  // *Arguments:*
  //
  //     options — object that configure the request,
  //               see avaliable options below
  //
  // *Avaliable options:*
  //
  //     url     — url to which the request is sent
  //     success — callback that is executed if the request succeeds
  //     error   — callback that is executed if the server drops error
  //     context — in which context to execute the callbacks in
  //
  // *Example:*
  //
  //     $.ajaxJSONP({
  //        url:     'http://example.com/projects?callback=?',
  //        success: function (data) {
  //            projects.push(json);
  //        }
  //     });
  //
  $.ajaxJSONP = function(options){
    var callbackName = 'jsonp' + (++jsonpID),
      script = document.createElement('script'),
      abort = function(){
        $(script).remove();
        if (callbackName in window) window[callbackName] = empty;
        ajaxComplete(xhr, options, 'abort');
      },
      xhr = { abort: abort }, abortTimeout;

    window[callbackName] = function(data){
      clearTimeout(abortTimeout);
      $(script).remove();
      delete window[callbackName];
      ajaxSuccess(data, xhr, options);
    };

    script.src = options.url.replace(/=\?/, '=' + callbackName);
    $('head').append(script);

    if (options.timeout > 0) abortTimeout = setTimeout(function(){
        xhr.abort();
        ajaxComplete(xhr, options, 'timeout');
      }, options.timeout);

    return xhr;
  };

  // ### $.ajaxSettings
  //
  // AJAX settings
  //
  $.ajaxSettings = {
    // Default type of request
    type: 'GET',
    // Callback that is executed before request
    beforeSend: empty,
    // Callback that is executed if the request succeeds
    success: empty,
    // Callback that is executed the the server drops error
    error: empty,
    // Callback that is executed on request complete (both: error and success)
    complete: empty,
    // The context for the callbacks
    context: null,
    // Whether to trigger "global" Ajax events
    global: true,
    // Transport
    xhr: function () {
      return new window.XMLHttpRequest();
    },
    // MIME types mapping
    accepts: {
      script: 'text/javascript, application/javascript',
      json:   'application/json',
      xml:    'application/xml, text/xml',
      html:   'text/html',
      text:   'text/plain'
    },
    // Whether the request is to another domain
    crossDomain: false,
    // Default timeout
    timeout: 0
  };

  // ### $.ajax
  //
  // Perform AJAX request
  //
  // *Arguments:*
  //
  //     options — object that configure the request,
  //               see avaliable options below
  //
  // *Avaliable options:*
  //
  //     type ('GET')          — type of request GET / POST
  //     url (window.location) — url to which the request is sent
  //     data                  — data to send to server,
  //                             can be string or object
  //     dataType ('json')     — what response type you accept from
  //                             the server:
  //                             'json', 'xml', 'html', or 'text'
  //     timeout (0)           — request timeout
  //     beforeSend            — callback that is executed before
  //                             request send
  //     complete              — callback that is executed on request
  //                             complete (both: error and success)
  //     success               — callback that is executed if
  //                             the request succeeds
  //     error                 — callback that is executed if
  //                             the server drops error
  //     context               — in which context to execute the
  //                             callbacks in
  //
  // *Example:*
  //
  //     $.ajax({
  //        type:       'POST',
  //        url:        '/projects',
  //        data:       { name: 'Zepto.js' },
  //        dataType:   'html',
  //        timeout:    100,
  //        context:    $('body'),
  //        success:    function (data) {
  //            this.append(data);
  //        },
  //        error:    function (xhr, type) {
  //            alert('Error!');
  //        }
  //     });
  //
  $.ajax = function(options){
    var settings = $.extend({}, options || {});
    for (key in $.ajaxSettings) if (settings[key] === undefined) settings[key] = $.ajaxSettings[key];

    ajaxStart(settings);

    if (!settings.crossDomain) settings.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) &&
      RegExp.$2 != window.location.host;

    if (/=\?/.test(settings.url)) return $.ajaxJSONP(settings);

    if (!settings.url) settings.url = window.location.toString();
    if (settings.data && !settings.contentType) settings.contentType = 'application/x-www-form-urlencoded';
    if (isObject(settings.data)) settings.data = $.param(settings.data);

    if (settings.type.match(/get/i) && settings.data) {
      var queryString = settings.data;
      if (settings.url.match(/\?.*=/)) {
        queryString = '&' + queryString;
      } else if (queryString[0] != '?') {
        queryString = '?' + queryString;
      }
      settings.url += queryString;
    }

    var mime = settings.accepts[settings.dataType],
        baseHeaders = { },
        protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
        xhr = $.ajaxSettings.xhr(), abortTimeout;

    if (!settings.crossDomain) baseHeaders['X-Requested-With'] = 'XMLHttpRequest';
    if (mime) baseHeaders['Accept'] = mime;
    settings.headers = $.extend(baseHeaders, settings.headers || {});

    xhr.onreadystatechange = function(){
      if (xhr.readyState == 4) {
        clearTimeout(abortTimeout);
        var result, error = false;
        if ((xhr.status >= 200 && xhr.status < 300) || (xhr.status == 0 && protocol == 'file:')) {
          if (mime == 'application/json' && !(/^\s*$/.test(xhr.responseText))) {
            try { result = JSON.parse(xhr.responseText); }
            catch (e) { error = e; }
          }
          else result = xhr.responseText;
          if (error) ajaxError(error, 'parsererror', xhr, settings);
          else ajaxSuccess(result, xhr, settings);
        } else {
          ajaxError(null, 'error', xhr, settings);
        }
      }
    };

    xhr.open(settings.type, settings.url, true);

    if (settings.contentType) settings.headers['Content-Type'] = settings.contentType;
    for (name in settings.headers) xhr.setRequestHeader(name, settings.headers[name]);

    if (ajaxBeforeSend(xhr, settings) === false) {
      xhr.abort();
      return false;
    }

    if (settings.timeout > 0) abortTimeout = setTimeout(function(){
        xhr.onreadystatechange = empty;
        xhr.abort();
        ajaxError(null, 'timeout', xhr, settings);
      }, settings.timeout);

    xhr.send(settings.data);
    return xhr;
  };

  // ### $.get
  //
  // Load data from the server using a GET request
  //
  // *Arguments:*
  //
  //     url     — url to which the request is sent
  //     success — callback that is executed if the request succeeds
  //
  // *Example:*
  //
  //     $.get(
  //        '/projects/42',
  //        function (data) {
  //            $('body').append(data);
  //        }
  //     );
  //
  $.get = function(url, success){ return $.ajax({ url: url, success: success }) };

  // ### $.post
  //
  // Load data from the server using POST request
  //
  // *Arguments:*
  //
  //     url        — url to which the request is sent
  //     [data]     — data to send to server, can be string or object
  //     [success]  — callback that is executed if the request succeeds
  //     [dataType] — type of expected response
  //                  'json', 'xml', 'html', or 'text'
  //
  // *Example:*
  //
  //     $.post(
  //        '/projects',
  //        { name: 'Zepto.js' },
  //        function (data) {
  //            $('body').append(data);
  //        },
  //        'html'
  //     );
  //
  $.post = function(url, data, success, dataType){
    if ($.isFunction(data)) dataType = dataType || success, success = data, data = null;
    return $.ajax({ type: 'POST', url: url, data: data, success: success, dataType: dataType });
  };

  // ### $.getJSON
  //
  // Load JSON from the server using GET request
  //
  // *Arguments:*
  //
  //     url     — url to which the request is sent
  //     success — callback that is executed if the request succeeds
  //
  // *Example:*
  //
  //     $.getJSON(
  //        '/projects/42',
  //        function (json) {
  //            projects.push(json);
  //        }
  //     );
  //
  $.getJSON = function(url, success){
    return $.ajax({ url: url, success: success, dataType: 'json' });
  };

  // ### $.fn.load
  //
  // Load data from the server into an element
  //
  // *Arguments:*
  //
  //     url     — url to which the request is sent
  //     [success] — callback that is executed if the request succeeds
  //
  // *Examples:*
  //
  //     $('#project_container').get(
  //        '/projects/42',
  //        function () {
  //            alert('Project was successfully loaded');
  //        }
  //     );
  //
  //     $('#project_comments').get(
  //        '/projects/42 #comments',
  //        function () {
  //            alert('Comments was successfully loaded');
  //        }
  //     );
  //
  $.fn.load = function(url, success){
    if (!this.length) return this;
    var self = this, parts = url.split(/\s/), selector;
    if (parts.length > 1) url = parts[0], selector = parts[1];
    $.get(url, function(response){
      self.html(selector ?
        $(document.createElement('div')).html(response).find(selector).html()
        : response);
      success && success.call(self);
    });
    return this;
  };

  var escape = encodeURIComponent;

  function serialize(params, obj, traditional, scope){
    var array = $.isArray(obj);
    $.each(obj, function(key, value) {
      if (scope) key = traditional ? scope : scope + '[' + (array ? '' : key) + ']';
      // handle data in serializeArray() format
      if (!scope && array) params.add(value.name, value.value);
      // recurse into nested objects
      else if (traditional ? $.isArray(value) : isObject(value))
        serialize(params, value, traditional, key);
      else params.add(key, value);
    });
  }

  // ### $.param
  //
  // Encode object as a string of URL-encoded key-value pairs
  //
  // *Arguments:*
  //
  //     obj — object to serialize
  //     [traditional] — perform shallow serialization
  //
  // *Example:*
  //
  //     $.param( { name: 'Zepto.js', version: '0.6' } );
  //
  $.param = function(obj, traditional){
    var params = [];
    params.add = function(k, v){ this.push(escape(k) + '=' + escape(v)) };
    serialize(params, obj, traditional);
    return params.join('&').replace('%20', '+');
  };
})(Zepto);
//     Zepto.js
//     (c) 2010, 2011 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

(function ($) {

  // ### $.fn.serializeArray
  //
  // Encode a set of form elements as an array of names and values
  //
  // *Example:*
  //
  //     $('#login_form').serializeArray();
  //
  //  returns
  //
  //     [
  //         {
  //             name: 'email',
  //             value: 'koss@nocorp.me'
  //         },
  //         {
  //             name: 'password',
  //             value: '123456'
  //         }
  //     ]
  //
  $.fn.serializeArray = function () {
    var result = [], el;
    $( Array.prototype.slice.call(this.get(0).elements) ).each(function () {
      el = $(this);
      var type = el.attr('type');
      if (
        !this.disabled && type != 'submit' && type != 'reset' && type != 'button' &&
        ((type != 'radio' && type != 'checkbox') || this.checked)
      ) {
        result.push({
          name: el.attr('name'),
          value: el.val()
        });
      }
    });
    return result;
  };

  // ### $.fn.serialize
  //
  //
  // Encode a set of form elements as a string for submission
  //
  // *Example:*
  //
  //     $('#login_form').serialize();
  //
  //  returns
  //
  //     "email=koss%40nocorp.me&password=123456"
  //
  $.fn.serialize = function () {
    var result = [];
    this.serializeArray().forEach(function (elm) {
      result.push( encodeURIComponent(elm.name) + '=' + encodeURIComponent(elm.value) );
    });
    return result.join('&');
  };

  // ### $.fn.submit
  //
  // Bind or trigger the submit event for a form
  //
  // *Examples:*
  //
  // To bind a handler for the submit event:
  //
  //     $('#login_form').submit(function (e) {
  //         alert('Form was submitted!');
  //         e.preventDefault();
  //     });
  //
  // To trigger form submit:
  //
  //     $('#login_form').submit();
  //
  $.fn.submit = function (callback) {
    if (callback) this.bind('submit', callback)
    else if (this.length) {
      var event = $.Event('submit');
      this.eq(0).trigger(event);
      if (!event.defaultPrevented) this.get(0).submit()
    }
    return this;
  }

})(Zepto);
//     Zepto.js
//     (c) 2010, 2011 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

(function($){
  var touch = {}, touchTimeout;

  function parentIfText(node){
    return 'tagName' in node ? node : node.parentNode;
  }

  function swipeDirection(x1, x2, y1, y2){
    var xDelta = Math.abs(x1 - x2), yDelta = Math.abs(y1 - y2);
    if (xDelta >= yDelta) {
      return (x1 - x2 > 0 ? 'Left' : 'Right');
    } else {
      return (y1 - y2 > 0 ? 'Up' : 'Down');
    }
  }

  var longTapDelay = 750;
  function longTap(){
    if (touch.last && (Date.now() - touch.last >= longTapDelay)) {
      $(touch.target).trigger('longTap');
      touch = {};
    }
  }

  $(document).ready(function(){
    $(document.body).bind('touchstart', function(e){
      var now = Date.now(), delta = now - (touch.last || now);
      touch.target = parentIfText(e.touches[0].target);
      touchTimeout && clearTimeout(touchTimeout);
      touch.x1 = e.touches[0].pageX;
      touch.y1 = e.touches[0].pageY;
      if (delta > 0 && delta <= 250) touch.isDoubleTap = true;
      touch.last = now;
      setTimeout(longTap, longTapDelay);
    }).bind('touchmove', function(e){
      touch.x2 = e.touches[0].pageX;
      touch.y2 = e.touches[0].pageY;
    }).bind('touchend', function(e){
      if (touch.isDoubleTap) {
        $(touch.target).trigger('doubleTap');
        touch = {};
      } else if (touch.x2 > 0 || touch.y2 > 0) {
        (Math.abs(touch.x1 - touch.x2) > 30 || Math.abs(touch.y1 - touch.y2) > 30)  &&
          $(touch.target).trigger('swipe') &&
          $(touch.target).trigger('swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)));
        touch.x1 = touch.x2 = touch.y1 = touch.y2 = touch.last = 0;
      } else if ('last' in touch) {
        touchTimeout = setTimeout(function(){
          touchTimeout = null;
          $(touch.target).trigger('tap')
          touch = {};
        }, 250);
      }
    }).bind('touchcancel', function(){ touch = {} });
  });

  ['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown', 'doubleTap', 'tap', 'longTap'].forEach(function(m){
    $.fn[m] = function(callback){ return this.bind(m, callback) }
  });
})(Zepto);
DEBUG = true;(function() {
  var Actor, BackgroundLayer, BathroomDoor, BedroomDoor, BeerCrates, Cactus, Clock, Computer, Couch, Emo, Entity, EntityLayer, EntranceDoor, ForegroundLayer, Game, Guidette, Hero, Hipster, InteractionController, KeyHole, KitchenChair, LOG, Lamp, Layer, Moon, Mop, Nerd, Plant, PlantPot, Poster, Pothead, Princess, Renderer, Rug, Settings, Speaker, SpriteStore, Stereo, Student, Table, Uplight;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  if (DEBUG) {
    LOG = function() {
      return console.log.apply(console, arguments);
    };
  } else {
    LOG = function() {};
  }

  window.requestAnimationFrame || (window.requestAnimationFrame = function(callback, element) {
    return window.setTimeout(callback, 1000 / 25);
  });

  Settings = {
    mainCanvasID: 'main'
  };

  SpriteStore = (function() {

    function SpriteStore(callback) {
      var assets, group, name, sprite, sprites, _fn, _ref, _ref2;
      var _this = this;
      LOG('Initializing SpriteStore');
      this.sprites = {};
      assets = 0;
      _ref = SpriteStore.Assets;
      for (group in _ref) {
        sprites = _ref[group];
        for (name in sprites) {
          if (!__hasProp.call(sprites, name)) continue;
          assets++;
        }
      }
      LOG("Found " + assets + " assets");
      _ref2 = SpriteStore.Assets;
      for (group in _ref2) {
        if (!__hasProp.call(_ref2, group)) continue;
        sprites = _ref2[group];
        LOG("Loading " + group);
        this.sprites[group] = {};
        _fn = function(group, name, sprite) {
          var height, spriteImage, width, _ref3;
          LOG("Loading " + group + "/" + name);
          _this.sprites[group][name] = [];
          _ref3 = sprite.size, width = _ref3.width, height = _ref3.height;
          spriteImage = new Image;
          spriteImage.onload = function() {
            var canvas, context, index, spriteCount;
            LOG("Loaded " + name);
            spriteCount = sprite.spriteCount || 1;
            for (index = 0; 0 <= spriteCount ? index < spriteCount : index > spriteCount; 0 <= spriteCount ? index++ : index--) {
              canvas = document.createElement('canvas');
              canvas.width = width;
              canvas.height = height;
              context = canvas.getContext('2d');
              try {
                context.drawImage(spriteImage, index * width, 0, width, height, 0, 0, width, height);
                _this.sprites[group][name][index] = canvas;
                LOG("@sprites[" + group + "][" + name + "][" + index + "]");
              } catch (error) {
                LOG("Encountered error " + error + " while loading sprite: " + sprite);
                if (error.name === "INDEX_SIZE_ERR") {
                  LOG("Sprite file may be too small");
                }
                break;
              }
            }
            if (--assets === 0) {
              return typeof callback === "function" ? callback() : void 0;
            }
          };
          return spriteImage.src = "./img/" + group + "/" + name + ".png";
        };
        for (name in sprites) {
          if (!__hasProp.call(sprites, name)) continue;
          sprite = sprites[name];
          _fn(group, name, sprite);
        }
      }
    }

    SpriteStore.prototype.getSprite = function(group, name, index) {
      var sprite, _ref, _ref2;
      if (index == null) index = 0;
      if (!(sprite = (_ref = this.sprites[group]) != null ? (_ref2 = _ref[name]) != null ? _ref2[index] : void 0 : void 0)) {
        throw "Could not load " + name + "[" + index + "] in " + group;
      } else {
        return sprite;
      }
    };

    SpriteStore.Assets = {
      'entities': {
        'pothead': {
          size: {
            width: 31,
            height: 50
          }
        },
        'emo': {
          size: {
            width: 28,
            height: 59
          },
          spriteCount: 13
        },
        'hipster': {
          size: {
            width: 30,
            height: 55
          },
          spriteCount: 13
        },
        'hero': {
          size: {
            width: 27,
            height: 56
          },
          spriteCount: 13
        },
        'guidette': {
          size: {
            width: 30,
            height: 55
          },
          spriteCount: 30
        },
        'student': {
          size: {
            width: 20,
            height: 51
          },
          spriteCount: 17
        },
        'nerd': {
          size: {
            width: 20,
            height: 51
          },
          spriteCount: 18
        },
        'princess': {
          size: {
            width: 30,
            height: 51
          },
          spriteCount: 13
        },
        'stereo': {
          size: {
            width: 23,
            height: 29
          }
        },
        'couch': {
          size: {
            width: 77,
            height: 34
          }
        },
        'computer': {
          size: {
            width: 19,
            height: 34
          },
          spriteCount: 2
        }
      },
      'backgrounds': {
        'flat-background': {
          size: {
            width: 746,
            height: 163
          }
        },
        'flat-foreground': {
          size: {
            width: 746,
            height: 163
          }
        }
      }
    };

    return SpriteStore;

  })();

  Renderer = (function() {

    function Renderer(game, callback) {
      var _this = this;
      this.game = game;
      LOG('Initializing Renderer');
      this.mainCanvas = document.getElementById(Settings.mainCanvasID);
      this.mainCanvas.width = 839;
      this.mainCanvas.height = 163;
      this.mainContext = this.mainCanvas.getContext('2d');
      this.spriteStore = new SpriteStore(function() {
        LOG('Sprite store callback executed');
        _this.backgroundLayer = new BackgroundLayer(_this);
        _this.entityLayer = new EntityLayer(_this, _this.game);
        _this.foregroundLayer = new ForegroundLayer(_this);
        _this.layers = [_this.backgroundLayer, _this.entityLayer, _this.foregroundLayer];
        return typeof callback === "function" ? callback() : void 0;
      });
    }

    Renderer.prototype.joinLayers = function() {
      var join, layer, _i, _len, _ref, _results;
      var _this = this;
      join = function(layer, alpha) {
        if (alpha == null) alpha = 1.0;
        return _this.mainContext.drawImage(layer.canvas, 0, 0);
      };
      this.clear(this.mainContext);
      _ref = this.layers;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        layer = _ref[_i];
        _results.push(join(layer));
      }
      return _results;
    };

    Renderer.prototype.clear = function(context) {
      return context.clearRect(0, 0, Settings.canvasWidth, Settings.canvasHeight);
    };

    Renderer.prototype.render = function() {
      var layer, _i, _len, _ref;
      _ref = this.layers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        layer = _ref[_i];
        if (layer.needsRedraw) layer.redraw();
      }
      return this.joinLayers();
    };

    return Renderer;

  })();

  Layer = (function() {

    function Layer(renderer) {
      this.renderer = renderer;
      this.canvas = document.createElement('canvas');
      this.canvas.width = 1024;
      this.canvas.height = 748;
      this.context = this.canvas.getContext('2d');
      this.needsRedraw = true;
    }

    Layer.prototype.getSprite = function(type, name, index) {
      if (index == null) index = 0;
      return this.renderer.spriteStore.getSprite(type, name, index);
    };

    Layer.prototype.clear = function() {
      return this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };

    Layer.prototype.redraw = function() {};

    return Layer;

  })();

  BackgroundLayer = (function() {

    __extends(BackgroundLayer, Layer);

    function BackgroundLayer() {
      BackgroundLayer.__super__.constructor.apply(this, arguments);
    }

    BackgroundLayer.prototype.redraw = function() {
      var sprite;
      sprite = this.getSprite('backgrounds', 'flat-background');
      return this.context.drawImage(sprite, 0, 0, sprite.width, sprite.height, 0, 0, sprite.width, sprite.height);
    };

    return BackgroundLayer;

  })();

  ForegroundLayer = (function() {

    __extends(ForegroundLayer, Layer);

    function ForegroundLayer() {
      ForegroundLayer.__super__.constructor.apply(this, arguments);
    }

    ForegroundLayer.prototype.redraw = function() {
      var sprite;
      sprite = this.getSprite('backgrounds', 'flat-foreground');
      return this.context.drawImage(sprite, 0, 0, sprite.width, sprite.height, 0, 0, sprite.width, sprite.height);
    };

    return ForegroundLayer;

  })();

  EntityLayer = (function() {

    __extends(EntityLayer, Layer);

    function EntityLayer(renderer, game) {
      this.renderer = renderer;
      this.game = game;
      EntityLayer.__super__.constructor.apply(this, arguments);
    }

    EntityLayer.prototype.redraw = function() {
      var entity, flipped, flippedContext, sprite, x, y, _i, _len, _ref, _ref2, _results;
      this.clear();
      _ref = this.game.entities;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        entity = _ref[_i];
        sprite = this.getSprite('entities', entity.sprite, entity.spriteIndex);
        _ref2 = entity.position, x = _ref2.x, y = _ref2.y;
        x = (x - Math.floor(sprite.width / 2)) | 0;
        y = (y - sprite.height) | 0;
        if (entity.direction === 'left') {
          flipped = document.createElement('canvas');
          flipped.width = sprite.width;
          flipped.height = sprite.height;
          flippedContext = flipped.getContext('2d');
          flippedContext.translate(sprite.width, 0);
          flippedContext.scale(-1, 1);
          flippedContext.drawImage(sprite, 0, 0, sprite.width, sprite.height);
          sprite = flipped;
        }
        _results.push(this.context.drawImage(sprite, 0, 0, sprite.width, sprite.height, x, y, sprite.width, sprite.height));
      }
      return _results;
    };

    return EntityLayer;

  })();

  InteractionController = (function() {

    function InteractionController(game) {
      var _this = this;
      this.game = game;
      this.mainCanvas = document.getElementById(Settings.mainCanvasID);
      $(this.mainCanvas).on('click', function(event) {
        var entity, x, y, _i, _len, _ref;
        event.preventDefault();
        x = event.offsetX || event.pageX - $(_this.mainCanvas).offset().left;
        y = event.offsetY || event.pageY - $(_this.mainCanvas).offset().top;
        if (_this.game.isLocked) return;
        _ref = _this.game.entities.reverse();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          entity = _ref[_i];
          if (entity.enabled) {
            if (entity.hitTest(x, y)) {
              if (typeof entity.clickAction === "function") entity.clickAction();
              return;
            }
          }
        }
        return _this.game.hero.walkTo(x, 145);
      });
    }

    return InteractionController;

  })();

  Entity = (function() {

    function Entity(game) {
      var _ref, _ref2, _ref3, _ref4, _ref5;
      this.game = game;
      if ((_ref = this.position) == null) {
        this.position = {
          x: 0,
          y: 0
        };
      }
      if ((_ref2 = this.state) == null) this.state = 'default';
      if ((_ref3 = this.spriteIndex) == null) this.spriteIndex = 0;
      if ((_ref4 = this.enabled) == null) this.enabled = true;
      if ((_ref5 = this.hitbox) == null) {
        this.hitbox = {
          width: 0,
          height: 0
        };
      }
    }

    Entity.prototype.hitTest = function(x, y) {
      return (this.position.x - this.hitbox.width / 2 < x && x <= this.position.x + this.hitbox.width / 2) && (this.position.y - this.hitbox.height < y && y <= this.position.y);
    };

    Entity.prototype.updateSprite = function(frameCount) {};

    Entity.prototype.animate = function() {};

    return Entity;

  })();

  Actor = (function() {

    __extends(Actor, Entity);

    function Actor() {
      var _ref, _ref2, _ref3;
      if ((_ref = this.direction) == null) this.direction = 'right';
      if ((_ref2 = this.speed) == null) {
        this.speed = {
          x: 4,
          y: 0.7
        };
      }
      if ((_ref3 = this.action) == null) this.action = null;
      Actor.__super__.constructor.apply(this, arguments);
    }

    Actor.prototype.walkTo = function(x, y, next) {
      var _this = this;
      if (this.action) this.resetAction();
      if (!(this.position.x === x && this.position.y === y)) {
        this.state = 'walking';
      }
      return this.action = function(frameCount) {
        var _ref, _ref2;
        if (_this.position.x === x && _this.position.y === y) {
          _this.action = null;
          _this.state = 'default';
          if (typeof next === "function") next();
          return;
        }
        if (_this.position.x < x) {
          _this.direction = 'right';
        } else {
          _this.direction = 'left';
        }
        if (frameCount % 2 === 0) {
          if ((-_this.speed.x < (_ref = _this.position.x - x) && _ref < _this.speed.x)) {
            _this.position.x = x;
          } else if (_this.position.x < x) {
            _this.position.x += _this.speed.x;
          } else {
            _this.position.x -= _this.speed.x;
          }
          if ((-_this.speed.y < (_ref2 = _this.position.y - y) && _ref2 < _this.speed.y)) {
            return _this.position.y = y;
          } else if (_this.position.y < y) {
            return _this.position.y += _this.speed.y;
          } else {
            return _this.position.y -= _this.speed.y;
          }
        }
      };
    };

    Actor.prototype.say = function(text, next) {
      var executed, frames;
      var _this = this;
      if (this.action) this.resetAction();
      this.state = 'talking';
      executed = false;
      frames = 13 * text.split(' ').length;
      return this.action = function(frameCount) {
        if (!executed) {
          $('#speech').css({
            top: _this.position.y - 75,
            left: _this.position.x
          });
          $('#speech').text(text);
          executed = true;
        }
        if (--frames < 0) {
          _this.action = null;
          _this.state = 'default';
          $('#speech').text('');
          if (typeof next === "function") next();
        }
      };
    };

    Actor.prototype.performAction = function(frameCount) {
      return typeof this.action === "function" ? this.action(frameCount) : void 0;
    };

    Actor.prototype.resetAction = function() {
      this.action = null;
      this.state = 'default';
      return $('#speech').text('');
    };

    return Actor;

  })();

  Emo = (function() {

    __extends(Emo, Actor);

    function Emo() {
      this.name = 'Erik';
      this.sprite = 'emo';
      this.hitbox = {
        width: 28,
        height: 59
      };
      this.properties = {
        hasCigarettes: true
      };
      Emo.__super__.constructor.apply(this, arguments);
    }

    Emo.prototype.updateSprite = function(frameCount) {
      switch (this.state) {
        case 'walking':
          return this.spriteIndex = 7 + Math.floor(frameCount / 4) % 6;
        case 'talking':
          switch (Math.round(frameCount / 5) % 2) {
            case 0:
              return this.spriteIndex = 0;
            case 1:
              return this.spriteIndex = 2;
          }
          break;
        case 'smoking':
          switch (Math.round(frameCount / 5) % 24) {
            case 0:
            case 7:
              if (this.properties.hasCigarettes) return this.spriteIndex = 3;
              break;
            case 1:
            case 6:
              if (this.properties.hasCigarettes) return this.spriteIndex = 4;
              break;
            case 2:
            case 4:
              if (this.properties.hasCigarettes) return this.spriteIndex = 5;
              break;
            case 3:
            case 5:
              if (this.properties.hasCigarettes) return this.spriteIndex = 6;
          }
          break;
        default:
          switch (Math.round((32 + frameCount) / 5) % 50) {
            case 14:
            case 16:
              return this.spriteIndex = 1;
            default:
              return this.spriteIndex = 0;
          }
      }
    };

    Emo.prototype.clickAction = function() {
      var x, y, _ref, _ref2, _ref3, _ref4, _ref5;
      var _this = this;
      if (this.game.currentRound === 0) {
        _ref = this.position, x = _ref.x, y = _ref.y;
        this.game.hero.walkTo(x - 29, y, function() {
          _this.game.isLocked = true;
          _this.direction = 'left';
          _this.game.hero.direction = 'right';
          return _this.say("Here's some friendly advice, man.", function() {
            return _this.say("Stay away from that little dragon slayer over there,", function() {
              return _this.say("he almost bored me to tears with his video game ramblings.", function() {
                return _this.game.isLocked = false;
              });
            });
          });
        });
      }
      if (this.game.currentRound === 1) {
        _ref2 = this.position, x = _ref2.x, y = _ref2.y;
        this.game.hero.walkTo(x - 29, y, function() {
          _this.game.isLocked = true;
          _this.direction = 'left';
          _this.game.hero.direction = 'right';
          return _this.say("That Spanish chick?", function() {
            return _this.say("I feel like she's not very picky when it comes to guys", function() {
              return _this.say("So even you might have a chance", function() {
                return _this.say("Haha", function() {
                  _this.game.isLocked = false;
                  return _this.state = 'smoking';
                });
              });
            });
          });
        });
      }
      if (this.game.currentRound === 2) {
        _ref3 = this.position, x = _ref3.x, y = _ref3.y;
        this.game.hero.walkTo(x - 29, y, function() {
          _this.game.isLocked = true;
          _this.direction = 'left';
          _this.game.hero.direction = 'right';
          return _this.say("That girl that lives here is kinda cute,", function() {
            return _this.say("do you know her?", function() {
              _this.game.isLocked = false;
              return _this.state = 'smoking';
            });
          });
        });
      }
      if (this.game.currentRound === 3) {
        _ref4 = this.position, x = _ref4.x, y = _ref4.y;
        this.game.hero.walkTo(x - 29, y, function() {
          _this.game.isLocked = true;
          _this.direction = 'left';
          _this.game.hero.direction = 'right';
          return _this.say("Hey man, do you think you could do me a favor?", function() {
            return _this.game.hero.say("Uh, I guess?", function() {
              return _this.say("There is that cute blonde in the living room,", function() {
                return _this.say("and you two seem to go along quite well,", function() {
                  return _this.say("can you ask her out for me?", function() {
                    _this.game.currentRound = 4;
                    _this.game.isLocked = false;
                    return _this.state = 'smoking';
                  });
                });
              });
            });
          });
        });
      }
      if (this.game.currentRound === 4) {
        _ref5 = this.position, x = _ref5.x, y = _ref5.y;
        return this.game.hero.walkTo(x - 29, y, function() {
          _this.game.isLocked = true;
          _this.direction = 'left';
          _this.game.hero.direction = 'right';
          return _this.say("What did she say?", function() {
            _this.game.isLocked = false;
            return _this.state = 'smoking';
          });
        });
      }
    };

    return Emo;

  })();

  Pothead = (function() {

    __extends(Pothead, Actor);

    function Pothead() {
      this.name = 'Peter';
      this.sprite = 'pothead';
      this.hitbox = {
        width: 31,
        height: 50
      };
      Pothead.__super__.constructor.apply(this, arguments);
    }

    return Pothead;

  })();

  Hipster = (function() {

    __extends(Hipster, Actor);

    function Hipster() {
      Hipster.__super__.constructor.apply(this, arguments);
      this.name = 'Hannes';
      this.sprite = 'hipster';
      this.hitbox = {
        width: 27,
        height: 55
      };
    }

    Hipster.prototype.updateSprite = function(frameCount) {
      switch (this.state) {
        case 'walking':
          return this.spriteIndex = 5 + Math.floor(frameCount / 4) % 6;
        case 'typing':
          if (frameCount % 3 === 0) {
            return this.spriteIndex = 1 + Math.floor(Math.random() * 4);
          }
          break;
        default:
          return this.spriteIndex = 0;
      }
    };

    Hipster.prototype.clickAction = function() {
      var x, y, _ref, _ref2, _ref3;
      var _this = this;
      if (this.game.currentRound === 0) {
        _ref = this.position, x = _ref.x, y = _ref.y;
        this.game.hero.walkTo(x - 29, y, function() {
          _this.game.isLocked = true;
          _this.state = 'default';
          _this.direction = 'left';
          _this.game.hero.direction = 'right';
          return _this.say("Can't you see I'm busy?", function() {
            return _this.say("I'm DJing, duh!?", function() {
              _this.state = 'typing';
              return _this.game.isLocked = false;
            });
          });
        });
      }
      if (this.game.currentRound === 1) {
        _ref2 = this.position, x = _ref2.x, y = _ref2.y;
        this.game.hero.walkTo(x - 29, y, function() {
          _this.game.isLocked = true;
          _this.state = 'default';
          _this.direction = 'left';
          _this.game.hero.direction = 'right';
          _this.game.student.walkTo(x + 25, y, function() {
            return _this.game.student.direction = 'left';
          });
          return _this.say("You know, I had Berghain guestlist tonight.", function() {
            return _this.say("But that place is way to touristy for my taste", function() {
              _this.state = 'typing';
              return _this.game.student.say("Did you say Berghain?!", function() {
                return _this.game.student.say("I heard so much of it, where is that club?", function() {
                  _this.state = 'default';
                  _this.direction = 'right';
                  return _this.say('Gah, I guess it suits you.', function() {
                    return _this.say("It's…", function() {
                      return _this.say("It's on the corner of Einbahnstraße and Sackgasse", function() {
                        return _this.say("You can't miss it", function() {
                          return _this.game.student.say("Oh thank you so much!", function() {
                            return _this.game.student.say("See you guys", function() {
                              return _this.game.student.walkTo(-20, 144, function() {
                                _this.game.currentRound = 2;
                                return _this.game.isLocked = false;
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      }
      if (this.game.currentRound === 1) {
        _ref3 = this.position, x = _ref3.x, y = _ref3.y;
        return this.game.hero.walkTo(x - 29, y, function() {
          _this.game.isLocked = true;
          _this.state = 'default';
          _this.direction = 'left';
          _this.game.hero.direction = 'right';
          _this.game.student.walkTo(x + 25, y, function() {
            return _this.game.student.direction = 'left';
          });
          return _this.say("You know, I had Berghain guestlist tonight.", function() {
            return _this.say("But that place is way to touristy for my taste", function() {
              _this.state = 'typing';
              return _this.game.student.say("Did you say Berghain?!", function() {
                return _this.game.student.say("I heard so much of it, where is that club?", function() {
                  _this.state = 'default';
                  _this.direction = 'right';
                  return _this.say('Gah, I guess it suits you.', function() {
                    return _this.say("It's…", function() {
                      return _this.say("It's on the corner of Einbahnstraße and Sackgasse", function() {
                        return _this.say("You can't miss it", function() {
                          return _this.game.student.say("Oh thank you so much!", function() {
                            return _this.game.student.say("¡Hasta luego, guys!", function() {
                              return _this.game.student.walkTo(-20, 144, function() {
                                _this.state = 'typing';
                                _this.game.currentRound = 2;
                                return _this.game.isLocked = false;
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      }
    };

    return Hipster;

  })();

  Hero = (function() {

    __extends(Hero, Actor);

    function Hero() {
      this.name = 'Hero';
      this.sprite = 'hero';
      Hero.__super__.constructor.apply(this, arguments);
    }

    Hero.prototype.updateSprite = function(frameCount) {
      switch (this.state) {
        case 'walking':
          return this.spriteIndex = 4 + Math.floor(frameCount / 4) % 6;
        case 'talking':
          return this.spriteIndex = 1 + Math.floor(frameCount / 3) % 2;
        default:
          switch (Math.round(frameCount / 5) % 90) {
            case 4:
            case 5:
            case 63:
            case 65:
            case 83:
            case 84:
              return this.spriteIndex = 1;
            default:
              return this.spriteIndex = 0;
          }
      }
    };

    return Hero;

  })();

  Guidette = (function() {

    __extends(Guidette, Actor);

    function Guidette() {
      this.name = 'Snookie';
      this.sprite = 'guidette';
      this.hitbox = {
        width: 30,
        height: 46
      };
      Guidette.__super__.constructor.apply(this, arguments);
    }

    Guidette.prototype.updateSprite = function(frameCount) {
      switch (this.state) {
        case 'walking':
          return this.spriteIndex = 8 + Math.floor(frameCount / 4) % 6;
        case 'talking':
          switch (Math.abs(Math.round(Math.cos(frameCount / 10) * 3) % 3)) {
            case 0:
              return this.spriteIndex = 0;
            case 1:
              return this.spriteIndex = 2;
            case 2:
              return this.spriteIndex = 3;
          }
          break;
        case 'laughing':
          return this.spriteIndex = 4 + Math.round(frameCount / 3) % 2;
        case 'dancing':
          switch (Math.round(frameCount / 3) % 4) {
            case 0:
              return this.spriteIndex = 14;
            case 1:
              return this.spriteIndex = 15;
            case 2:
              return this.spriteIndex = 16;
            case 3:
              return this.spriteIndex = 15;
          }
          break;
        default:
          switch (Math.round(frameCount / 5) % 90) {
            case 4:
            case 5:
            case 63:
            case 65:
            case 83:
            case 84:
              return this.spriteIndex = 1;
            default:
              return this.spriteIndex = 0;
          }
      }
    };

    Guidette.prototype.clickAction = function() {
      var x, y, _ref, _ref2, _ref3, _ref4, _ref5;
      var _this = this;
      if (this.game.currentRound === 0) {
        _ref = this.position, x = _ref.x, y = _ref.y;
        this.game.hero.walkTo(x + 25, y, function() {
          _this.game.isLocked = true;
          _this.game.hero.direction = 'left';
          _this.direction = 'right';
          return _this.say("Woohoo, 18 hours without sleep.", function() {
            return _this.say("I'm a party machine!", function() {
              _this.state = 'dancing';
              return _this.game.isLocked = false;
            });
          });
        });
      }
      if (this.game.currentRound === 1) {
        _ref2 = this.position, x = _ref2.x, y = _ref2.y;
        this.game.hero.walkTo(x + 25, y, function() {
          _this.game.isLocked = true;
          _this.game.hero.direction = 'left';
          _this.direction = 'right';
          return _this.say("That Hipster over there with the laptop?", function() {
            return _this.say("He has like no taste in music", function() {
              _this.state = 'default';
              return _this.game.isLocked = false;
            });
          });
        });
      }
      if (this.game.currentRound === 2) {
        _ref3 = this.position, x = _ref3.x, y = _ref3.y;
        this.game.hero.walkTo(x + 25, y, function() {
          _this.game.isLocked = true;
          _this.game.hero.direction = 'left';
          _this.direction = 'right';
          return _this.say("This music sucks, I guess it's up to me now", function() {
            _this.game.hipster.walkTo(313, 150, function() {
              return _this.game.hipster.right;
            });
            return _this.walkTo(333, 150, function() {
              return _this.say("Oh yeah baby!", function() {
                return _this.say("Bring it on!", function() {
                  _this.state = 'dancing';
                  return _this.game.hipster.say("O my god!", function() {
                    return _this.game.hipster.say("I'm outta here", function() {
                      return _this.game.hipster.walkTo(-20, 144, function() {
                        _this.game.currentRound = 3;
                        return _this.game.isLocked = false;
                      });
                    });
                  });
                });
              });
            });
          });
        });
      }
      if (this.game.currentRound === 3) {
        _ref4 = this.position, x = _ref4.x, y = _ref4.y;
        this.game.hero.walkTo(x - 25, y, function() {
          _this.game.isLocked = true;
          _this.direction = 'left';
          _this.game.hero.direction = 'right';
          return _this.say("That creep in the kitches keeps staring at me.", function() {
            return _this.say("Woohoo!", function() {
              _this.state = 'dancing';
              return _this.game.isLocked = false;
            });
          });
        });
      }
      if (this.game.currentRound === 4) {
        _ref5 = this.position, x = _ref5.x, y = _ref5.y;
        return this.game.hero.walkTo(x - 25, y, function() {
          _this.game.isLocked = true;
          _this.direction = 'left';
          _this.game.hero.direction = 'right';
          _this.state = 'default';
          return _this.game.hero.say("Do you see my friend over there, in the kitchen.", function() {
            return _this.say("Uhuh?", function() {
              return _this.game.hero.say("He's kinda, well, the quiet type.", function() {
                return _this.say("Uhuh?", function() {
                  return _this.game.hero.say("But I get the impression he really likes you.", function() {
                    return _this.say("I see what you're getting at…", function() {
                      return _this.walkTo(_this.game.emo.position.x - 20, _this.game.emo.position.y, function() {
                        _this.direction = 'right';
                        return _this.say("*whispers in his ear*", function() {
                          _this.state = 'dancing';
                          return _this.game.emo.say("Oh Christ, no!", function() {
                            return _this.game.emo.walkTo(-20, 144, function() {
                              return _this.say("Wait for me!", function() {
                                return _this.walkTo(-20, 144, function() {
                                  _this.game.isLocked = false;
                                  return _this.game.currentRound = 5;
                                });
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      }
    };

    return Guidette;

  })();

  Student = (function() {

    __extends(Student, Actor);

    function Student() {
      this.name = 'Lucia';
      this.sprite = 'student';
      this.hitbox = {
        width: 20,
        height: 55
      };
      Student.__super__.constructor.apply(this, arguments);
    }

    Student.prototype.updateSprite = function(frameCount) {
      switch (this.state) {
        case 'walking':
          return this.spriteIndex = 11 + Math.floor(frameCount / 4) % 6;
        case 'talking':
          switch (Math.abs(Math.round(Math.cos(frameCount / 10) * 3) % 3)) {
            case 0:
              return this.spriteIndex = 0;
            case 1:
              return this.spriteIndex = 4;
            case 2:
              return this.spriteIndex = 5;
          }
          break;
        case 'laughing':
          return this.spriteIndex = 6 + Math.round(frameCount / 3) % 3;
        case 'dancing':
          switch (Math.round(frameCount / 3) % 4) {
            case 0:
              return this.spriteIndex = 14;
            case 1:
              return this.spriteIndex = 15;
            case 2:
              return this.spriteIndex = 16;
            case 3:
              return this.spriteIndex = 15;
          }
          break;
        default:
          switch (Math.round(33 + frameCount / 5) % 90) {
            case 0:
            case 1:
            case 53:
            case 55:
            case 83:
              return this.spriteIndex = 3;
            default:
              return this.spriteIndex = 0;
          }
      }
    };

    Student.prototype.clickAction = function() {
      var x, y, _ref;
      var _this = this;
      if (this.game.currentRound === 0) {
        _ref = this.position, x = _ref.x, y = _ref.y;
        return this.game.hero.walkTo(x - 25, y, function() {
          _this.game.isLocked = true;
          _this.game.hero.direction = 'right';
          _this.direction = 'left';
          return _this.say("¡Hey!", function() {
            return _this.say("Would you mind showing me around town?", function() {
              return _this.say("(nudge nudge)", function() {
                return _this.say("I'm new here.", function() {
                  return _this.say("(wink wink)", function() {
                    return _this.game.hero.say("Blo Blo Blo", function() {
                      return _this.say("Laber Laber", function() {
                        return _this.walkTo(_this.game.emo.position.x - 20, _this.game.emo.position.y, function() {
                          _this.direction = 'right';
                          _this.game.emo.direction = 'left';
                          return _this.say("La Ti Da", function() {
                            return _this.game.emo.say("Ho Ho Ho", function() {
                              return _this.say("Jumped Di Bumbel", function() {
                                return _this.game.emo.say("Boom Shakalaka", function() {
                                  _this.walkTo(_this.game.emo.position.x, _this.game.emo.position.y);
                                  return _this.game.emo.walkTo(_this.game.nerd.position.x - 50, _this.game.nerd.position.y, function() {
                                    _this.game.emo.state = 'smoking';
                                    return _this.game.nerd.say("Hust Hust", function() {
                                      return _this.game.nerd.walkTo(-20, 144, function() {
                                        _this.game.isLocked = false;
                                        return _this.game.currentRound = 1;
                                      });
                                    });
                                  });
                                });
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      }
    };

    Student.prototype.clickAction = function() {
      var x, y, _ref, _ref2;
      var _this = this;
      if (this.game.currentRound === 0) {
        _ref = this.position, x = _ref.x, y = _ref.y;
        this.game.hero.walkTo(x - 25, y, function() {
          _this.game.isLocked = true;
          _this.game.hero.direction = 'right';
          _this.direction = 'left';
          return _this.say("¡Hey!", function() {
            return _this.say("Do you now if there is still beer around here?", function() {
              return _this.game.hero.say("None in the fridge?", function() {
                return _this.say("Si.", function() {
                  return _this.game.hero.say("Have you tried the balcony?", function() {
                    return _this.say("Smart thinking", function() {
                      return _this.walkTo(_this.game.emo.position.x - 20, _this.game.emo.position.y, function() {
                        _this.direction = 'right';
                        _this.game.emo.direction = 'left';
                        return _this.say("¡Hey!", function() {
                          return _this.game.emo.say("O my", function() {
                            return _this.say("Are you from Berlin?", function() {
                              return _this.say("Do you know any cool clubs around here?", function() {
                                return _this.say("[SUDDEN BURST OF WHITE NOISE]", function() {
                                  return _this.say("[MORE WHITE NOISE]", function() {
                                    return _this.game.emo.say("GOD! Leave me alone!", function() {
                                      _this.walkTo(_this.game.emo.position.x, _this.game.emo.position.y);
                                      return _this.game.emo.walkTo(_this.game.nerd.position.x - 50, _this.game.nerd.position.y, function() {
                                        _this.game.emo.state = 'smoking';
                                        return _this.game.nerd.say("(Choke Cough)", function() {
                                          return _this.game.nerd.say("I… can't…", function() {
                                            return _this.game.nerd.say("breathe…", function() {
                                              return _this.game.nerd.walkTo(-20, 144, function() {
                                                _this.game.isLocked = false;
                                                return _this.game.currentRound = 1;
                                              });
                                            });
                                          });
                                        });
                                      });
                                    });
                                  });
                                });
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      }
      if (this.game.currentRound === 1) {
        _ref2 = this.position, x = _ref2.x, y = _ref2.y;
        return this.game.hero.walkTo(x - 25, y, function() {
          _this.game.isLocked = true;
          _this.game.hero.direction = 'right';
          _this.direction = 'left';
          return _this.say("Bah, I don't care about that idiot anyways.", function() {
            return _this.say("You and I can still have a lot of fun tonight, ", function() {
              return _this.say("don't you think?", function() {
                return _this.game.isLocked = false;
              });
            });
          });
        });
      }
    };

    return Student;

  })();

  Princess = (function() {

    __extends(Princess, Actor);

    function Princess() {
      this.name = 'Princess';
      this.sprite = 'princess';
      this.hitbox = {
        width: 30,
        height: 46
      };
      Princess.__super__.constructor.apply(this, arguments);
    }

    Princess.prototype.updateSprite = function(frameCount) {
      switch (this.state) {
        case 'walking':
          return this.spriteIndex = 8 + Math.floor(frameCount / 4) % 6;
        case 'talking':
          switch (Math.round(frameCount / 5) % 2) {
            case 0:
              return this.spriteIndex = 0;
            case 1:
              return this.spriteIndex = 2;
          }
          break;
        case 'laughing':
          return this.spriteIndex = 4 + Math.round(frameCount / 3) % 2;
        case 'dancing':
          switch (Math.round(frameCount / 3) % 4) {
            case 0:
              return this.spriteIndex = 14;
            case 1:
              return this.spriteIndex = 15;
            case 2:
              return this.spriteIndex = 16;
            case 3:
              return this.spriteIndex = 15;
          }
          break;
        default:
          switch (Math.round(frameCount / 5) % 90) {
            case 4:
            case 5:
            case 63:
            case 65:
            case 83:
            case 84:
              return this.spriteIndex = 1;
            default:
              return this.spriteIndex = 0;
          }
      }
    };

    Princess.prototype.clickAction = function() {
      var x, y, _ref, _ref2, _ref3, _ref4, _ref5, _ref6;
      var _this = this;
      if (this.game.currentRound === 0) {
        _ref = this.position, x = _ref.x, y = _ref.y;
        this.game.hero.walkTo(x + 20, y, function() {
          _this.game.isLocked = true;
          _this.direction = 'right';
          _this.game.hero.direction = 'left';
          return _this.say("Hey, did you invite that creep in the kitchen?", function() {
            return _this.game.isLocked = false;
          });
        });
      }
      if (this.game.currentRound === 1) {
        _ref2 = this.position, x = _ref2.x, y = _ref2.y;
        this.game.hero.walkTo(x + 20, y, function() {
          _this.game.isLocked = true;
          _this.direction = 'right';
          _this.game.hero.direction = 'left';
          return _this.say("It's nice of you to drop by.", function() {
            return _this.game.isLocked = false;
          });
        });
      }
      if (this.game.currentRound === 2) {
        _ref3 = this.position, x = _ref3.x, y = _ref3.y;
        this.game.hero.walkTo(x + 20, y, function() {
          _this.game.isLocked = true;
          _this.direction = 'right';
          _this.game.hero.direction = 'left';
          return _this.say("All these people keep me pretty busy", function() {
            return _this.game.isLocked = false;
          });
        });
      }
      if (this.game.currentRound === 3) {
        _ref4 = this.position, x = _ref4.x, y = _ref4.y;
        this.game.hero.walkTo(x + 20, y, function() {
          _this.game.isLocked = true;
          _this.direction = 'right';
          _this.game.hero.direction = 'left';
          return _this.say("It's getting late", function() {
            return _this.game.isLocked = false;
          });
        });
      }
      if (this.game.currentRound === 4) {
        _ref5 = this.position, x = _ref5.x, y = _ref5.y;
        this.game.hero.walkTo(x + 20, y, function() {
          _this.game.isLocked = true;
          _this.direction = 'right';
          _this.game.hero.direction = 'left';
          return _this.say("Is there something you want to tell me?", function() {
            return _this.game.hero.say("I don't think so.", function() {
              return _this.game.isLocked = false;
            });
          });
        });
      }
      if (this.game.currentRound === 5) {
        _ref6 = this.position, x = _ref6.x, y = _ref6.y;
        return this.game.hero.walkTo(x + 20, y, function() {
          _this.game.isLocked = true;
          _this.direction = 'right';
          _this.game.hero.direction = 'left';
          return _this.say("Why did you do all this?", function() {
            return _this.say("Just to be ALONE™ with me?", function() {
              return _this.game.hero.say("No.", function() {
                return _this.game.hero.say("Just to win Ludum Dare", function() {
                  return document.location = "http://ludumdare.com";
                });
              });
            });
          });
        });
      }
    };

    return Princess;

  })();

  Nerd = (function() {

    __extends(Nerd, Actor);

    function Nerd() {
      this.name = 'Steve';
      this.sprite = 'nerd';
      this.hitbox = {
        width: 20,
        height: 51
      };
      Nerd.__super__.constructor.apply(this, arguments);
    }

    Nerd.prototype.updateSprite = function(frameCount) {
      var f;
      switch (this.state) {
        case 'walking':
          return this.spriteIndex = 9 + Math.floor(frameCount / 4) % 6;
        case 'talking':
          switch (Math.abs(Math.round(Math.cos(frameCount / 10) * 3) % 3)) {
            case 0:
              return this.spriteIndex = 0;
            case 1:
              return this.spriteIndex = 2;
            case 2:
              return this.spriteIndex = 3;
          }
          break;
        default:
          f = Math.floor(frameCount / 3) % 30;
          if (f <= 12) this.spriteIndex = 0;
          if (f === 13) this.spriteIndex = 1;
          if (f === 14) this.spriteIndex = 2;
          if (f === 15) this.spriteIndex = 3;
          if ((16 <= f && f <= 20)) this.spriteIndex = 4;
          if ((21 <= f && f <= 30)) return this.spriteIndex = 5;
      }
    };

    Nerd.prototype.clickAction = function() {
      var x, y, _ref;
      var _this = this;
      if (this.game.currentRound === 0) {
        _ref = this.position, x = _ref.x, y = _ref.y;
        return this.game.hero.walkTo(x - 25, y, function() {
          _this.game.isLocked = true;
          _this.direction = 'left';
          _this.game.hero.direction = 'right';
          return _this.say("Skyrim bla bla bla", function() {
            return _this.say("Dragon born bla bla bla", function() {
              return _this.say("Dhovakin bla bla bla", function() {
                return _this.say("Thu'um bla bla bla", function() {
                  return _this.say("Thieves guild bla bla bla", function() {
                    return _this.say("better than Oblivion", function() {
                      return _this.say("Mammoth bla bla bla", function() {
                        return _this.say("<spoiler alert>", function() {
                          return _this.say("Main quest ends in Sovngarde", function() {
                            return _this.say("</spoiler alert>", function() {
                              return _this.say("Dragons bla bla bla", function() {
                                return _this.game.isLocked = false;
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      }
    };

    return Nerd;

  })();

  Stereo = (function() {

    __extends(Stereo, Entity);

    function Stereo() {
      this.name = 'Home Stereo';
      this.sprite = 'stereo';
      this.hitbox = {
        width: 23,
        height: 29
      };
      Stereo.__super__.constructor.apply(this, arguments);
    }

    Stereo.prototype.clickAction = function() {
      var _this = this;
      return this.game.hero.walkTo(this.position.x - 20, this.position.y + 2, function() {
        _this.game.hero.direction = 'right';
        return _this.game.hero.say("Wow, that's one dusty HiFi!");
      });
    };

    return Stereo;

  })();

  Couch = (function() {

    __extends(Couch, Entity);

    function Couch() {
      this.name = 'Couch';
      this.sprite = 'couch';
      this.hitbox = {
        width: 77,
        height: 35
      };
      Couch.__super__.constructor.apply(this, arguments);
    }

    Couch.prototype.clickAction = function() {
      var _this = this;
      return this.game.hero.walkTo(this.position.x - 20, this.position.y + 2, function() {
        _this.game.hero.direction = 'right';
        return _this.game.hero.say("Hmm, looks couchy!");
      });
    };

    return Couch;

  })();

  Computer = (function() {

    __extends(Computer, Entity);

    function Computer() {
      this.name = 'MacBook Air';
      this.sprite = 'computer';
      this.hitbox = {
        width: 19,
        height: 34
      };
      Computer.__super__.constructor.apply(this, arguments);
    }

    Computer.prototype.clickAction = function() {
      var _this = this;
      return this.game.hero.walkTo(this.position.x - 25, this.position.y - 4, function() {
        _this.game.hero.direction = 'right';
        return _this.game.hero.say("Only two pixels thick,                      it's the thinnes and lightest in the industry.");
      });
    };

    return Computer;

  })();

  Cactus = (function() {

    __extends(Cactus, Entity);

    function Cactus() {
      Cactus.__super__.constructor.apply(this, arguments);
    }

    return Cactus;

  })();

  EntranceDoor = (function() {

    __extends(EntranceDoor, Entity);

    function EntranceDoor() {
      EntranceDoor.__super__.constructor.apply(this, arguments);
    }

    return EntranceDoor;

  })();

  BedroomDoor = (function() {

    __extends(BedroomDoor, Entity);

    function BedroomDoor() {
      BedroomDoor.__super__.constructor.apply(this, arguments);
    }

    return BedroomDoor;

  })();

  BathroomDoor = (function() {

    __extends(BathroomDoor, Entity);

    function BathroomDoor() {
      BathroomDoor.__super__.constructor.apply(this, arguments);
    }

    return BathroomDoor;

  })();

  Poster = (function() {

    __extends(Poster, Entity);

    function Poster() {
      Poster.__super__.constructor.apply(this, arguments);
    }

    return Poster;

  })();

  Lamp = (function() {

    __extends(Lamp, Entity);

    function Lamp() {
      Lamp.__super__.constructor.apply(this, arguments);
    }

    return Lamp;

  })();

  Table = (function() {

    __extends(Table, Entity);

    function Table() {
      Table.__super__.constructor.apply(this, arguments);
    }

    return Table;

  })();

  Speaker = (function() {

    __extends(Speaker, Entity);

    function Speaker() {
      Speaker.__super__.constructor.apply(this, arguments);
    }

    return Speaker;

  })();

  Speaker = (function() {

    __extends(Speaker, Entity);

    function Speaker() {
      Speaker.__super__.constructor.apply(this, arguments);
    }

    return Speaker;

  })();

  Speaker = (function() {

    __extends(Speaker, Entity);

    function Speaker() {
      Speaker.__super__.constructor.apply(this, arguments);
    }

    return Speaker;

  })();

  Speaker = (function() {

    __extends(Speaker, Entity);

    function Speaker() {
      Speaker.__super__.constructor.apply(this, arguments);
    }

    return Speaker;

  })();

  Speaker = (function() {

    __extends(Speaker, Entity);

    function Speaker() {
      Speaker.__super__.constructor.apply(this, arguments);
    }

    return Speaker;

  })();

  Rug = (function() {

    __extends(Rug, Entity);

    function Rug() {
      Rug.__super__.constructor.apply(this, arguments);
    }

    return Rug;

  })();

  Plant = (function() {

    __extends(Plant, Entity);

    function Plant() {
      Plant.__super__.constructor.apply(this, arguments);
    }

    return Plant;

  })();

  Mop = (function() {

    __extends(Mop, Entity);

    function Mop() {
      Mop.__super__.constructor.apply(this, arguments);
    }

    return Mop;

  })();

  Uplight = (function() {

    __extends(Uplight, Entity);

    function Uplight() {
      Uplight.__super__.constructor.apply(this, arguments);
    }

    return Uplight;

  })();

  KitchenChair = (function() {

    __extends(KitchenChair, Entity);

    function KitchenChair() {
      KitchenChair.__super__.constructor.apply(this, arguments);
    }

    return KitchenChair;

  })();

  KitchenChair = (function() {

    __extends(KitchenChair, Entity);

    function KitchenChair() {
      KitchenChair.__super__.constructor.apply(this, arguments);
    }

    return KitchenChair;

  })();

  Clock = (function() {

    __extends(Clock, Entity);

    function Clock() {
      Clock.__super__.constructor.apply(this, arguments);
    }

    return Clock;

  })();

  BeerCrates = (function() {

    __extends(BeerCrates, Entity);

    function BeerCrates() {
      BeerCrates.__super__.constructor.apply(this, arguments);
    }

    return BeerCrates;

  })();

  PlantPot = (function() {

    __extends(PlantPot, Entity);

    function PlantPot() {
      PlantPot.__super__.constructor.apply(this, arguments);
    }

    return PlantPot;

  })();

  Moon = (function() {

    __extends(Moon, Entity);

    function Moon() {
      Moon.__super__.constructor.apply(this, arguments);
    }

    return Moon;

  })();

  KeyHole = (function() {

    __extends(KeyHole, Entity);

    function KeyHole() {
      KeyHole.__super__.constructor.apply(this, arguments);
    }

    return KeyHole;

  })();

  Game = (function() {

    function Game() {
      this.currentRound = 0;
      this.hero = new Hero(this);
      this.emo = new Emo(this);
      this.hipster = new Hipster(this);
      this.guidette = new Guidette(this);
      this.student = new Student(this);
      this.nerd = new Nerd(this);
      this.princess = new Princess(this);
      this.stereo = new Stereo(this);
      this.couch = new Couch(this);
      this.computer = new Computer(this);
      this.entities = [this.hero, this.emo, this.hipster, this.guidette, this.student, this.nerd, this.princess, this.stereo, this.couch, this.computer];
      this.hero.position = {
        x: 52,
        y: 145
      };
      this.princess.position = {
        x: 202,
        y: 143
      };
      this.emo.position = {
        x: 642,
        y: 144
      };
      this.emo.state = 'smoking';
      this.hipster.position = {
        x: 333,
        y: 150
      };
      this.hipster.state = 'typing';
      this.guidette.position = {
        x: 262,
        y: 142
      };
      this.student.position = {
        x: 462,
        y: 147
      };
      this.student.direction = 'left';
      this.student.sate = 'talking';
      this.nerd.position = {
        x: 535,
        y: 142
      };
      this.stereo.position = {
        x: 314,
        y: 139
      };
      this.computer.position = {
        x: 332,
        y: 155
      };
      this.couch.position = {
        x: 160,
        y: 140
      };
    }

    return Game;

  })();

  $(function() {
    var game, i, r;
    game = new Game;
    LOG("Game is " + this.game);
    i = this.interactionController = new InteractionController(game);
    return r = this.renderer = new Renderer(game, function() {
      var frameCount, mainLoop;
      LOG('Renderer callback executed');
      frameCount = 0;
      mainLoop = function() {
        var actor, _i, _len, _ref;
        game.entities.sort(function(a, b) {
          return a.position.y - b.position.y;
        });
        _ref = game.entities;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          actor = _ref[_i];
          if (!(actor instanceof Actor)) continue;
          actor.updateSprite(frameCount);
          actor.performAction(frameCount);
        }
        r.render();
        frameCount++;
        return requestAnimationFrame(mainLoop);
      };
      return mainLoop();
    });
  });

}).call(this);
