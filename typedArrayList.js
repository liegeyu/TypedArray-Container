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
            return this._arr.pop();
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
    // 层次化输出
    repeatString(target, num) {
        let strRes = "";
        for (let i = 0; i < num; i++) {
            strRes += target;
        }
        return strRes;
    }
}
export function IndexerL2R(len, index) {
    return index;
}
export function IndexerR2L(len, index) {
    return len - index - 1;
}
/**
 * @class NodeT2BEnumerator
 * 先序遍历枚举器
 */
export class NodeT2BEnumerator {
    constructor(node, func, adapter) {
        // 根节点必须存在
        if (node === undefined) {
            return;
        }
        this._node = node;
        this._indexer = func;
        this._adapter = new adapter();
        this._curNode = undefined;
        this._adapter.add(this._node);
    }
    get current() {
        return this._curNode;
    }
    reset() {
        if (this._node === undefined) {
            return;
        }
        this._curNode = undefined;
        this._adapter.clear();
        this._adapter.add(this._node);
    }
    moveNext() {
        // 当队列或者栈为空时，返回 false
        if (this._adapter.isEmpty) {
            return false;
        }
        // 弹出头或者尾部元素
        this._curNode = this._adapter.remove();
        if (this._curNode !== undefined) {
            // 获取当前节点子节点个数
            let len = this._curNode.childCount;
            for (let i = 0; i < len; i++) {
                let childIndex = this._indexer(len, i);
                let child = this._curNode.getChildAt(childIndex);
                if (child !== undefined) {
                    this._adapter.add(child);
                }
            }
        }
        return true;
    }
}
/**
 * @clss NodeB2TEnumerator
 * 后序遍历枚举器
 */
export class NodeB2TEnumerator {
    constructor(iter) {
        this._iter = iter; // 指向先序遍历迭代器
        this.reset();
    }
    get current() {
        if (this._arrIndex >= this._arr.length) {
            return undefined;
        }
        return this._arr[this._arrIndex];
    }
    reset() {
        this._arr = [];
        while (this._iter.moveNext()) {
            this._arr.push(this._iter.current);
        }
        this._arrIndex = this._arr.length;
    }
    moveNext() {
        this._arrIndex--;
        return this._arrIndex >= 0 && this._arrIndex < this._arr.length;
    }
}
/**
 * @class NodeEnumeratorFactory
 * 使用树的遍历枚举器
 * @function createDfL2RT2BIter 先序遍历 深搜 stack, 从左往右 IndexerR2L, 从上到下
 * @function createDfR2LT2BIter 先序遍历 深搜 stack, 从右往左 IndexerL2R, 从上到下
 * @function createBfL2RT2BIter 先序遍历 宽搜 Queue, 从左往右 IndexerL2R, 从上到下
 * @function createBfR2LT2BIter 先序遍历 宽搜 Queue, 从右往左 IndexerR2L, 从上到下
 * @function createDfL2RB2TIter 后序遍历 深搜 stack, 从左到右 从下到上
 * @function createDfR2LB2TIter 后序遍历 深搜 stack, 从右到左 从下到上
 * @function createBfL2RB2TIter 后序遍历 宽搜 queue, 从左到右 从下到上
 * @function createBfR2LB2TIter 后序遍历 宽搜 queue, 从右到左 从下到上
 */
