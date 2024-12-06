export class CacheKeyHelper {
    static generateKey(method: string, path: string, id?: number | string): string {
      return `${method}:${path}${id ? `:${id}` : ''}`;
    }
  }
  