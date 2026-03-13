export async function analyzeResumeAI(resumeText, jobDescription){

try{

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

const response = await fetch(
`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
contents:[
{
parts:[
{
text:`
You are an ATS resume analyzer.

Return ONLY JSON.

{
"atsScore": number,
"missingSkills": [],
"suggestions": []
}

Resume:
${resumeText}

Job Description:
${jobDescription}
`
}
]
}
]
})
}
)

if(!response.ok){
throw new Error("Gemini request failed")
}

const data = await response.json()

console.log("Gemini response:",data)

const text = data?.candidates?.[0]?.content?.parts?.[0]?.text

if(!text){
throw new Error("Empty AI response")
}

try{
return JSON.parse(text)
}catch{

const start = text.indexOf("{")
const end = text.lastIndexOf("}")

if(start !== -1 && end !== -1){
return JSON.parse(text.substring(start,end+1))
}

throw new Error("JSON parse failed")
}

}catch(err){

console.log("AI fallback used:",err)

const skills=["python","sql","react","docker","aws","machine learning"]

const resumeLower = resumeText.toLowerCase()

const found = skills.filter(s=>resumeLower.includes(s))
const missing = skills.filter(s=>!resumeLower.includes(s))

return{
atsScore:Math.round((found.length/skills.length)*100),
missingSkills:missing,
suggestions:[
"Add measurable achievements",
"Improve project descriptions",
"Include cloud or deployment experience"
]
}

}

}