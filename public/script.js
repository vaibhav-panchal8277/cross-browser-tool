let latestResults={};

let latestUrl="";


async function runTest(){

const url=
document
.getElementById(
"urlInput"
)
.value;


loading.innerHTML=
"Generating screenshots...";


results.innerHTML=
"";


try{

const response=
await fetch(
"/run",
{

method:"POST",

headers:{
"Content-Type":
"application/json"
},

body:
JSON.stringify({
url
})

}

);


const data=
await response
.json();


if(
!response.ok
){

alert(
data.error
);

return;

}


latestResults=
data;


latestUrl=
url;


loading.innerHTML=
"";


let html="";


for(
let browser
in data
){

html+=`

<div class='card'>

<h3>

${browser}

</h3>


<img
src=
"${data[browser].image}"
>


<p>

${data[browser].status}

</p>


<button
onclick=
"downloadImage(
'${data[browser].image}',
'${browser}'
)"

>

Download

</button>

</div>

`;

}


html+=`

<div
style="
grid-column:1/-1;
text-align:center;
margin-top:20px;
">

<button
onclick=
"generatePDF()"
>

Generate PDF

</button>

</div>

`;


results.innerHTML=
html;

}
catch(err){

alert(
"Something failed"
);

}

}



function
downloadImage(
url,
browser
){

const a=
document
.createElement(
"a"
);

a.href=
url;

a.download=
browser+
".png";

a.click();

}



async function
generatePDF(){

const response=
await fetch(
"/generate-pdf",
{

method:
"POST",

headers:{

"Content-Type":
"application/json"

},

body:
JSON.stringify({

screenshots:
latestResults,

url:
latestUrl

})

}

);


const data=
await response
.json();


window.open(
data.pdf
);

}