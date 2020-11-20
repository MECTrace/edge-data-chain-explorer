import React, {useCallback, useMemo, useRef} from 'react'
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  Column as TableColumn,
  Index,
  Table,
  TableCellRenderer,
  TableHeaderProps,
  WindowScroller
} from "react-virtualized"
import {makeStyles} from "@material-ui/styles"
import {Backdrop, CircularProgress, Grid, Paper, TableCell, Theme, useMediaQuery} from "@material-ui/core"
import clsx from "clsx"
import {RootState} from "../reducer"
import {shallowEqual, useSelector} from "react-redux"

const useInfinityScrollStyle = makeStyles((theme: Theme) => ({
  wrapper: {
    flex: '1 1 auto'
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    borderBottom: '1px solid #e0e0e0',
    padding: '0 25px',
    alignItems: 'center'
  },
  tableCell: {
    flex: '1 1 auto',
    width: '100%',
    '& *': {
      display: 'inline-block',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden'
    }
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
    display: 'inline-block',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    '& *': {
      width: '100%'
    }
  },
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
    justifyContent: 'center'
  },
  table: {
    '& .ReactVirtualized__Table__row, & .ReactVirtualized__Table__headerRow': {
      display: 'flex',
    },
    '& .ReactVirtualized__Table__headerRow': {
      fontWeight: 500,
      background: '#fafafa'
    }
  },
  loading: {
    display: 'flex',
    flex: '1 1 auto',
    height: '300px',
    justifyContent: 'center',
    alignItems: 'center'
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}))

interface Column<T> {
  key: string
  label: string
  width: number
  flexGrow?: number
  columnData?: {
    format?: (v: any, chainId: string, rowData: T) => React.ReactNode
  }
}

interface Props<T> {
  onScroll: (params: { scrollLeft: number, scrollTop: number }) => void
  columns: Column<T>[]
  rowKey: string
  data: T[],
  loading: UseScrollLoading
}

const collapsedHeight = 170

function InfinityTable<T>(props: Props<T>) {
  const classes = useInfinityScrollStyle()

  const breakMD = useMediaQuery('(max-width: 960px)')
  const recentWidth = useRef<number>()
  const chainId = useSelector<RootState, string>(state => state.blockchain.chainId, shallowEqual)

  const cache = useMemo(() => {
    return new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: 60
    })
  }, [])

  const cellRenderer: TableCellRenderer = useCallback(({cellData, columnIndex, columnData, parent, rowData}) => {
    const format = columnData ? columnData['format'] : undefined

    return (
      <CellMeasurer
        cache={cache}
        parent={parent}
      >
        <TableCell
          component="div"
          variant="body"
          className={clsx(classes.tableCell, classes.flexContainer)}
          style={{height: `60px`, textAlign: 'center'}}
        >
          {format ? format(cellData, chainId, rowData) : cellData}
        </TableCell>
      </CellMeasurer>
    )
  }, [cache, chainId, classes])

  const collapsedCellRender: TableCellRenderer = useCallback(({rowData, parent}) => {
    return (
      <CellMeasurer
        cache={cache}
        parent={parent}
      >
        <TableCell
          component="div"
          variant="body"
          className={clsx(classes.tableCell, classes.flexContainer)}
          style={{height: `${collapsedHeight}px`}}
        >
          <div className={classes.collapsedCell}>
            {props.columns.map((c, i) => (
              <div key={i} className={classes.collapsedCellWrapper}>
                <div className={classes.collapsedCellHeader}>
                  {c.label}
                </div>
                <div className={classes.collapsedCellBody}>
                  {c.columnData?.format ? c.columnData.format(rowData[c.key], chainId, rowData) : rowData[c.key]}
                </div>
              </div>
            ))}
          </div>
        </TableCell>
      </CellMeasurer>
    )
  }, [cache, chainId, classes, props.columns])

  const headerRenderer = ({label}: TableHeaderProps & { columnIndex: number }) => {
    return (
      <TableCell
        component="div"
        variant="head"
        className={clsx(classes.tableCell, classes.flexContainer)}
        style={{height: `${breakMD ? 0 : 50}px`}}
      >
        <span>{label}</span>
      </TableCell>
    )
  }

  const rowGetter = ({index}: Index) => {
    return props.data[index]
  }

  return (
    <Grid
      item
      lg={12}
      md={12}
      sm={12}
      xs={12}
    >
      <Paper elevation={6}>
        <WindowScroller
          scrollElement={window}
          onScroll={props.onScroll}
        >
          {({height, isScrolling, registerChild, onChildScroll, scrollTop}) => (
            <div className={classes.wrapper}>
              <AutoSizer disableHeight>
                {({width}) => {
                  if (width !== recentWidth.current) {
                    // This logic prevents wrong rendering after width of window changed
                    // https://codesandbox.io/s/qlqkx2mrz4?file=/window-scroller.js:725-959
                    recentWidth.current = width
                    cache.clearAll()
                  }

                  return (
                    <div
                      ref={registerChild}
                    >
                      <Table
                        autoHeight
                        height={height}
                        rowCount={props.data.length}
                        rowHeight={breakMD ? collapsedHeight : 60}
                        headerHeight={breakMD ? 0 : 50}
                        onScroll={onChildScroll}
                        isScrolling={isScrolling}
                        scrollTop={scrollTop}
                        width={width}
                        rowGetter={rowGetter}
                        gridStyle={{
                          direction: 'inherit'
                        }}
                        className={classes.table}
                      >
                        {breakMD ? (
                          <TableColumn
                            width={100}
                            flexGrow={1}
                            key={'hash'}
                            dataKey={'hash'}
                            cellRenderer={collapsedCellRender}
                            className={classes.flexContainer}
                            headerRenderer={(headerProps) => headerRenderer({
                              ...headerProps,
                              columnIndex: 0
                            })}
                          />
                        ) : (
                          props.columns.map(({key, ...other}, index) => {
                            return (
                              <TableColumn
                                key={key}
                                dataKey={key}
                                cellRenderer={cellRenderer}
                                className={classes.flexContainer}
                                headerRenderer={(headerProps) => headerRenderer({
                                  ...headerProps,
                                  columnIndex: index
                                })}
                                {...other}
                              />
                            )
                          })
                        )}
                      </Table>
                    </div>
                  )
                }}
              </AutoSizer>
              <Backdrop open={props.loading === 'FETCH'} className={classes.backdrop}>
                <CircularProgress color="inherit"/>
              </Backdrop>
            </div>
          )}
        </WindowScroller>
      </Paper>
    </Grid>
  )
}

export default InfinityTable
