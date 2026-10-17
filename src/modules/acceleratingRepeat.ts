const holdDelay = 400
const initialInterval = 240
const minimumInterval = 40

/** Trigger once immediately, then repeat faster while the press remains active. */
export function createAcceleratingRepeat(action: () => void) {
  let timer: ReturnType<typeof setTimeout> | undefined
  let generation = 0

  function stop() {
    generation++
    if (timer !== undefined)
      clearTimeout(timer)
    timer = undefined
  }

  function start() {
    stop()
    const currentGeneration = generation
    const startedAt = Date.now()

    function repeat() {
      if (currentGeneration !== generation)
        return

      action()
      if (currentGeneration !== generation)
        return

      const elapsed = Date.now() - startedAt
      const interval = Math.max(minimumInterval, Math.round(initialInterval * 0.65 ** (elapsed / 800)))
      timer = setTimeout(repeat, interval)
    }

    action()
    if (currentGeneration === generation)
      timer = setTimeout(repeat, holdDelay)
  }

  return { start, stop }
}
