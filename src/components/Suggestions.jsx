export default function Suggestions({ tips }){

return(

<div>

<h3 className="text-white mb-2 font-semibold">
Suggestions
</h3>

<ul className="text-slate-300 text-sm space-y-1">

{tips.map((tip,index)=>(
<li key={index}>• {tip}</li>
))}

</ul>

</div>

)

}