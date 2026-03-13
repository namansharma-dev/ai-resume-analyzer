export default function SkillChart({ skills }){

return(

<div className="flex flex-wrap gap-2">

{skills.map(skill=>(

<span
key={skill}
className="bg-blue-500/30 text-white px-3 py-1 rounded-full text-sm"
>
{skill}
</span>

))}

</div>

)

}