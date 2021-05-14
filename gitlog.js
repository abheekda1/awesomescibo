const gitlog = require("gitlog").default;

let parentFolder = __dirname.split("/");
parentFolder.pop();
parentFolder = parentFolder.join("/");
console.log(parentFolder);

const commits = gitlog({
  repo: __dirname,
  number: 20,
  fields: ["hash", "abbrevHash", "subject", "authorName", "authorDateRel"],
});

//console.log(commits);
