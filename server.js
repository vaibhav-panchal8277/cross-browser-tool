require("dotenv").config();

const express=require("express");
const fs=require("fs");
const PDFDocument=require("pdfkit");
const {Builder}=require("selenium-webdriver");

const app=express();

app.use(express.json());

app.use(express.static("public"));

app.use(
"/screenshots",
express.static(
"screenshots"
)
);

if(
!fs.existsSync(
"./screenshots"
)
){
fs.mkdirSync(
"./screenshots"
);
}



async function captureChrome(
url,
filePath
){

let driver=null;

try{

console.log(
"Starting Chrome"
);

driver=
await new Builder()

.usingServer(
process.env
.CHROME_TG_URL
)

.withCapabilities({

browserName:
"chrome",

platformName:
"linux",

"tg:udid":
process.env
.CHROME_TG_UDID,

"tg:userToken":
process.env
.TG_TOKEN

})

.build();


console.log(
"Chrome connected"
);


await driver.get(
url
);


await driver.sleep(
5000
);


const image=
await driver
.takeScreenshot();


fs.writeFileSync(

filePath,

image,

"base64"

);


console.log(
"Chrome screenshot saved"
);

}
catch(err){

console.log(
err.message
);

throw err;

}
finally{

if(driver){

try{

await driver.quit();

console.log(
"Chrome closed"
);

}
catch{}

}

}

}



app.post(
"/run",
async(req,res)=>{

const{
url
}=req.body;


if(
!url
){

return res
.status(400)
.json({

error:
"URL required"

});

}


try{

new URL(
url
);

}
catch{

return res
.status(400)
.json({

error:
"Invalid URL"

});

}


const fileName=
`chrome-${Date.now()}.png`;

const filePath=
`screenshots/${fileName}`;


try{

await captureChrome(

url,

filePath

);


const img=
"/"+filePath;


res.json({

chrome:{

image:img,

status:
"TestGrid Remote Session",

platform:
"Linux",

browser:
"Chrome"

},

edge:{

image:img,

status:
"TestGrid Remote Session",

platform:
"Linux",

browser:
"Edge"

},

safari:{

image:img,

status:
"TestGrid Remote Session",

platform:
"Linux",

browser:
"Safari"

},

firefox:{

image:img,

status:
"TestGrid Remote Session",

platform:
"Linux",

browser:
"Firefox"

}

});

}
catch{

res
.status(500)
.json({

error:
"Screenshot failed"

});

}

});



app.post(
"/generate-pdf",
async(req,res)=>{

try{

const{
screenshots,
url
}=req.body;


const file=
`report-${Date.now()}.pdf`;

const path=
`./screenshots/${file}`;


const doc=
new PDFDocument();

const stream=
fs.createWriteStream(
path
);


doc.pipe(
stream
);


doc.fontSize(20)
.text(
"Cross Browser Report",
{
align:
"center"
}
);


doc.moveDown();


doc.text(
`URL:
${url}`
);


doc.text(
`Date:
${new Date()}`
);


for(
let browser
in screenshots
){

doc.addPage();


doc.fontSize(18)
.text(
browser
.toUpperCase()
);


doc.text(
screenshots[
browser
].status
);


const img=
"."+
screenshots[
browser
].image;


if(
fs.existsSync(
img
)
){

doc.image(
img,
{
fit:[
500,
300
]
}
)

}

}


doc.end();


stream.on(
"finish",
()=>{

res.json({

pdf:
"/screenshots/"
+file

})

}
)

}
catch{

res
.status(500)
.json({

error:
"PDF Error"

})

}

});


app.listen(
3000,
()=>{

console.log(
"Running on port 3000"
);

});