/**
 * @类 TypedArrayList
 * 类型数组链表
 * @get length: number  获取 typedArray 的长度
 * @get capacity: number  获取开辟的 typedArray 的长度
 * @get typedArray: number  获取 typedArray
 * @function clear
 * @function find
 * @function push
 * @function slice
 * @function subArray
 */
export class TypedArrayList {
    constructor(typedArrayConstructor, capacity = 8) {
        // 扩容 callback
        this.capacityChangedCallback = null;
        this._typedArrayConstructor = typedArrayConstructor;
        this._capacity = capacity;
        if (this._capacity === 0) {
            this._capacity = 8;
        }
        this._array = new this._typedArrayConstructor(this._capacity);
        this._length = 0;
    }
    get length() {
        return this._length;
    }
    get capacity() {
        return this._capacity;
    }
    get typedArray() {
        return this._array;
    }
    // clear 方法
    clear() {
        this._length = 0;
    }
    // find 方法
    find(index) {
        if (index < 0 || index >= this._length) {
            throw new Error("index overshoot!");
        }
        return this._array[index];
    }
    // push 方法
    push(num) {
        // length > capacity 扩容
        if (this._length >= this._capacity) {
            if (this._capacity > 0) {
                this._capacity += this._capacity;
            }
            let oldArray = this._array;
            this._array = new this._typedArrayConstructor(this._capacity);
            this._array.set(oldArray);
            if (this.capacityChangedCallback !== null) {
                this.capacityChangedCallback(this);
            }
        }
        this._array[this._length++] = num;
        return this._length;
    }
    // subArray 方法
    subArray(start = 0, end = this._length) {
        return this._array.subarray(start, end);
    }
    // slice 方法
    slice(start = 0, end = this._length) {
        return this._array.slice(start, end);
    }
}
/**
 * @类 Dictionary
 * 字典对象, Dictionary(useMap: boolean = true) useMap 为 true 则使用 Map<>() 结构, 否则使用 { [key: string]: T } 索引签名
 * @get length: number  获取 Dictionary 长度
 * @get keys: string[]  获取所有键 key
 * @get values: T[]  获取所有值 value
 * @function contains
 * @function find
 * @function insert
 * @function remove
 * @function toString
 */
export class Dictionary {
    constructor(useMap = true) {
        this._count = 0;
        if (useMap) {
            this._items = new Map();
        }
        else {
            this._items = {};
        }
    }
    get length() {
        return this._count;
    }
    get keys() {
        let keys = [];
        if (this._items instanceof Map) {
            let keyArr = this._items.keys();
            for (let key of keyArr) {
                keys.push(key);
            }
        }
        else {
            for (let prop in this._items) {
                if (this._items.hasOwnProperty(prop)) {
                    keys.push(prop);
                }
            }
        }
        return keys;
    }
    get values() {
        let values = [];
        if (this._items instanceof Map) {
            let valArr = this._items.values();
            for (let val of valArr) {
                values.push(val);
            }
        }
        else {
            for (let prop in this._items) {
                if (this._items.hasOwnProperty(prop)) {
                    values.push(this._items[prop]);
                }
            }
        }
        return values;
    }
    // 判断 key 是否存在
    contains(key) {
        if (this._items instanceof Map) {
            return this._items.has(key);
        }
        else {
            return this._items[key] !== undefined;
        }
    }
    // 查询值
    find(key) {
        if (this._items instanceof Map) {
            return this._items.get(key);
        }
        else {
            return this._items[key];
        }
    }
    // 插入一个键值对
    insert(key, value) {
        if (this._items instanceof Map) {
            this._items.set(key, value);
        }
        else {
            this._items[key] = value;
        }
        this._count++;
    }
    // 删除
    remove(key) {
        const ret = this.find(key);
        if (ret === undefined) {
            return false;
        }
        if (this._items instanceof Map) {
            this._items.delete(key);
        }
        else {
            delete this._items[key];
        }
        this._count--;
        return false;
    }
    // toString 方法
    toString() {
        return JSON.stringify(this._items);
    }
}
/**
 * 用例 ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓
 */
// init TypedArrayList
let fload32ArrayList = new TypedArrayList(Float32Array);
let uint16Array = new TypedArrayList(Uint16Array);
console.log("old", fload32ArrayList);
// testSubarray
function testSubarray(subarray) {
    let f32arr = new Uint16Array([0, 1, 2, 3, 4]);
    let subrange;
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
// Dictionary
let dict = new Dictionary(false);
// insert
dict.insert("a", "a");
dict.insert("b", "b");
dict.insert("c", "c");
dict.insert("d", "d");
console.log("insert", JSON.stringify(dict));
// remove
dict.remove("c");
console.log("remove", JSON.stringify(dict));
// contains
console.log("contains", dict.contains("c"));
// find
console.log("find", dict.find("b"));
// keys
console.log("keys", dict.keys);
// values
console.log("values", dict.values);
