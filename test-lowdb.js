// import { LowSync, JSONFileSync } from "lowdb";

// const title = "lowdb is super awesome";
// const adapter = new JSONFileSync("db.json");
// const db = new LowSync(adapter);

// db.read();
// db.data = { posts: [] };

// db.data.posts.push({ title });

// db.write();

const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("db.json");
const db = low(adapter);

// Set some defaults
db.defaults({ posts: [], user: {} }).write();

// Add a post
db.get("posts").push({ id: 1, title: "lowdb is awesome" }).write();

// Set a user name using Lodash shorthand syntax
db.set("user.name", "typicode").write();
