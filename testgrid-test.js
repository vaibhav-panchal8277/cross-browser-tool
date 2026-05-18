require("dotenv").config();

const { Builder } =
require("selenium-webdriver");

async function test(){

let driver;

try{

driver=
await new Builder()

.usingServer(
process.env.TG_URL
)

.withCapabilities({

browserName:"chrome",

"tg:udid":
process.env.TG_UDID,

"tg:userToken":
process.env.TG_TOKEN

})

.build();

console.log(
"Connected successfully"
);

await driver.get(
"https://google.com"
);

console.log(
await driver.getTitle()
);

}
catch(err){

console.log(
"Connection failed:"
);

console.log(
err.message
);

}
finally{

if(driver){

await driver.quit();

}

}

}

test();