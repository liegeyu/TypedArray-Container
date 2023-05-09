"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypedArrayList = void 0;
// TypedArrayList
var TypedArrayList = /** @class */ (function () {
    function TypedArrayList(typedArrayConstructor, capacity) {
        if (capacity === void 0) { capacity = 8; }
        this._typedArrayConstructor = typedArrayConstructor;
        this._capacity = capacity;
        if (this._capacity === 0) {
            this._capacity = 8;
        }
        this._array = new this._typedArrayConstructor(this._capacity);
        this._length = 0;
    }
    Object.defineProperty(TypedArrayList.prototype, "length", {
        get: function () {
            return this._length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TypedArrayList.prototype, "capacity", {
        get: function () {
            return this._capacity;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TypedArrayList.prototype, "typedArray", {
        get: function () {
            return this._array;
        },
        enumerable: false,
        configurable: true
    });
    // push 方法
    TypedArrayList.prototype.push = function (num) {
        // length > capacity 扩容
        if (this._length >= this._capacity) {
            if (this._capacity > 0) {
                this._capacity += this._capacity;
            }
            var oldArray = this._array;
            this._array = new this._typedArrayConstructor(this._capacity);
            this._array.set(oldArray);
        }
        this._array[this._length++] = num;
        return this._length;
    };
    // subArray 方法
    TypedArrayList.prototype.subArray = function (start, end) {
        if (start === void 0) { start = 0; }
        if (end === void 0) { end = this._length; }
        return this._array.subarray(start, end);
    };
    // slice 方法
    TypedArrayList.prototype.slice = function (start, end) {
        if (start === void 0) { start = 0; }
        if (end === void 0) { end = this._length; }
        return this._array.slice(start, end);
    };
    return TypedArrayList;
}());
exports.TypedArrayList = TypedArrayList;
// init TypedArrayList
var fload32ArrayList = new TypedArrayList(Float32Array);
var uint16Array = new TypedArrayList(Uint16Array);
console.log("old", fload32ArrayList);
// testSubarray
function testSubarray(subarray) {
    var f32arr = new Uint16Array([0, 1, 2, 3, 4]);
    var subrange;
    if (subarray === true) {
        subrange = f32arr.subarray(1, 3);
    }
    else {
        subrange = f32arr.slice(1, 3);
    }
    console.log("共享一个ArrayBuffer数据源", f32arr.buffer === subrange.buffer);
}
testSubarray(true);
testSubarray(false);
