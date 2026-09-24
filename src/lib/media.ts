// One video at a time. Anything that starts playing registers here and pauses the rest.
const listeners = new Set<(owner: string) => void>()

export const mediaBus = {
  claim(owner: string) {
    listeners.forEach((fn) => fn(owner))
  },
  subscribe(fn: (owner: string) => void) {
    listeners.add(fn)
    return () => {
      listeners.delete(fn)
    }
  },
}

// Sound preference is shared: once someone unmutes a reel, the next one they open has sound too.
let soundOn = false
const soundListeners = new Set<(on: boolean) => void>()

export const sound = {
  get: () => soundOn,
  set(on: boolean) {
    soundOn = on
    soundListeners.forEach((fn) => fn(on))
  },
  subscribe(fn: (on: boolean) => void) {
    soundListeners.add(fn)
    return () => {
      soundListeners.delete(fn)
    }
  },
}
