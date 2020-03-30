'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var react = require('react');

var Observable = /** @class */ (function () {
    function Observable(value) {
        this.value = value;
    }
    return Observable;
}());
var index = (function () {
    var _proxy;
    return function useReactive(value) {
        var _a = react.useState(value), valueState = _a[0], setValueState = _a[1];
        if (_proxy) {
            _proxy = _proxy;
        }
        else {
            var observable = new Observable(valueState);
            _proxy = new Proxy(observable, {
                set: function (object, prop, newValue, receiver) {
                    if (prop === 'value' && receiver === _proxy) {
                        object[prop] = newValue;
                        setValueState(newValue);
                        return true;
                    }
                    else {
                        return false;
                    }
                },
            });
        }
        return _proxy;
    };
})();

exports.Observable = Observable;
exports.default = index;
//# sourceMappingURL=index.js.map
