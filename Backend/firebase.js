import admin from "firebase-admin";
// import serviceAccount from "./serviceAccountKey.json" ;// from Firebase
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
