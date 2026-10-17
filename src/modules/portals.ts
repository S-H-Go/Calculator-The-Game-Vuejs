import type { IPortals } from './interface'

/** Each result is one digit transfer, so animation can display cascading carries. */
export function getPortalTransfers(value: number, portals?: IPortals): number[] {
  if (!portals || !Number.isSafeInteger(value))
    return []

  const { entrance, exit } = portals
  // The entrance must be to the left of the exit so repeated transfers terminate.
  if (!Number.isInteger(entrance) || !Number.isInteger(exit) || exit < 0 || entrance <= exit || entrance > 15)
    return [Number.NaN]

  const entrancePlace = 10 ** entrance
  const exitPlace = 10 ** exit
  let magnitude = Math.abs(value)
  const transfers: number[] = []
  while (magnitude >= entrancePlace) {
    const digit = Math.floor(magnitude / entrancePlace) % 10
    const higherDigits = Math.floor(magnitude / (entrancePlace * 10))
    magnitude = higherDigits * entrancePlace + magnitude % entrancePlace + digit * exitPlace
    transfers.push(value < 0 ? -magnitude : magnitude)
  }

  return transfers
}

/** Remove entrance digits and add them at the exit, including cascading carries. */
export function applyPortals(value: number, portals?: IPortals): number {
  const transfers = getPortalTransfers(value, portals)
  return transfers.length ? transfers[transfers.length - 1] : value
}
