import { Document, Page, pdfjs } from "react-pdf"
import { useState } from "react"
import worker from "pdfjs-dist/build/pdf.worker.min.mjs?url"

pdfjs.GlobalWorkerOptions.workerSrc = worker

export default function ResumePreview({ file }){

const [numPages,setNumPages] = useState(null)
const [loading,setLoading] = useState(true)

function onLoadSuccess({ numPages }){
setNumPages(numPages)
setLoading(false)
}

if(!file){
return(

<div className="glass-card text-center text-slate-400">

<p className="text-sm">
Upload a resume to preview it here
</p>

</div>

)
}

return(

<div className="glass-card max-h-[520px] overflow-auto">

{loading && (

<div className="text-center text-slate-400 mb-4">
Loading resume preview...
</div>

)}

<Document
file={file}
onLoadSuccess={onLoadSuccess}
>

<Page
pageNumber={1}
width={480}
/>

</Document>

<div className="text-center text-xs text-slate-400 mt-3">

Previewing page 1 of {numPages}

</div>

</div>

)

}