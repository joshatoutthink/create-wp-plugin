#!/usr/bin/env node
const fs = require("fs");

const inquirer = require("inquirer");

const { scaffoldPlugin } = require("./scaffold");

let pluginInfo = {};

inquirer
  .prompt([
    {
      type: "input",
      name: "plugin_name",
      message: "what is your plugins name",
      default: () => {
        if (process.argv[2]) {
          return process.argv[2];
        }
      },
    },
    {
      type: "input",
      name: "plugin_uri",
      message: "what is your plugin's uri",
    },
    {
      type: "input",
      name: "plugin_description",
      message: "briefly describe your plugin",
    },
    {
      type: "input",
      name: "plugin_author",
      message: "what is your name",
    },
    {
      type: "input",
      name: "plugin_author_uri",
      message: "what is your websites uri",
    },
    {
      type: "confirm",
      name: "need_parcel",
      message: "will you be needing javascript, or scss compiled?",
    },
  ])
  .then(answers => {
    pluginInfo = { ...answers };
    inquirer
      .prompt([
        {
          type: "input",
          name: "core_class",
          message: "what is a name of the main class",
          default: () => {
            const pluginName = answers.plugin_name;
            const nameSnakeCased = pluginName
              .split(" ")
              .map(word =>
                word
                  .split("")
                  .map((letter, index) =>
                    index === 0 ? letter.toUpperCase() : letter
                  )
                  .join("")
              )
              .join("_");
            return nameSnakeCased;
          },
        },
      ])
      .then(answers => {
        pluginInfo = { ...pluginInfo, ...answers };

        //scaffolds the plugin from answers
        scaffoldPlugin(pluginInfo);
      });
  });
/* 
function temp_scaffoldPlugin(answers) {
  console.log(answers);
} */
