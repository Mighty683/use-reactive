import { useMemo, useState } from 'react';

var Observable = /** @class */ (function () {
    function Observable(value) {
        this.value = value;
    }
    return Observable;
}());
function useReactive(value) {
    var _a = useState(value), valueState = _a[0], setValueState = _a[1];
    return useMemo(function () {
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

export default useReactive;
export { Observable };
//# sourceMappingURL=index.es.js.map
