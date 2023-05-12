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
 * @类 ListNode
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
 * 类 List
 * 双向循环链表
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
