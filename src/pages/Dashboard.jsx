import { useState } from "react"

import DropResume from "../components/DropResume"
import ResumePreview from "../components/ResumePreview"
import ATSMeter from "../components/ATSMeter"
import SkillChart from "../components/SkillChart"
import Suggestions from "../components/Suggestions"
import ScoreSimulator from "../components/ScoreSimulator"

import { getTopKeywords } from "../utils/keywordAnalyzer"

export default function Dashboard(){

const [jobDesc,setJobDesc] = useState("")
const [file,setFile] = useState(null)
const [score,setScore] = useState(null)

const [skillsFound,setSkillsFound] = useState([])
const [missingSkills,setMissingSkills] = useState([])

const [suggestions,setSuggestions] = useState([])
const [resumeText,setResumeText] = useState("")

const [skillScore,setSkillScore] = useState(0)
const [jobScore,setJobScore] = useState(0)
const [sectionScore,setSectionScore] = useState(0)
const [lengthScore,setLengthScore] = useState(0)

const skills = [
"Python",
"React",
"Node",
"SQL",
"Machine Learning",
"Docker",
"AWS"
]

const analyzeResume = () => {

if(!file) return

// simulated resume text
const text = `
Python developer with SQL and Machine Learning experience.
Built multiple data analysis projects.
`

setResumeText(text)

const resumeLower = text.toLowerCase()

// FOUND SKILLS
const found = skills.filter(skill =>
resumeLower.includes(skill.toLowerCase())
)

// MISSING SKILLS
const missing = skills.filter(skill =>
!resumeLower.includes(skill.toLowerCase())
)

setSkillsFound(found)
setMissingSkills(missing)


// SKILL SCORE
const skillScoreValue = Math.round((found.length / skills.length) * 100)
setSkillScore(skillScoreValue)


// JOB DESCRIPTION SCORE
let jobScoreValue = 0

if(jobDesc){

const jobWords = jobDesc.toLowerCase().split(/\W+/)

const matched = jobWords.filter(word =>
resumeLower.includes(word)
)

jobScoreValue = Math.round((matched.length / jobWords.length) * 100)

}

setJobScore(jobScoreValue)


// SECTION DETECTION

let sections = 0

if(resumeLower.includes("education")) sections++
if(resumeLower.includes("experience")) sections++
if(resumeLower.includes("project")) sections++
if(resumeLower.includes("skill")) sections++

const sectionScoreValue = Math.round((sections / 4) * 100)

setSectionScore(sectionScoreValue)


// LENGTH SCORE

const wordCount = text.split(/\s+/).length

let lengthScoreValue = 50

if(wordCount > 300) lengthScoreValue = 80
if(wordCount > 500) lengthScoreValue = 100

setLengthScore(lengthScoreValue)


// FINAL ATS SCORE

const ats = Math.round(
(skillScoreValue + jobScoreValue + sectionScoreValue + lengthScoreValue) / 4
)

setScore(ats)


// SUGGESTIONS

let tips = []

if(missing.includes("React"))
tips.push("Add React projects")

if(missing.includes("Docker"))
tips.push("Mention Docker knowledge")

if(missing.includes("AWS"))
tips.push("Add cloud deployment experience")

if(!resumeLower.includes("github"))
tips.push("Add GitHub link")

setSuggestions(tips)

}

const keywords = getTopKeywords(resumeText || "")

return(

<div className="min-h-screen bg-gradient-to-r from-[#06142E] to-[#0A2A43] py-12 px-6">

<div className="max-w-6xl mx-auto">

<h1 className="text-3xl font-bold text-white text-center mb-12">
AI Resume Analyzer
</h1>


{/* UPLOAD + PREVIEW */}

<div className="grid grid-cols-1 md:grid-cols-2 gap-10">

<div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">

<h2 className="text-white text-lg font-semibold mb-4">
Upload Resume
</h2>

<DropResume setFile={setFile}/>

<textarea
value={jobDesc}
onChange={(e)=>setJobDesc(e.target.value)}
placeholder="Paste Job Description here..."
className="mt-4 w-full bg-black/30 text-white p-3 rounded-lg border border-white/20"
rows={4}
/>

</div>


<div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">

<h2 className="text-white text-lg font-semibold mb-4">
Resume Preview
</h2>

<ResumePreview file={file}/>

</div>

</div>


{/* ANALYZE BUTTON */}

<div className="flex justify-center mt-10">

<button
onClick={analyzeResume}
disabled={!file}
className="bg-cyan-500 hover:bg-cyan-400 text-black px-6 py-3 rounded-lg font-semibold transition"
>
Analyze Resume
</button>

</div>


{/* RESULTS */}

{file && score !== null && (

<div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16">


{/* ATS SCORE */}

<div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 flex justify-center">
<ATSMeter score={score}/>
</div>


{/* SKILLS FOUND */}

<div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">

<h3 className="text-white mb-2 font-semibold">
Skills Found
</h3>

<SkillChart skills={skillsFound}/>

</div>


{/* MISSING SKILLS */}

<div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">

<h3 className="text-white mb-2 font-semibold">
Missing Skills
</h3>

<div className="flex flex-wrap gap-2">

{missingSkills.map(skill => (

<span
key={skill}
className="px-3 py-1 bg-purple-600/40 text-white rounded-lg text-sm"
>
{skill}
</span>

))}

</div>

</div>

</div>

)}


{/* SCORE BREAKDOWN */}

{score !== null && (

<div className="grid md:grid-cols-2 gap-10 mt-10">

<div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">

<h3 className="text-white font-semibold mb-3">
Score Breakdown
</h3>

<p className="text-slate-300">Skill Score: {skillScore}%</p>
<p className="text-slate-300">Job Match Score: {jobScore}%</p>
<p className="text-slate-300">Section Score: {sectionScore}%</p>
<p className="text-slate-300">Length Score: {lengthScore}%</p>

</div>


<div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">

<Suggestions tips={suggestions}/>

</div>

</div>

)}


{/* KEYWORDS */}

{resumeText && (

<div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 mt-10">

<h3 className="text-white mb-3 font-semibold">
Top Resume Keywords
</h3>

<ul className="text-slate-300 text-sm">

{keywords.map(([word,count]) => (
<li key={word}>
{word} ({count})
</li>
))}

</ul>

</div>

)}


{/* SCORE SIMULATOR */}

{score !== null && (

<div className="mt-10">

<ScoreSimulator
missingSkills={missingSkills}
baseScore={score}
/>

</div>

)}

</div>

</div>

)

}