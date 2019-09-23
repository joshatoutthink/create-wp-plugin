const fs = require("fs");

const rootDir = `/usr/local/lib/node_modules/create-wp-plugin`;

function copyAndEditFile(file, newContent, newFile) {
  fs.copyFileSync(`${rootDir}/${file}`, newFile);
  const result = newContent.reduce((data, { key, val }) => {
    const regExp = new RegExp(`{{${key}}}`, "g");
    const res = data.replace(regExp, val);
    return res;
  }, fs.readFileSync(newFile, "utf8"));
  return fs.writeFileSync(newFile, result, "utf8");
}

const makeObjIterable = obj => {
  let arr = [];
  Object.entries(obj).forEach(([key, value]) => {
    arr.push({ key, val: value });
  });
  return arr;
};

/*
? EXPECTED DATA OBJ 
{
  plugin_name: 'jsoh is cool', (STRING)
  plugin_uri: 'josh.com', (STRING)
  plugin_description: 'no', (STRING)
  plugin_author: 'josh', (STRING)
  plugin_author_uri: 'jos.com', (STRING)
  need_parcel: true, (BOOLEAN)
  core_class: 'Jsoh_Is_Cool' (STRING)
}
*/

/*
 ? FOLDER STRUCTURE
 plugin_name.php
 classes
  - class-core-class.php
 package.json
 main.js
 scripts
  - main.js
 styles
  - main.scss

*/
/* const a_obj = {
  plugin_name: "josh",
  plugin_uri: "sjo",
  plugin_description: "jsoh is cool",
  plugin_author: "joshhh",
  plugin_author_uri: "josh.com",
  need_parcel: true,
  core_class: "Jsoh_Is_Cool",
}; */

module.exports.scaffoldPlugin = function(answers) {
  //----------
  //?plugin.php
  //----------
  answers.core_class_kabobbed = answers.core_class
    .split("_")
    .join("-")
    .toLowerCase();
  // outcome: plugin-name

  answers.plugin_name_allcaps = answers.core_class.toUpperCase();
  //outcome: PLUGGIN_NAME

  copyAndEditFile(
    "coreFileContent.txt",
    makeObjIterable(answers),
    `${answers.plugin_name}.php`
  );

  //---------
  //?create class dir
  //------
  fs.mkdirSync("./classes");

  //--------
  //?create class.php
  //--------
  copyAndEditFile(
    "coreClassContent.txt",
    makeObjIterable(answers),
    `./classes/class-${answers.core_class_kabobbed}.php`
  );

  //create package.json
  copyAndEditFile("package.txt", makeObjIterable(answers), `package.json`);

  //create main.js
  fs.copyFileSync(`${rootDir}/main.txt`, "main.js");

  //create scripts dir
  fs.mkdirSync("./scripts");
  fs.writeFileSync("./scripts/main.js", "//main.js", "utf8");

  //create styles dir
  fs.mkdirSync("./styles");
  fs.writeFileSync("./styles/main.scss", "//main.scss", "utf8");
};
