const express = require("express");

const server = express();
const postRouter = require("./post-router") 
server.use(express.json());
server.use("/api/posts", postRouter);





//listen for request on specfic port on localhost
const port = 8000;
server.listen(port, () => console.log(`/n=== API on port 8000 ===/n`))