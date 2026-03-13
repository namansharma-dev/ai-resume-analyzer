import { useDropzone } from "react-dropzone"

export default function DropResume({ setFile }) {

const {
getRootProps,
getInputProps,
isDragActive,
acceptedFiles,
fileRejections
} = useDropzone({

accept:{
"application/pdf":[]
},

maxFiles:1,

onDrop:(files)=>{
if(files.length>0){
setFile(files[0])
}
}

})

return(

<div
{...getRootProps()}
className={`upload-area cursor-pointer ${
isDragActive ? "glow border-sky-400" : ""
}`}
>

<input {...getInputProps()} />

<div className="upload-zone">

<div className="icon-container-xl mb-4 mx-auto">
📄
</div>

<p className="text-lg text-slate-200 font-medium">

{isDragActive
? "Drop your resume here..."
: "Drag & Drop your Resume"}

</p>

<p className="text-sm text-slate-400 mt-2">
PDF format • Max 1 file
</p>

</div>

{/* FILE PREVIEW */}

{acceptedFiles.length>0 &&(

<div className="file-info-card mt-5">

<p className="text-slate-300 text-sm">
Uploaded:
</p>

<p className="text-white font-medium">
{acceptedFiles[0].name}
</p>

</div>

)}

{/* ERROR MESSAGE */}

{fileRejections.length>0 &&(

<p className="text-red-400 text-sm mt-3 text-center">
Only PDF files are allowed
</p>

)}

</div>

)

}