import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"

export default function ScoreMeter({ score }) {

return (

<div style={{width:120}}>

<CircularProgressbar
value={score}
text={`${score}%`}
styles={buildStyles({
textColor:"#00ffd5",
pathColor:"#00ffd5",
trailColor:"#0f2c3d"
})}
/>

</div>

)

}