import admin from "firebase-admin";
import serviceAccount from "./serviceAccountKey.json" ;
import { createRequire } from "module";
const require = createRequire(import.meta.url);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
