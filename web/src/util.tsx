import {Link} from "react-router-dom"
import React from "react"

const UNIT = 1000000000000000000
const UNITS = ['', 'K', 'M', 'G', 'T']

function convert(mote: number | string) {
  let amo = (mote as number) / UNIT

  let idx = 0
  while (amo >= 1000 && idx < 4) {
    idx++
    amo /= 1000
  }

  return [amo, idx]
}

export function displayAMO(mote: number | string) {
  const [amo, idx] = convert(mote)
  return `${Number(amo.toFixed(2)).toLocaleString()} ${UNITS[idx]} AMO`
}

export function displayAMOLong(s_mote: string) {
  const mote = Number(s_mote)
  const amo = mote / UNIT
  return `${mote.toLocaleString()} mote (${amo < 1 && amo !== 0 ? amo.toFixed(18) : amo.toLocaleString()} AMO)`
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
