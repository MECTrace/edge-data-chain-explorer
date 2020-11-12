import React from "react"
import {Grid, LinearProgress, makeStyles, withStyles} from "@material-ui/core"

const useLinearGraphStyle = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${theme.spacing(1)}px ${theme.spacing(4)}px`,
  },
  progress: {
    flexGrow: 1
  },
  title: {
    textAlign: 'left',
    fontSize: '.9rem'
  },
  value: {
    fontSize: '1rem'
  }
}))

type Props = {
  title: string,
  value: string,
  percent: number
  color?: string
}

const ColoredLinearProgress = withStyles({
  colorPrimary: {
    backgroundColor: '#5C7080',
  },
  barColorPrimary: {
    backgroundColor: '#182026'
  },
  root: {
    height: 11,
  },
  bar: {
    height: 11
  }
})(LinearProgress)

const LinearGraph = (props: Props) => {
  const classes = useLinearGraphStyle()

  return (
    <Grid
      container
      className={classes.root}
      spacing={1}
    >
      <Grid
        item
        className={classes.progress}
        lg={7}
        md={9}
        sm={8}
        xs={6}
      >
        <div className={classes.title}>
          {props.title}
        </div>
        <ColoredLinearProgress
          variant="determinate"
          value={props.percent}
        />
      </Grid>
      <Grid
        item
        className={classes.value}
        lg={5}
        md={3}
        sm={4}
        xs={6}
      >
        {props.value}
      </Grid>
    </Grid>
  )
}

export default LinearGraph
