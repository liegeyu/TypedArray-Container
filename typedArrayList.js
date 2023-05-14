/**
 * @class TypedArrayList
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
 * @class Dictionary
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
 * @class ListNode
 * 双向循环链表节点
 */
export class ListNode {
    constructor(data = undefined) {
        this.next = null;
        this.prev = null;
        this.data = data;
    }
}
/**
 * @class List
 * 双向循环链表
 * @get length: number  获取 List 的长度
 */
export class List {
    constructor() {
        this._headNode = new ListNode();
        this._headNode.next = this._headNode;
        this._headNode.prev = this._headNode;
        this._length = 0;
    }
    // 获取 List 的长度
    get length() {
        return this._length;
    }
    // 判断是否为空链表
    empty() {
        return this._headNode.next === this._headNode;
    }
    begin() {
        if (this._headNode.next === null) {
            throw new Error("头节点");
        }
        return this._headNode.next;
    }
    end() {
        return this._headNode;
    }
    // 查询是否存在某值
    contains(data) {
        for (let node = this._headNode.next; node !== null && node !== this._headNode; node = node.next) {
            if (node.data !== undefined) {
                if (data === node.data) {
                    return true;
                }
            }
        }
        return false;
    }
    // 插入
    insert(node, data) {
        let ret = new ListNode(data);
        ret.next = node;
        ret.prev = node.prev;
        if (node.prev !== null) {
            node.prev.next = ret;
        }
        node.prev = ret;
        this._length++;
        return this._length;
    }
    // 删除
    remove(node) {
        let ret = node;
        let next = node.next;
        let prev = node.prev;
        if (prev !== null) {
            prev.next = next;
        }
        if (next !== null) {
            next.prev = prev;
        }
        this._length--;
        return ret;
    }
    // push 方法
    push(data) {
        this.insert(this.end(), data);
    }
    // pop 方法
    pop() {
        let prev = this.end().prev;
        if (prev !== null) {
            let ret = prev.data;
            this.remove(prev);
            return ret;
        }
        return undefined;
    }
    // unshift 方法
    unshift(data) {
        this.insert(this.begin(), data);
    }
    // shift 方法
    shift() {
        let ret = this.begin().data;
        this.remove(this.begin());
        return ret;
    }
    // next 遍历并执行回调
    forNext(cb) {
        for (let node = this._headNode.next; node !== null && node !== this._headNode; node = node.next) {
            if (node.data !== undefined) {
                cb(node.data);
            }
        }
    }
    // prev 遍历并执行回调
    forPrev(cb) {
        for (let node = this._headNode.next; node !== null && node !== this._headNode; node = node.prev) {
            if (node.data !== undefined) {
                cb(node.data);
            }
        }
    }
}
/**
 * @class AdapterBase
 * 抽象基类。栈与队列有两种类型可选 List<T> 类型或者 Array<T> 类型; 实现队列和栈的共有操作; 将不同操作 remove 交给具体栈和队列自己实现;
 */
export class AdapterBase {
    constructor(useList = true) {
        if (useList) {
            this._arr = new List();
        }
        else {
            this._arr = new Array();
        }
    }
    // length
    get length() {
        return this._arr.length;
    }
    // isEmpty
    get isEmpty() {
        return this._arr.length === 0;
    }
    // add 方法
    add(data) {
        this._arr.push(data);
    }
    // clear 方法
    clear() {
        if (this._arr instanceof List) {
            this._arr = new List();
        }
        else {
            this._arr = new Array();
        }
    }
}
/**
 * @class Stack extends AdapterBase
 * 栈
 * @function remove
 */
export class Stack extends AdapterBase {
    remove() {
        if (this._arr.length > 0) {
            this._arr.pop();
        }
        return undefined;
    }
}
/**
 * @class Queue extends AdapterBase
 * 队列
 * @function remove
 */
