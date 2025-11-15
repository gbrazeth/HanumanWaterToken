// Polyfills para ambiente servidor
if (typeof globalThis !== 'undefined') {
  // Polyfill para indexedDB no servidor
  if (typeof globalThis.indexedDB === 'undefined') {
    globalThis.indexedDB = {
      open: () => ({
        addEventListener: () => {},
        removeEventListener: () => {},
        result: {
          createObjectStore: () => ({}),
          transaction: () => ({
            objectStore: () => ({
              add: () => ({ addEventListener: () => {} }),
              get: () => ({ addEventListener: () => {} }),
              put: () => ({ addEventListener: () => {} }),
              delete: () => ({ addEventListener: () => {} }),
            }),
          }),
        },
      }),
      deleteDatabase: () => ({ addEventListener: () => {} }),
    } as any;
  }

  // Polyfill para IDBKeyRange no servidor
  if (typeof globalThis.IDBKeyRange === 'undefined') {
    globalThis.IDBKeyRange = {
      bound: () => ({}),
      only: () => ({}),
      lowerBound: () => ({}),
      upperBound: () => ({}),
    } as any;
  }

  // Polyfill para localStorage no servidor
  if (typeof globalThis.localStorage === 'undefined') {
    globalThis.localStorage = {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      length: 0,
      key: () => null,
    } as any;
  }

  // Polyfill para sessionStorage no servidor
  if (typeof globalThis.sessionStorage === 'undefined') {
    globalThis.sessionStorage = {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      length: 0,
      key: () => null,
    } as any;
  }
}

export {};
