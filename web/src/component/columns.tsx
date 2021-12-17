import {Link} from "react-router-dom"
import {
  displayAddress,
  displayResult,
  displayAMO,
  displayAMOLong,
} from "../util"
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
    style: {flexGrow: 10},
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
    style: {flexGrow: 10},
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
    format: (index: number, chainId: string) => {
      if (index !== null || index !== undefined) {
        return index;
      } else {
        return '-'
      }
    }
  },
  {
    key: 'amount',
    label: 'Change amount',
    style: {flexGrow: 10},
    format: displayAMOLong
  },
  {
    key: 'tx_type',
    label: 'Tx Type',
  },
  {
    key: 'tx_hash',
    label: 'Tx Hash',
    style: {flexGrow: 8},
    format: (hash: string, chainId: string) => {
      if (hash !== null || hash !== undefined) {
        return (
          <Link to={`/${chainId}/inspect/tx/${hash}`}>
            <code>{hash}</code>
          </Link>
        )
      } else {
        return '-';
      }
    }
  },
  {
    key: 'tx_sender',
    label: 'Tx sender',
    style: {flexGrow: 8},
    format: (sender: string, chainId: string) => {
      if (sender) {
        return (
          <Link to={`/${chainId}/inspect/account/${sender}`}>
            {sender}
          </Link>
        )
      } else {
        return '-'
      }
    }
  },
  {
    key: 'tx_fee',
    label: 'Tx fee',
    style: {flexGrow: 4},
    format: (fee: string) => {
      if (fee !== '') {
        return displayAMOLong(fee)
      } else {
        return '-'
      }
    }
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
