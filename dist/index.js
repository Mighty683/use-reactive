'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var react = require('react');

var Observable = /** @class */ (function () {
    function Observable(value) {
        this.value = value;
    }
    return Observable;
}());
function useReactive(value) {
    var _a = react.useState(value), valueState = _a[0], setValueState = _a[1];
    return react.useMemo(function () {
        var _proxy;
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
        return _proxy;
    }, []);
}

exports.Observable = Observable;
exports.default = useReactive;
//# sourceMappingURL=index.js.map
