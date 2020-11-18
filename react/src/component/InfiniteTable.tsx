import React from "react"
import {makeStyles} from "@material-ui/styles"
import {
  Grid,
  Paper,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  Theme,
  useMediaQuery,
} from "@material-ui/core"
import InfiniteScroll from "react-infinite-scroller"
import {useChainId} from "../reducer"

const useStyles = makeStyles((theme: Theme) => ({
  table: {
    display: 'table',
    width: '100%',
  },
  row: {
    display: 'flex',
    flexFlow: 'row nowrap',
    borderBottom: '1px solid #e0e0e0',
    padding: '0 25px',
    alignItems: 'center'
  },
  tableCell: {
    flex: '0 1 auto',
    textAlign: 'center',
    verticalAlign: 'middle',
    border: 0,
    width: 100,
    '& *': {
      width: '100%',
      display: 'inline-block',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
    },
  },
  collapsedCell: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'space-between'
  },
  collapsedCellWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  collapsedCellHeader: {
    fontWeight: 600
  },
  collapsedCellBody: {
    maxWidth: '50vw',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    '& *': {
      width: '100%'
    }
  },
}))

interface Column {
  key: string
  label: string
  width?: number
  style?: React.CSSProperties
  format?: (v: any, chain_id: string) => React.ReactNode
}

type InfiniteTableProps<T> = {
  // Array of items loaded so far.
  rows: T[],
  // for display
  columns: Column[]
  // indicator whether there are more rows to load,
  // should be set false from outside
  hasMore: boolean
  // Callback function responsible for loading the next page of items.
  loadMoreRows: (from: number, num: number) => Promise<any>,
}

function InfiniteTable<T>(props: InfiniteTableProps<T>) {
  // Only load 1 page of items at a time.
  // Pass an empty callback to InfiniteLoader in case it asks us to load more
  // than once.
  const loadMore = (page: number) => {
    if (page > 0) {
      props.loadMoreRows((page-1)*20, 20)
    }
  }
  const breakMD = useMediaQuery('(max-width: 960px)')
  const classes = useStyles()
  const chain_id = useChainId()

  const cellRenderer = (key: any, cellData: any, format: any, style?: React.CSSProperties) => {
    style = style ? style : {}
    return (
      <TableCell
        key={key}
        component="div"
        className={classes.tableCell}
        style={style}
      >
        {format ? format(cellData, chain_id) : cellData}
      </TableCell>
    )
  }

  const collapsedCellRender = (rowData: any) => {
    return (
      <TableCell
        component="div"
        className={classes.tableCell}
        style={{height: '170px'}}
      >
        <div className={classes.collapsedCell}>
          {props.columns.map((c, i) => (
            <div key={i} className={classes.collapsedCellWrapper}>
              <div className={classes.collapsedCellHeader}>
                {c.label}
              </div>
              <div className={classes.collapsedCellBody}>
                {c.format ? c.format(rowData[c.key], chain_id) : rowData[c.key]}
              </div>
            </div>
          ))}
        </div>
      </TableCell>
    )
  }

  return (
    <Grid item lg={12} md={12} sm={12} xs={12}>
      <Paper elevation={6}>
        <InfiniteScroll
          hasMore={props.hasMore}
          loadMore={loadMore}
          loader={<span key="loadingIndicator">loading...</span>}
        >
          <Table
            className={classes.table}
            component="div"
          >
            <TableHead
              component="div"
            >
              {breakMD ? (
                <TableRow
                  className={classes.row}
                  component="div"
                >
                  <TableCell>Txs</TableCell>
                </TableRow>
                ) : (
                <TableRow
                  className={classes.row}
                  component="div"
                >
                  {props.columns.map(({key, label, style}) => {
                    return (
                      <TableCell key={key}
                        className={classes.tableCell}
                        style={style}
                        component="div"
                      >
                        {label}
                      </TableCell>
                    )
                  })}
                </TableRow>
                )
              }
            </TableHead>
            <TableBody
              component="div"
            >
              {props.rows.map((rowData: T, rowIndex: number) =>
                (
                  <TableRow
                    key={rowIndex}
                    className={classes.row}
                    component="div"
                  >
                  {breakMD ?
                    (<TableCell
                      key={'hash'}
                      component="div"
                      className={classes.tableCell}
                    >
                      narrow index {rowIndex}
                    </TableCell>) : 
                    (props.columns.map(({key, format, style}) => {
                      const cellData = rowData[key as keyof T]
                      return cellRenderer(key, cellData, format, style)
                    }))
                  }
                </TableRow>))
              }
            </TableBody>
          </Table>
        </InfiniteScroll>
      </Paper>
    </Grid>
  );
}

export default InfiniteTable