export class Queue extends AdapterBase {
    remove() {
        if (this._arr.length > 0) {
            return this._arr.shift();
        }
        return undefined;
    }
}
/**
 * @class TreeNode
 * 树节点
 * @get parent 获取父节点
 * @get childCount 获取子节点数量
 * @get root 获取根节点
 * @get depth 获取树的度
 * @function getChildAt(index: number): TreeNode<T> | undefined 通过索引获取子节点
 * @function hasChild(): boolean 判断当前节点是否含有子节点
 * @function isDescendantOf(ancestor: TreeNode<T> | undefined): boolean 判断要添加的子节点是否为当前节点的祖先节点
 * @function removeChildAt(index: number): TreeNode<T> | undefined 根据索引删除某个节点
 * @function removeChild(child: TreeNode<T> | undefined): TreeNode<T> | undefined 根据节点删除某个节点
 * @function remove(): TreeNode<T> | undefined 将当前节点从父节点中删除
 * @function addChildAt(child: TreeNode<T>,index: number): TreeNode<T> | undefined 添加子节点
 * @function addChild(child: TreeNode<T>): TreeNode<T> | undefined 添加子节点
 */
export class TreeNode {
    constructor(data = undefined, parent = undefined, name = "") {
        this._parent = parent;
        this._children = undefined;
        this.name = name;
        this.data = data;
        if (this._parent !== undefined) {
            this._parent.addChild(this);
        }
    }
    // parent
    get parent() {
        return this._parent;
    }
    // childCount
    get childCount() {
        if (this._children !== undefined) {
            return this._children.length;
        }
        else {
            return 0;
        }
    }
    // root
    get root() {
        let curR = this;
        while (curR !== undefined && curR.parent !== undefined) {
            curR = curR.parent;
        }
        return curR;
    }
    // depth
    get depth() {
        let curR = this;
        let deep = 0;
        while (curR !== undefined && curR.parent !== undefined) {
            curR = curR.parent;
            deep++;
        }
        return deep;
    }
    // getChildAt 通过索引获取子节点
    getChildAt(index) {
        if (this._children === undefined) {
            return undefined;
        }
        if (index < 0 || index >= this._children.length) {
            return undefined;
        }
        return this._children[index];
    }
    // hasChild 判断当前节点是否含有子节点
    hasChild() {
        return this._children !== undefined && this._children.length > 0;
    }
    // isDescendantOf 判断要添加的子节点是否为当前节点的祖先节点
    isDescendantOf(ancestor) {
        if (ancestor === undefined) {
            return false;
        }
        for (let node = this._parent; node !== undefined; node = node._parent) {
            if (node === ancestor) {
                return true;
            }
        }
        return false;
    }
    // removeChildAt 根据索引删除某个节点
    removeChildAt(index) {
        if (this._children === undefined) {
            return undefined;
        }
        let child = this.getChildAt(index);
        if (child === undefined) {
            return undefined;
        }
        // 将目标节点从树中删除, 并将目标节点父节点设为 undefined
        this._children.splice(index, 1);
        child._parent = undefined;
        return child;
    }
    // removeChild 根据节点删除某个节点
    removeChild(child) {
        if (child === undefined) {
            return undefined;
        }
        if (this._children === undefined) {
            return undefined;
        }
        let findChild = undefined;
        for (let i = 0; i < this._children.length; i++) {
            if (this._children[i] === child) {
                this._children.splice(i, 1);
                this._parent = undefined;
                findChild = this._children[i];
                break;
            }
        }
        return findChild;
    }
    // remove 将当前节点从父节点中删除
    remove() {
        if (this._parent !== undefined) {
            return this._parent.removeChild(this);
        }
        return undefined;
    }
    // addChildAt 添加子节点
    addChildAt(child, index) {
        // 判断 child 是否为当前节点祖先节点
        if (this.isDescendantOf(child)) {
            return undefined;
        }
        if (this._children === undefined) {
            this._children = new Array();
        }
        if (index >= 0 && index <= this._children.length) {
            // child 存在父节点
            if (child._parent !== undefined) {
                child._parent.removeChild(child);
            }
            // 直接添加
            child._parent = this;
            this._children.splice(index, 0, child);
            return child;
        }
        return undefined;
    }
    // addChild 添加子节点
    addChild(child) {
        if (this._children === undefined) {
            this._children = new Array();
        }
        return this.addChildAt(child, this._children.length);
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
