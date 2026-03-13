import { useState } from "react"
import * as pdfjsLib from "pdfjs-dist"
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import { analyzeResume } from "../utils/resumeAnalyzer"
import ScoreSimulator from "../components/ScoreSimulator"

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker

export default function Upload(){

const [file,setFile]=useState(null)

const [score,setScore]=useState(null)
const [jobScore,setJobScore]=useState(0)
const [skillScore,setSkillScore]=useState(0)
const [sectionScore,setSectionScore]=useState(0)
const [lengthScore,setLengthScore]=useState(0)

const [skillsFound,setSkillsFound]=useState([])
const [missingSkills,setMissingSkills]=useState([])
const [missingSections,setMissingSections]=useState([])

const [suggestions,setSuggestions]=useState([])
const [wordCount,setWordCount]=useState(0)

const [jobDesc,setJobDesc]=useState("")

const handleFileChange=(e)=>{

const f=e.target.files[0]

if(!f) return

if(f.type!=="application/pdf"){
alert("Upload PDF only")
return
}

setFile(f)

}

const handleAnalyze=async()=>{

if(!file){
alert("Upload resume first")
return
}

const reader=new FileReader()

reader.onload=async function(){

const typedArray=new Uint8Array(this.result)
const pdf=await pdfjsLib.getDocument({data:typedArray}).promise

let text=""

for(let i=1;i<=pdf.numPages;i++){
const page=await pdf.getPage(i)
const content=await page.getTextContent()
const pageText=content.items.map(item=>item.str).join(" ")
text+=pageText+" "
}

const analysis = analyzeResume(text,jobDesc)

setScore(analysis.atsScore)
setJobScore(analysis.jobScore)
setSkillScore(analysis.skillScore)
setSectionScore(analysis.sectionScore)
setLengthScore(analysis.lengthScore)

setSkillsFound(analysis.foundSkills)
setMissingSkills(analysis.missingSkills)
setMissingSections(analysis.missingSections)

setSuggestions(analysis.suggestions)
setWordCount(analysis.wordCount)

}

reader.readAsArrayBuffer(file)

}

const downloadReport=()=>{

const doc=new jsPDF()

doc.setFontSize(18)
doc.text("Resume Analysis Report",20,20)

doc.text(`ATS Score: ${score}%`,20,40)
doc.text(`Job Match Score: ${jobScore}%`,20,50)
doc.text(`Word Count: ${wordCount}`,20,60)

autoTable(doc,{
startY:80,
head:[["Skills Found"]],
body:skillsFound.map(s=>[s])
})

autoTable(doc,{
startY:doc.lastAutoTable.finalY+10,
head:[["Missing Skills"]],
body:missingSkills.map(s=>[s])
})

autoTable(doc,{
startY:doc.lastAutoTable.finalY+10,
head:[["Suggestions"]],
body:suggestions.map(s=>[s])
})

doc.save("Resume-Report.pdf")

}

return(

<div className="min-h-screen bg-main-gradient py-12 px-6">

<div className="max-w-6xl mx-auto">

<h1 className="text-4xl text-white font-bold text-center mb-12">
AI Resume Analyzer
</h1>

<div className="grid md:grid-cols-2 gap-8 mb-10">

<div className="glass-card">

<input
type="file"
accept="application/pdf"
onChange={handleFileChange}
className="w-full p-3 rounded-lg bg-slate-900 border border-slate-600"
/>

{file&&(
<p className="mt-3 text-slate-300 text-sm">
Selected: {file.name}
</p>
)}

</div>

<textarea
placeholder="Paste Job Description..."
value={jobDesc}
onChange={(e)=>setJobDesc(e.target.value)}
className="glass-card h-40 text-white"
></textarea>

</div>

<div className="text-center">

<button
onClick={handleAnalyze}
className="btn-primary"
>
Analyze Resume
</button>

</div>

{score!==null&&(

<div className="dashboard-grid mt-12 fade-in">

<div className="score-card text-center">

<h2 className="text-white font-semibold mb-2">
ATS Score
</h2>

<p className="text-4xl font-bold text-green-400">
{score}%
</p>

</div>

<div className="section-card">

<h2 className="text-white font-semibold mb-3">
Skills Found
</h2>

<div className="flex flex-wrap gap-2">

{skillsFound.map(s=>(

<span key={s} className="keyword-tag bg-green-500/20">
{s}
</span>

))}

</div>

</div>

<div className="section-card">

<h2 className="text-white font-semibold mb-3">
Missing Skills
</h2>

<div className="flex flex-wrap gap-2">

{missingSkills.map(s=>(

<span key={s} className="keyword-tag bg-red-500/20">
{s}
</span>

))}

</div>

</div>

<div className="section-card">

<h2 className="text-white font-semibold mb-3">
Missing Sections
</h2>

<ul className="text-slate-300">

{missingSections.map(s=>(

<li key={s}>{s}</li>

))}

</ul>

</div>

<div className="section-card">

<h2 className="text-white font-semibold mb-3">
Score Breakdown
</h2>

<p>Skill Score: {skillScore}%</p>
<p>Job Match Score: {jobScore}%</p>
<p>Section Score: {sectionScore}%</p>
<p>Length Score: {lengthScore}%</p>

</div>

<div className="section-card md:col-span-2">

<h2 className="text-white font-semibold mb-3">
Suggestions
</h2>

<ul className="list-disc ml-6 text-slate-300">

{suggestions.map((s,i)=>(

<li key={i}>{s}</li>

))}

</ul>

</div>

{/* ⭐ Score Simulator Card */}

<div className="section-card md:col-span-2">

<h2 className="text-white font-semibold mb-3">
Improve ATS Score
</h2>

<ScoreSimulator
missingSkills={missingSkills}
baseScore={score}
/>

</div>

</div>

)}

{score!==null&&(

<div className="text-center mt-12">

<button
onClick={downloadReport}
className="btn-primary"
>
Download Report
</button>

</div>

)}

</div>

</div>

)

}