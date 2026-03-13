import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"

export default function ATSMeter({ score }){

return(

<div style={{ width:120 }}>

<CircularProgressbar
value={score}
text={`${score}%`}
styles={buildStyles({
rotation: 0.75,   // FIX orientation
strokeLinecap: "round",
textSize: "18px",
pathTransitionDuration: 0.5,
pathColor: "#00ffd5",
textColor: "#ffffff",
trailColor: "#1a2a40"
})}
/>

</div>

)

}