// import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

/**
 * Import all request Types
 */
import {subjectRequest} from './subject';
import {userRequest} from './user';
/** Export all request types */
export {subjectRequest, userRequest} 