import type { IPortals } from './interface'

/** Remove the entrance digit and add it at the exit, including cascading carries. */
export function applyPortals(value: number, portals?: IPortals): number {
  if (!portals || !Number.isSafeInteger(value))
    return value

  const { entrance, exit } = portals
  // The entrance must be to the left of the exit so repeated transfers terminate.
  if (!Number.isInteger(entrance) || !Number.isInteger(exit) || exit < 0 || entrance <= exit || entrance > 15)
    return Number.NaN

  const entrancePlace = 10 ** entrance
  const exitPlace = 10 ** exit
  let magnitude = Math.abs(value)
  while (magnitude >= entrancePlace) {
    const digit = Math.floor(magnitude / entrancePlace) % 10
    const higherDigits = Math.floor(magnitude / (entrancePlace * 10))
    magnitude = higherDigits * entrancePlace + magnitude % entrancePlace + digit * exitPlace
  }

  return value < 0 ? -magnitude : magnitude
}
