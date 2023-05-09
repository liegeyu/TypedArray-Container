// TypedArrayList
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

  // get 方法
  public get(index: number): number {
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
