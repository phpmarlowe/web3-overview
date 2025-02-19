/**
 * localStorage / sessionStorage 增/删/改/查工具
 */
class GableStorage {
  #storage: any
  #prefix: string
  #mode: string

  constructor(storage: any) {
    this.#storage = storage
    this.#prefix = import.meta.env.GABLE_APP_VERSION
    this.#mode = import.meta.env.MODE
  }

  #getKey(key: any) {
    console.log(`${key}_${this.#prefix}`.toUpperCase())
    return `${this.#mode}__${key}__${this.#prefix}`.toUpperCase()
  }

  /**
   * 存储
   * @param key
   * @param value
   */
  set(key: any, value: any) {
    this.#storage.setItem(this.#getKey(key), JSON.stringify(value))
  }

  /**
   * 读取
   *
   * @param key
   */
  get(key: any) {
    try {
      const value = this.#storage.getItem(this.#getKey(key))
      return JSON.parse(value)
    } catch (e) {
      return null
    }
  }

  /**
   * 删除指定名称的数据
   *
   * @param key
   */
  remove(key: any) {
    this.#storage.removeItem(this.#getKey(key))
  }

  /**
   * 删除所有存储的数据
   */
  clear() {
    this.#storage.clear()
  }
}

// SessionStorage
export const sessionGableStorage = new GableStorage(sessionStorage)

// LocalStorage
const gableStorage = new GableStorage(localStorage)
export default gableStorage
