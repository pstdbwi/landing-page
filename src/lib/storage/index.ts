import { storageFactory } from './storage'

export const local = storageFactory(() => localStorage)
export const session = storageFactory(() => sessionStorage)
