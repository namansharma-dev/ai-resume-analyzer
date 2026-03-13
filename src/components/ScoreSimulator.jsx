import { useState } from "react"

export default function ScoreSimulator({ missingSkills, baseScore }){

const [selected,setSelected] = useState([])

function toggle(skill){

if(selected.includes(skill))
setSelected(selected.filter(s=>s!==skill))
else
setSelected([...selected,skill])

}

const improvedScore = Math.min(
100,
baseScore + selected.length * 5
)

return(

<div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">

<h3 className="text-white mb-3 font-semibold">
Improve ATS Score
</h3>

<div className="flex flex-wrap gap-2">

{missingSkills.map(skill=>(
<button
key={skill}
onClick={()=>toggle(skill)}
className={`px-3 py-1 rounded-full text-sm ${
selected.includes(skill)
? "bg-green-500"
: "bg-purple-600"
}`}
>
{skill}
</button>
))}

</div>

<p className="text-green-400 mt-3">
Improved Score: {improvedScore}%
</p>

</div>

)

}