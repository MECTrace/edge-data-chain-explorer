import {Link} from "react-router-dom"
import {displayAddress, displayResult, displayAMO} from "../util"
import React from "react"

export const txColumns = [
  {
    key: 'height',
    label: 'Height',
    format: (height: number, chainId: string) => {
      return (
        <Link to={`/${chainId}/inspect/block/${height}`}>
          {height}
        </Link>
      )
    }
  },
  {
    key: 'index',
    label: 'Index',
  },
  {
    key: 'hash',
    label: 'Hash',
    style: {flexGrow: 8},
    format: (hash: string, chainId: string) => {
      return (
        <Link to={`/${chainId}/inspect/tx/${hash}`}>
          <code>{hash}</code>
        </Link>
      )
    }
  },
  {
    key: 'sender',
    label: 'Sender',
    style: {flexGrow: 8},
    format: displayAddress,
  },
  {
    key: 'type',
    label: 'Type',
  },
  {
    key: 'fee',
    label: 'Tx Fee',
    format: displayAMO
  },
  {
    key: 'info',
    label: 'Result',
    style: {flexGrow: 2},
    format: displayResult
  }
]

export const incentiveColumns = [
  {
    key: 'height',
    label: 'Height',
    width: 100,
    format: (height: number, chainId: string) => {
      return (
        <Link to={`/${chainId}/inspect/block/${height}`}>
          {height}
        </Link>
      )
    }
  },
  {
    key: 'amount',
    label: 'Incentive',
    width: 100,
    format: displayAMO
  },
]

export const balanceHistoryColumns = [
  {
    key: 'height',
    label: 'Block height',
    width: 100,
    format: (height: number, chainId: string) => {
      return (
        <Link to={`/${chainId}/inspect/block/${height}`}>
          {height}
        </Link>
      )
    }
  },
  {
    key: 'index',
    label: 'Tx index',
    width: 100,
    format: (index: number, chainId: string) => {
      if (index) {
        return (
          <Link to={`/${chainId}/inspect/block/${index}`}>
            {index}
          </Link>
        )
      } else {
        return '-'
      }
    }
  },
  {
    key: 'amount',
    label: 'Change',
    width: 100,
    format: displayAMO
  },
  {
    key: 'type',
    label: 'Type',
    width: 100,
  },
]

export const penaltyColumns = [
  {
    key: 'height',
    label: 'Height',
    width: 100,
    format: (height: number, chainId: string) => {
      return (
        <Link to={`/${chainId}/inspect/block/${height}`}>
          {height}
        </Link>
      )
    }
  },
  {
    key: 'amount',
    label: 'Penalty',
    width: 100,
    columnData: {
      format: displayAMO
    }
  },
]

export const voteColumns = [
  {
    key: 'voter',
    label: 'Voter',
    width: 100,
    format: displayAddress,
  },
  {
    key: 'approve',
    label: 'Approve',
    width: 100,
    format: (approve: boolean) => {
      return approve ? 'Yay' : 'Nay'
    }
  },
  {
    key: 'tally',
    label: 'Tally',
    width: 100,
    format: displayAMO,
  },
]
