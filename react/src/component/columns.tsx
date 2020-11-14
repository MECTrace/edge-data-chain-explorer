import {Link} from "react-router-dom"
import {displayAddress, displayResult} from "../util"
import React from "react"

export const transactionColumns = [
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
    key: 'info',
    label: 'Result',
    width: 100,
    flexGrow: 4,
    columnData: {
      format: displayResult
    }
  }
]