export class NodeEnumeratorFactory {
    // 先序遍历 深搜 stack, 从左往右 IndexerR2L, 从上到下
    static createDfL2RT2BIter(node) {
        let iter = new NodeT2BEnumerator(node, IndexerR2L, Stack);
        return iter;
    }
    // 先序遍历 深搜 stack, 从右往左 IndexerL2R, 从上到下
    static createDfR2LT2BIter(node) {
        let iter = new NodeT2BEnumerator(node, IndexerL2R, Stack);
        return iter;
    }
    // 先序遍历 宽搜 Queue, 从左往右 IndexerL2R, 从上到下
    static createBfL2RT2BIter(node) {
        let iter = new NodeT2BEnumerator(node, IndexerL2R, Queue);
        return iter;
    }
    // 先序遍历 宽搜 Queue, 从右往左 IndexerR2L, 从上到下
    static createBfR2LT2BIter(node) {
        let iter = new NodeT2BEnumerator(node, IndexerR2L, Queue);
        return iter;
    }
    // 后序遍历 深搜 stack, 从左到右 从下到上
    static createDfL2RB2TIter(node) {
        let iter = new NodeB2TEnumerator(NodeEnumeratorFactory.createDfR2LT2BIter(node));
        return iter;
    }
    // 后序遍历 深搜 stack, 从右到左 从下到上
    static createDfR2LB2TIter(node) {
        let iter = new NodeB2TEnumerator(NodeEnumeratorFactory.createDfL2RT2BIter(node));
        return iter;
    }
    // 后序遍历 宽搜 queue, 从左到右 从下到上
    static createBfL2RB2TIter(node) {
        let iter = new NodeB2TEnumerator(NodeEnumeratorFactory.createBfR2LT2BIter(node));
        return iter;
    }
    // 后序遍历 宽搜 queue, 从右到左 从下到上
    static createBfR2LB2TIter(node) {
        let iter = new NodeB2TEnumerator(NodeEnumeratorFactory.createBfL2RT2BIter(node));
        return iter;
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
// 测试树结构迭代器
// let root: TreeNode<number> = new TreeNode<number>(0, undefined, "root");
// let node1: TreeNode<number> = new TreeNode<number>(1, root, "node1");
// let node2: TreeNode<number> = new TreeNode<number>(2, root, "node2");
// 测试 class
class NumberNode extends TreeNode {
}
export class TreeNodeTest {
    static createTree() {
        let root = new NumberNode(0, undefined, "root");
        let node1 = new NumberNode(1, root, "node1");
        let node2 = new NumberNode(2, root, "node2");
        let node3 = new NumberNode(3, root, "node3");
        let node4 = new NumberNode(4, node1, "node4");
        let node5 = new NumberNode(5, node1, "node5");
        let node6 = new NumberNode(6, node2, "node6");
        let node7 = new NumberNode(7, node2, "node7");
        let node8 = new NumberNode(8, node3, "node8");
        let node9 = new NumberNode(9, node4, "node9");
        let node10 = new NumberNode(10, node6, "node10");
        let node11 = new NumberNode(11, node7, "node11");
        let node12 = new NumberNode(12, node11, "node12");
        return root;
    }
    static outputNodesInfo(iter) {
        let output = [];
        let current = undefined;
        while (iter.moveNext()) {
            current = iter.current;
            if (current !== undefined) {
                output.push(current.name);
            }
        }
        return "实际输出: [" + output.join(",") + "]";
    }
}
let root = TreeNodeTest.createTree();
let iter;
let current = undefined;
iter = NodeEnumeratorFactory.createDfL2RT2BIter(root);
// while (iter.moveNext()) {
//   current = iter.current;
//   if (current !== undefined) {
//     console.log(current.repeatString(" ", current.depth * 4) + current.name);
//   }
// }
console.log("1: 先序遍历 深搜 stack, 从左往右 从上到下", TreeNodeTest.outputNodesInfo(iter));
iter = NodeEnumeratorFactory.createDfR2LT2BIter(root);
console.log("2: 先序遍历 深搜 stack, 从右往左 从上到下", TreeNodeTest.outputNodesInfo(iter));
iter = NodeEnumeratorFactory.createDfL2RB2TIter(root);
console.log("3: 后序遍历 深搜 stack, 从左到右 从下到上", TreeNodeTest.outputNodesInfo(iter));
iter = NodeEnumeratorFactory.createDfR2LB2TIter(root);
console.log("4: 后序遍历 深搜 stack, 从右到左 从下到上", TreeNodeTest.outputNodesInfo(iter));
iter = NodeEnumeratorFactory.createBfL2RT2BIter(root);
console.log("5: 先序遍历 宽搜 Queue, 从左往右 从上到下", TreeNodeTest.outputNodesInfo(iter));
iter = NodeEnumeratorFactory.createBfR2LT2BIter(root);
console.log("6: 先序遍历 宽搜 Queue, 从右往左 从上到下", TreeNodeTest.outputNodesInfo(iter));
iter = NodeEnumeratorFactory.createBfL2RB2TIter(root);
console.log("7: 后序遍历 宽搜 queue, 从左到右 从下到上", TreeNodeTest.outputNodesInfo(iter));
iter = NodeEnumeratorFactory.createBfR2LB2TIter(root);
console.log("8: 后序遍历 宽搜 queue, 从右到左 从下到上", TreeNodeTest.outputNodesInfo(iter));
