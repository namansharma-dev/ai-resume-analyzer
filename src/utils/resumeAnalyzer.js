// -------- TEXT NORMALIZATION --------
function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/\s+/g, " ")
}

// -------- SKILL LIBRARY --------
const SKILL_LIBRARY = [

  // Tech
  "Python",
  "JavaScript",
  "React",
  "Node",
  "SQL",
  "Docker",
  "AWS",
  "Machine Learning",
  "Java",
  "C++",

  // Data
  "Data Analysis",
  "Pandas",
  "NumPy",
  "Power BI",
  "Tableau",
  "Excel",
  "Statistics",

  // Business
  "Business Analysis",
  "Project Management",
  "Financial Analysis",
  "Market Research",
  "Consulting",

  // General
  "Communication",
  "Leadership",
  "Teamwork",
  "Problem Solving"
]

// -------- SYNONYMS --------
const SKILL_SYNONYMS = {

  "Data Analysis": [
    "analysis",
    "analytics",
    "analytical"
  ],

  "Communication": [
    "communication",
    "presentation",
    "presenting"
  ],

  "Project Management": [
    "project management",
    "managed project",
    "project lead"
  ],

  "Problem Solving": [
    "problem solving",
    "solve problems",
    "troubleshooting"
  ]
}

// -------- SKILLS FROM JOB DESCRIPTION --------
function extractSkills(jobDesc) {

  const job = jobDesc.toLowerCase()

  const detected = SKILL_LIBRARY.filter(skill =>
    job.includes(skill.toLowerCase())
  )

  if (detected.length === 0) {
    return SKILL_LIBRARY.slice(0, 8)
  }

  return detected
}

// -------- SECTION DETECTION --------
function hasSection(text, keywords){

const normalized = text
.toLowerCase()
.replace(/\s+/g,"")

return keywords.some(word =>
normalized.includes(word.replace(/\s+/g,""))
)

}

// -------- MAIN ANALYZER --------
export function analyzeResume(resumeText, jobDesc) {

  const resume = normalizeText(resumeText)
  const job = jobDesc.toLowerCase()

  const words = resume.split(/\s+/)
  const wordCount = words.length

  const SKILLS = extractSkills(jobDesc)

  // -------- SKILL DETECTION --------
  const foundSkills = SKILLS.filter(skill => {

    const skillLower = skill.toLowerCase()

    const regex = new RegExp(`\\b${skillLower}\\b`)

    if (regex.test(resume)) return true

    if (SKILL_SYNONYMS[skill]) {
      return SKILL_SYNONYMS[skill].some(word =>
        resume.includes(word)
      )
    }

    return false
  })

  const missingSkills = SKILLS.filter(
    skill => !foundSkills.includes(skill)
  )

  // -------- JOB MATCH --------
  const resumeWords = resume.split(/\W+/)

  const jobWords = job.split(/\W+/).filter(w => w.length > 2)

  const matched = jobWords.filter(word =>
    resumeWords.includes(word)
  )

  const jobScore = jobWords.length
    ? Math.round((matched.length / jobWords.length) * 100)
    : 0

  // -------- SECTION DETECTION --------
  const sections = {

education: hasSection(resume,[
"education",
"academic",
"qualification",
"bachelor",
"master",
"university"
]),

experience: hasSection(resume,[
"experience",
"workexperience",
"employment",
"internship",
"professionalexperience"
]),

projects: hasSection(resume,[
"projects",
"project",
"academicproject",
"personalproject"
]),

skills: hasSection(resume,[
"skills",
"technicalskills",
"technologies",
"tools"
])

}

const missingSections = Object.keys(sections)
.filter(section => !sections[section])

  // -------- LENGTH SCORE --------
  let lengthScore = 0

  if (wordCount >= 400 && wordCount <= 700)
    lengthScore = 100
  else if (wordCount >= 300 && wordCount <= 900)
    lengthScore = 80
  else
    lengthScore = 50

  // -------- SKILL SCORE --------
  const skillScore = SKILLS.length
    ? Math.round((foundSkills.length / SKILLS.length) * 100)
    : 0

  // -------- SECTION SCORE --------
  const sectionScore = Math.round(
    ((4 - missingSections.length) / 4) * 100
  )

  // -------- FINAL ATS SCORE --------
  const atsScore = Math.round(
    (skillScore + jobScore + lengthScore + sectionScore) / 4
  )

  // -------- SUGGESTIONS --------
  let suggestions = []

  if (wordCount < 300)
    suggestions.push("Resume too short. Add more details.")

  if (wordCount > 900)
    suggestions.push("Resume too long. Keep under 700 words.")

  if (missingSections.includes("projects"))
    suggestions.push("Add a Projects section.")

  if (missingSections.includes("experience"))
    suggestions.push("Add an Experience section.")

  if (!resume.includes("github"))
    suggestions.push("Add GitHub link.")

  if (missingSkills.length > 0)
    suggestions.push("Try adding relevant skills from the job description.")

  // -------- RETURN RESULT --------
  return {
    atsScore,
    jobScore,
    skillScore,
    sectionScore,
    lengthScore,
    wordCount,
    foundSkills,
    missingSkills,
    missingSections,
    suggestions
  }

}