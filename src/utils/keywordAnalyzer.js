export function getTopKeywords(text){

const words = text
.toLowerCase()
.replace(/[^\w\s]/g,"")
.split(/\s+/)

const ignore = [
"the","and","a","to","in","of","for","on","with",
"is","are","as","at","by","an"
]

const freq = {}

words.forEach(word=>{

if(ignore.includes(word)) return
if(word.length < 4) return

freq[word] = (freq[word] || 0) + 1

})

const sorted = Object.entries(freq)
.sort((a,b)=>b[1]-a[1])
.slice(0,10)

return sorted

}