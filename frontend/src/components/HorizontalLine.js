import React from 'react'

function HorizontalLine({lineColor, marginUp, marginDown}) {
  return (
    <div>
      <hr style={{
        border: 'none',
        height: '1px',
        width: "100%",
        backgroundColor: lineColor, // Line color
        marginTop: marginUp,
        marginBottom: marginDown
      }} />
    </div>
  )
}

export default HorizontalLine
