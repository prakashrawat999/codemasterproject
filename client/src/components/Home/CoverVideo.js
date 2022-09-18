import React from 'react'
import GIF from '../../assets/Home Video.mp4'

const boxdiv = {
  width: "115%"
}

const videocont = {
  width: "100%",
  height: "auto"
}


const CoverVideo = () => {
  return (
    <div style={boxdiv}>
        <video style={videocont} src={GIF} type="video/mp4" autoPlay muted loop />
    </div>
  )
}

export default CoverVideo