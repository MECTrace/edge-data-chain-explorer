import {Link} from "react-router-dom"
import {displayAddress, displayResult, displayAMO} from "../util"
import React from "react"

export const txColumns = [
  {
    key: 'height',
    label: 'Height',
    width: 100,
    flexGrow: 1,
    columnData: {
      format: (height: number, chainId: string) => {
        return (
          <Link to={`/${chainId}/inspect/block/${height}`}>
            {height}
          </Link>
        )
      }
    }
  },
  {
    key: 'index',
    label: 'Index',
    width: 100,
    flexGrow: 1
  },
  {
    key: 'hash',
    label: 'Hash',
    width: 100,
    flexGrow: 8,
    columnData: {
      format: (hash: string, chainId: string) => {
        return (
          <Link to={`/${chainId}/inspect/tx/${hash}`}>
            <code>{hash}</code>
          </Link>
        )
      }
    }
  },
  {
    key: 'sender',
    label: 'Sender',
    width: 100,
    flexGrow: 5,
    columnData: {
      format: displayAddress
    }
  },
  {
    key: 'type',
    label: 'Type',
    width: 100,
    flexGrow: 1
  },
  {
    key: 'fee',
    label: 'Tx Fee',
    width: 100,
    columnData: {
      format: displayAMO
    }
  },
  {
    key: 'info',
    label: 'Result',
    width: 100,
    flexGrow: 4,
    columnData: {
      format: displayResult
    }
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

export const txColumns2 = [
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
