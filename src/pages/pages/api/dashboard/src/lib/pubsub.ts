type Callback = (payload?: any) => void
const listeners = new Map<string, Callback[]>()

export const on = (event: string, cb: Callback) =>
  listeners.set(event, [...(listeners.get(event) || []), cb])

export const emit = (event: string, payload?: any) =>
  (listeners.get(event) || []).forEach(cb => cb(payload))
