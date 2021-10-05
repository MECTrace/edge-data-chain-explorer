import {Link} from "react-router-dom"
import React from "react"

const ONEAMO = 1000000000000000000
const UNITS = ['', 'K', 'M', 'G', 'T']

function shorten(mote: number | string) {
  let amo = (mote as number) / ONEAMO

  let idx = 0
  while (amo >= 1000 && idx < 4) {
    idx++
    amo /= 1000
  }

  return [amo, idx]
}

export function displayAMO(mote: number | string) {
  const [amo, idx] = shorten(mote)
  return `${Number(amo.toFixed(2)).toLocaleString()} ${UNITS[idx]} AMO`
}

export function displayAMOLong(mote: string) {
  const amo = Number(mote) / ONEAMO
  return `${amo.toLocaleString()} AMO (${mote} mote)`
}

export function displayResult(info: string) {
  if (info === 'ok') {
    return `✔️ Success`
  } else {
    return `❌ ${info}`
  }
}

export function displayAddress(address: string, chainId: string) {
  return (
    <Link to={`/${chainId}/inspect/account/${address}`}>
      <code>{address}</code>
    </Link>
  )
}

export function displayMono(text: string) {
  return (
    <code>{text}</code>
  )
}
