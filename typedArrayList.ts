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
export class TypedArrayList<T extends Uint16Array | Uint8Array | Float32Array> {
  private _array: T;
  private _typedArrayConstructor: new (length: number) => T;
  private _length: number;
  private _capacity: number;

  public constructor(
    typedArrayConstructor: new (capacity: number) => T,
    capacity: number = 8
  ) {
    this._typedArrayConstructor = typedArrayConstructor;
    this._capacity = capacity;

    if (this._capacity === 0) {
      this._capacity = 8;
    }
    this._array = new this._typedArrayConstructor(this._capacity);
    this._length = 0;
  }

  public get length(): number {
    return this._length;
  }

  public get capacity(): number {
    return this._capacity;
  }

  public get typedArray(): T {
    return this._array;
  }

  // 扩容 callback
  public capacityChangedCallback:
    | ((arrayList: TypedArrayList<T>) => void)
    | null = null;

  // clear 方法
  public clear(): void {
    this._length = 0;
  }

  // find 方法
  public find(index: number): number {
    if (index < 0 || index >= this._length) {
      throw new Error("index overshoot!");
    }

    return this._array[index];
  }

  // push 方法
  public push(num: number): number {
    // length > capacity 扩容
    if (this._length >= this._capacity) {
      if (this._capacity > 0) {
        this._capacity += this._capacity;
      }

      let oldArray: T = this._array;
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
  public subArray(start: number = 0, end: number = this._length): T {
    return this._array.subarray(start, end) as T;
  }

  // slice 方法
  public slice(start: number = 0, end: number = this._length): T {
    return this._array.slice(start, end) as T;
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
export class Dictionary<T> {
  private _items: { [key: string]: T } | Map<string, T>;
  private _count: number = 0;

  public constructor(useMap: boolean = true) {
    if (useMap) {
      this._items = new Map<string, T>();
    } else {
      this._items = {};
    }
  }

  public get length(): number {
    return this._count;
  }

  public get keys(): string[] {
    let keys: string[] = [];

    if (this._items instanceof Map) {
      let keyArr = this._items.keys();
      for (let key of keyArr) {
        keys.push(key);
      }
    } else {
      for (let prop in this._items) {
        if (this._items.hasOwnProperty(prop)) {
          keys.push(prop);
        }
      }
    }

    return keys;
  }

  public get values(): T[] {
    let values: T[] = [];

    if (this._items instanceof Map) {
      let valArr = this._items.values();
      for (let val of valArr) {
        values.push(val);
      }
    } else {
      for (let prop in this._items) {
        if (this._items.hasOwnProperty(prop)) {
          values.push(this._items[prop]);
        }
      }
    }

    return values;
  }

  // 判断 key 是否存在
  public contains(key: string): boolean {
    if (this._items instanceof Map) {
      return this._items.has(key);
    } else {
      return this._items[key] !== undefined;
    }
  }

  // 查询值
  public find(key: string): T | undefined {
    if (this._items instanceof Map) {
      return this._items.get(key);
    } else {
      return this._items[key];
    }
  }

  // 插入一个键值对
  public insert(key: string, value: T): void {
    if (this._items instanceof Map) {
      this._items.set(key, value);
    } else {
      this._items[key] = value;
    }

    this._count++;
  }

  // 删除
  public remove(key: string): boolean {
    const ret = this.find(key);
    if (ret === undefined) {
      return false;
    }

    if (this._items instanceof Map) {
      this._items.delete(key);
    } else {
      delete this._items[key];
    }

    this._count--;
    return false;
  }

  // toString 方法
  public toString(): string {
    return JSON.stringify(this._items as Map<string, T>);
  }
}

/**
 * @class ListNode
 * 双向循环链表节点
 */
export class ListNode<T> {
  public next: ListNode<T> | null;
  public prev: ListNode<T> | null;
  public data: T | undefined;

  public constructor(data: T | undefined = undefined) {
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
export class List<T> {
  private _headNode: ListNode<T>;
  private _length: number;

  public constructor() {
    this._headNode = new ListNode<T>();
    this._headNode.next = this._headNode;
    this._headNode.prev = this._headNode;
    this._length = 0;
  }

  // 获取 List 的长度
  public get length(): number {
    return this._length;
  }

  // 判断是否为空链表
  public empty(): boolean {
    return this._headNode.next === this._headNode;
  }

  public begin(): ListNode<T> {
    if (this._headNode.next === null) {
      throw new Error("头节点");
    }

    return this._headNode.next;
  }

  public end(): ListNode<T> {
    return this._headNode;
  }

  // 查询是否存在某值
  public contains(data: T): boolean {
    for (
      let node: ListNode<T> | null = this._headNode.next;
      node !== null && node !== this._headNode;
      node = node.next
    ) {
      if (node.data !== undefined) {
        if (data === node.data) {
          return true;
        }
      }
    }

    return false;
  }

  // 插入
  public insert(node: ListNode<T>, data: T): number {
    let ret = new ListNode<T>(data);
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
  public remove(node: ListNode<T>): ListNode<T> {
    let ret: ListNode<T> | null = node;
    let next: ListNode<T> | null = node.next;
    let prev: ListNode<T> | null = node.prev;

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
  public push(data: T): void {
    this.insert(this.end(), data);
  }

  // pop 方法
  public pop(): T | undefined {
    let prev: ListNode<T> | null = this.end().prev;

    if (prev !== null) {
      let ret: T | null = prev.data;
      this.remove(prev);
      return ret;
    }

    return undefined;
  }

  // unshift 方法
  public unshift(data: T): void {
    this.insert(this.begin(), data);
  }

  // shift 方法
  public shift(): T | undefined {
    let ret: T | undefined = this.begin().data;
    this.remove(this.begin());

    return ret;
  }

  // next 遍历并执行回调
  public forNext(cb: (data: T) => void): void {
    for (
      let node: ListNode<T> | null = this._headNode.next;
      node !== null && node !== this._headNode;
      node = node.next
    ) {
      if (node.data !== undefined) {
        cb(node.data);
      }
    }
  }

  // prev 遍历并执行回调
  public forPrev(cb: (data: T) => void): void {
    for (
      let node: ListNode<T> | null = this._headNode.next;
      node !== null && node !== this._headNode;
      node = node.prev
    ) {
      if (node.data !== undefined) {
        cb(node.data);
      }
    }
  }
}

/**
 * @interface IAdapter
 * 接口, 统一栈和队列的方法和属性
 * @variation length: number;
 * @variation isEmpty: boolean;
 * @variation add(data: T): void;
 * @variation remove(): T | undefined;
 * @variation clear(): void;
 */
export interface IAdapter<T> {
  length: number;
  isEmpty: boolean;
  add(data: T): void;
  remove(): T | undefined;
  clear(): void;
}

/**
 * @class AdapterBase
 * 抽象基类。栈与队列有两种类型可选 List<T> 类型或者 Array<T> 类型; 实现队列和栈的共有操作; 将不同操作 remove 交给具体栈和队列自己实现;
 */
export abstract class AdapterBase<T> implements IAdapter<T> {
  protected _arr: Array<T> | List<T>;

  public constructor(useList: boolean = true) {
    if (useList) {
      this._arr = new List<T>();
    } else {
      this._arr = new Array<T>();
    }
  }

  // length
  public get length(): number {
    return this._arr.length;
  }

  // isEmpty
  public get isEmpty(): boolean {
    return this._arr.length === 0;
  }

  // add 方法
  public add(data: T): void {
    this._arr.push(data);
  }

  // clear 方法
  public clear(): void {
    if (this._arr instanceof List) {
      this._arr = new List<T>();
    } else {
      this._arr = new Array<T>();
    }
  }

  // remove 方法, 栈与队列 remove 方法不同
  public abstract remove(): T | undefined;
}

/**
 * @class Stack extends AdapterBase
 * 栈
 * @function remove
 */
export class Stack<T> extends AdapterBase<T> {
  public remove(): T | undefined {
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
export class Queue<T> extends AdapterBase<T> {
  public remove(): T | undefined {
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
export class TreeNode<T> {
  private _parent: TreeNode<T> | undefined;
  private _children: Array<TreeNode<T>> | undefined;

  public name: string;
  public data: T | undefined;

  public constructor(
    data: T | undefined = undefined,
    parent: TreeNode<T> | undefined = undefined,
    name: string = ""
  ) {
    this._parent = parent;
    this._children = undefined;
    this.name = name;
    this.data = data;

    if (this._parent !== undefined) {
      this._parent.addChild(this);
    }
  }

  // parent
  public get parent(): TreeNode<T> | undefined {
    return this._parent;
  }

  // childCount
  public get childCount(): number {
    if (this._children !== undefined) {
      return this._children.length;
    } else {
      return 0;
    }
  }

  // root
  public get root(): TreeNode<T> | undefined {
    let curR: TreeNode<T> | undefined = this;
    while (curR !== undefined && curR.parent !== undefined) {
      curR = curR.parent;
    }

    return curR;
  }

  // depth
  public get depth(): number {
    let curR: TreeNode<T> | undefined = this;
    let deep: number = 0;
    while (curR !== undefined && curR.parent !== undefined) {
      curR = curR.parent;
      deep++;
    }

    return deep;
  }

  // getChildAt 通过索引获取子节点
  public getChildAt(index: number): TreeNode<T> | undefined {
    if (this._children === undefined) {
      return undefined;
    }
    if (index < 0 || index >= this._children.length) {
      return undefined;
    }

    return this._children[index];
  }

  // hasChild 判断当前节点是否含有子节点
  public hasChild(): boolean {
    return this._children !== undefined && this._children.length > 0;
  }

  // isDescendantOf 判断要添加的子节点是否为当前节点的祖先节点
  public isDescendantOf(ancestor: TreeNode<T> | undefined): boolean {
    if (ancestor === undefined) {
      return false;
    }

    for (
      let node: TreeNode<T> | undefined = this._parent;
      node !== undefined;
      node = node._parent
    ) {
      if (node === ancestor) {
        return true;
      }
    }

    return false;
  }

  // removeChildAt 根据索引删除某个节点
  public removeChildAt(index: number): TreeNode<T> | undefined {
    if (this._children === undefined) {
      return undefined;
    }

    let child: TreeNode<T> | undefined = this.getChildAt(index);
    if (child === undefined) {
      return undefined;
    }

    // 将目标节点从树中删除, 并将目标节点父节点设为 undefined
    this._children.splice(index, 1);
    child._parent = undefined;

    return child;
  }

  // removeChild 根据节点删除某个节点
  public removeChild(child: TreeNode<T> | undefined): TreeNode<T> | undefined {
    if (child === undefined) {
      return undefined;
    }
    if (this._children === undefined) {
      return undefined;
    }

    let findChild: TreeNode<T> | undefined = undefined;
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
  public remove(): TreeNode<T> | undefined {
    if (this._parent !== undefined) {
      return this._parent.removeChild(this);
    }

    return undefined;
  }

  // addChildAt 添加子节点
  public addChildAt(
    child: TreeNode<T>,
    index: number
  ): TreeNode<T> | undefined {
    // 判断 child 是否为当前节点祖先节点
    if (this.isDescendantOf(child)) {
      return undefined;
    }

    if (this._children === undefined) {
      this._children = new Array<TreeNode<T>>();
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
  public addChild(child: TreeNode<T>): TreeNode<T> | undefined {
    if (this._children === undefined) {
      this._children = new Array<TreeNode<T>>();
    }

    return this.addChildAt(child, this._children.length);
  }

  // 层次化输出
  public repeatString(target: string, num: number): string {
    let strRes: string = "";
    for (let i = 0; i < num; i++) {
      strRes += target;
    }
    return strRes;
  }
}

/**
 * @interface IEnumberator
 * 树结构枚举器
 */
export interface IEnumberator<T> {
  // 迭代器重置到初始位置
  reset(): void;
  // 越界, moveNext 返回 false, 否则将 current 设置为下一位元素返回 true
  moveNext(): boolean;
  // 获取当前元素
  readonly current: T | undefined;
}

export type Indexer = (len: number, index: number) => number;

export function IndexerL2R(len: number, index: number): number {
  return index;
}

export function IndexerR2L(len: number, index: number): number {
  return len - index - 1;
}

/**
 * @class NodeT2BEnumerator
 * 先序遍历枚举器
 */
export class NodeT2BEnumerator<
  T,
  IndexFun extends Indexer,
  Adapter extends IAdapter<TreeNode<T>>
> implements IEnumberator<TreeNode<T>>
{
  // 根节点
  private _node: TreeNode<T> | undefined;
  // 队列或栈的适配器，用来遍历元素，指向泛型参数
  private _adapter: IAdapter<TreeNode<T>>;
  // 当前节点
  private _curNode: TreeNode<T> | undefined;
  // 当前indexer, 用于确认遍历方向
  private _indexer: IndexFun;

  public constructor(
    node: TreeNode<T> | undefined,
    func: IndexFun,
    adapter: new () => Adapter
  ) {
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

  public get current(): TreeNode<T> | undefined {
    return this._curNode;
  }

  public reset(): void {
    if (this._node === undefined) {
      return;
    }

    this._curNode = undefined;
    this._adapter.clear();
    this._adapter.add(this._node);
  }

  public moveNext(): boolean {
    // 当队列或者栈为空时，返回 false
    if (this._adapter.isEmpty) {
      return false;
    }
    // 弹出头或者尾部元素
    this._curNode = this._adapter.remove();
    if (this._curNode !== undefined) {
      // 获取当前节点子节点个数
      let len: number = this._curNode.childCount;

      for (let i = 0; i < len; i++) {
        let childIndex: number = this._indexer(len, i);
        let child: TreeNode<T> | undefined =
          this._curNode.getChildAt(childIndex);

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
export class NodeB2TEnumerator<T> implements IEnumberator<TreeNode<T>> {
  // 枚举器接口
  private _iter: IEnumberator<TreeNode<T>>;
  private _arr: Array<TreeNode<T>> | undefined;
  // 当前数组索引
  private _arrIndex: number;

  public constructor(iter: IEnumberator<TreeNode<T>>) {
    this._iter = iter; // 指向先序遍历迭代器
    this.reset();
  }

  public get current(): TreeNode<T> | undefined {
    if (this._arrIndex >= this._arr.length) {
      return undefined;
    }

    return this._arr[this._arrIndex];
  }

  public reset(): void {
    this._arr = [];
    while (this._iter.moveNext()) {
      this._arr.push(this._iter.current);
    }

    this._arrIndex = this._arr.length;
  }

  public moveNext(): boolean {
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
  public static createDfL2RT2BIter<T>(
    node: TreeNode<T> | undefined
  ): IEnumberator<TreeNode<T>> {
    let iter: IEnumberator<TreeNode<T>> = new NodeT2BEnumerator(
      node,
      IndexerR2L,
      Stack
    );
    return iter;
  }

  // 先序遍历 深搜 stack, 从右往左 IndexerL2R, 从上到下
  public static createDfR2LT2BIter<T>(
    node: TreeNode<T> | undefined
  ): IEnumberator<TreeNode<T>> {
    let iter: IEnumberator<TreeNode<T>> = new NodeT2BEnumerator(
      node,
      IndexerL2R,
      Stack
    );
    return iter;
  }

  // 先序遍历 宽搜 Queue, 从左往右 IndexerL2R, 从上到下
  public static createBfL2RT2BIter<T>(
    node: TreeNode<T> | undefined
  ): IEnumberator<TreeNode<T>> {
    let iter: IEnumberator<TreeNode<T>> = new NodeT2BEnumerator(
      node,
      IndexerL2R,
      Queue
    );
    return iter;
  }

  // 先序遍历 宽搜 Queue, 从右往左 IndexerR2L, 从上到下
  public static createBfR2LT2BIter<T>(
    node: TreeNode<T> | undefined
  ): IEnumberator<TreeNode<T>> {
    let iter: IEnumberator<TreeNode<T>> = new NodeT2BEnumerator(
      node,
      IndexerR2L,
      Queue
    );
    return iter;
  }

  // 后序遍历 深搜 stack, 从左到右 从下到上
  public static createDfL2RB2TIter<T>(
    node: TreeNode<T> | undefined
  ): IEnumberator<TreeNode<T>> {
    let iter: IEnumberator<TreeNode<T>> = new NodeB2TEnumerator<T>(
      NodeEnumeratorFactory.createDfR2LT2BIter(node)
    );
    return iter;
  }

  // 后序遍历 深搜 stack, 从右到左 从下到上
  public static createDfR2LB2TIter<T>(
    node: TreeNode<T> | undefined
  ): IEnumberator<TreeNode<T>> {
    let iter: IEnumberator<TreeNode<T>> = new NodeB2TEnumerator<T>(
      NodeEnumeratorFactory.createDfL2RT2BIter(node)
    );
    return iter;
  }

  // 后序遍历 宽搜 queue, 从左到右 从下到上
  public static createBfL2RB2TIter<T>(
    node: TreeNode<T> | undefined
  ): IEnumberator<TreeNode<T>> {
    let iter: IEnumberator<TreeNode<T>> = new NodeB2TEnumerator<T>(
      NodeEnumeratorFactory.createBfR2LT2BIter(node)
    );
    return iter;
  }

  // 后序遍历 宽搜 queue, 从右到左 从下到上
  public static createBfR2LB2TIter<T>(
    node: TreeNode<T> | undefined
  ): IEnumberator<TreeNode<T>> {
    let iter: IEnumberator<TreeNode<T>> = new NodeB2TEnumerator<T>(
      NodeEnumeratorFactory.createBfL2RT2BIter(node)
    );
    return iter;
  }
}

/**
 * 用例 ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓
 */

// init TypedArrayList
let fload32ArrayList: TypedArrayList<Float32Array> = new TypedArrayList(
  Float32Array
);
let uint16Array: TypedArrayList<Uint16Array> = new TypedArrayList(Uint16Array);
console.log("old", fload32ArrayList);

// testSubarray
function testSubarray(subarray: boolean): void {
  let f32arr: Uint16Array = new Uint16Array([0, 1, 2, 3, 4]);
  let subrange: Uint16Array;

  if (subarray === true) {
    subrange = f32arr.subarray(1, 3);
  } else {
    subrange = f32arr.slice(1, 3);
  }

  console.log("共享一个ArrayBuffer数据源", f32arr.buffer === subrange.buffer);
}

testSubarray(true);
testSubarray(false);

// Dictionary
let dict: Dictionary<string> = new Dictionary(false);
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
class NumberNode extends TreeNode<number> {}
export class TreeNodeTest {
  public static createTree(): NumberNode {
    let root: NumberNode = new NumberNode(0, undefined, "root");
    let node1: NumberNode = new NumberNode(1, root, "node1");
    let node2: NumberNode = new NumberNode(2, root, "node2");
    let node3: NumberNode = new NumberNode(3, root, "node3");
    let node4: NumberNode = new NumberNode(4, node1, "node4");
    let node5: NumberNode = new NumberNode(5, node1, "node5");
    let node6: NumberNode = new NumberNode(6, node2, "node6");
    let node7: NumberNode = new NumberNode(7, node2, "node7");
    let node8: NumberNode = new NumberNode(8, node3, "node8");
    let node9: NumberNode = new NumberNode(9, node4, "node9");
    let node10: NumberNode = new NumberNode(10, node6, "node10");
    let node11: NumberNode = new NumberNode(11, node7, "node11");
    let node12: NumberNode = new NumberNode(12, node11, "node12");

    return root;
  }

  public static outputNodesInfo(iter: IEnumberator<TreeNode<number>>): string {
    let output: string[] = [];
    let current: TreeNode<number> | undefined = undefined;
    while (iter.moveNext()) {
      current = iter.current;

      if (current !== undefined) {
        output.push(current.name);
      }
    }
    return "实际输出: [" + output.join(",") + "]";
  }
}

let root: NumberNode = TreeNodeTest.createTree();
let iter: IEnumberator<TreeNode<number>>;
let current: TreeNode<number> | undefined = undefined;

iter = NodeEnumeratorFactory.createDfL2RT2BIter<number>(root);
// while (iter.moveNext()) {
//   current = iter.current;
//   if (current !== undefined) {
//     console.log(current.repeatString(" ", current.depth * 4) + current.name);
//   }
// }
console.log(
  "1: 先序遍历 深搜 stack, 从左往右 从上到下",
  TreeNodeTest.outputNodesInfo(iter)
);

iter = NodeEnumeratorFactory.createDfR2LT2BIter<number>(root);
console.log(
  "2: 先序遍历 深搜 stack, 从右往左 从上到下",
  TreeNodeTest.outputNodesInfo(iter)
);

iter = NodeEnumeratorFactory.createDfL2RB2TIter<number>(root);
console.log(
  "3: 后序遍历 深搜 stack, 从左到右 从下到上",
  TreeNodeTest.outputNodesInfo(iter)
);

iter = NodeEnumeratorFactory.createDfR2LB2TIter<number>(root);
console.log(
  "4: 后序遍历 深搜 stack, 从右到左 从下到上",
  TreeNodeTest.outputNodesInfo(iter)
);

iter = NodeEnumeratorFactory.createBfL2RT2BIter<number>(root);
console.log(
  "5: 先序遍历 宽搜 Queue, 从左往右 从上到下",
  TreeNodeTest.outputNodesInfo(iter)
);

iter = NodeEnumeratorFactory.createBfR2LT2BIter<number>(root);
console.log(
  "6: 先序遍历 宽搜 Queue, 从右往左 从上到下",
  TreeNodeTest.outputNodesInfo(iter)
);

iter = NodeEnumeratorFactory.createBfL2RB2TIter<number>(root);
console.log(
  "7: 后序遍历 宽搜 queue, 从左到右 从下到上",
  TreeNodeTest.outputNodesInfo(iter)
);

iter = NodeEnumeratorFactory.createBfR2LB2TIter<number>(root);
console.log(
  "8: 后序遍历 宽搜 queue, 从右到左 从下到上",
  TreeNodeTest.outputNodesInfo(iter)
);
