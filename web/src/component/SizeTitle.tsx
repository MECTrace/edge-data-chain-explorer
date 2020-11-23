import React, {useState} from "react"
import {MenuItem, Select} from "@material-ui/core"

export const LastOptions = [
  100, 1_000, 10_000
]

type Props = {
  target: string
  values: number[]
  onSizeChange: (value: number) => void
}

const SizeTitle = (props: Props) => {
  const [value, setValue] = useState(props.values[0])

  const {
    target,
    values,
    onSizeChange
  } = props

  const onChange = (e: React.ChangeEvent<{ name?: string, value: unknown }>) => {
    setValue(e.target.value as number)
    onSizeChange(e.target.value as number)
  }

  return (
    <span>
      {target} stat in last
      &nbsp;
      <Select value={value} onChange={onChange}>
        {values.map((v, i) => (
          <MenuItem value={v} key={i}>{v}</MenuItem>
        ))}
      </Select>
      &nbsp;
      blocks
  </span>
  )
}

export default SizeTitle
