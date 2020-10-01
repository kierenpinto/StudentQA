import * as functions from 'firebase-functions';
import { firestoreDB, makeRef } from './dbRefs';
import { assertString } from './typeassertions';
import { SubjectGroup, subjectGroupConverter } from './group';
import { subjectConverter } from './subject';
import * as admin from 'firebase-admin';

const Timestamp = admin.firestore.Timestamp;
/**
 * Session Class - stores the session information for a particular class.
 */
class Session {
    /**
     * 
     * @param name Name of the session
     * @param session_start Session start timestamp
     * @param session_end Session end timestamp
     */
    constructor(public name: string, public session_start: Date, public session_end?: Date) { }
}


const sessionConverter = {
    toFirestore(session: Session): FirebaseFirestore.DocumentData {
        const session_start = Timestamp.fromDate(session.session_start)
        if (session.session_end) {
            const session_end = Timestamp.fromDate(session.session_end);
            return { name:session.name, session_end, session_start }
        } else {
            return { name:session.name, session_start }
        }
        
    },
    fromFirestore(
        snapshot: FirebaseFirestore.QueryDocumentSnapshot
    ): Session {
        const data = snapshot.data();
        const session_start = (<FirebaseFirestore.Timestamp>data.session_start).toDate();
        const session_end = (<FirebaseFirestore.Timestamp | undefined>data.session_end)?.toDate();
        return new Session(data.name, session_start, session_end);
    }
};

type classRequestData = {
    action?: string,
    name?: string,
    id?: string,
    subject_id: string,
    group_id: string,
    updateAction?: string
}

const sessionRequest = functions.https.onCall((data_raw, context) => {
    const uid = context.auth?.uid;
    if (!uid) {
        throw new functions.https.HttpsError('permission-denied', "Request has not been authenticated");
    }
    const data = <classRequestData>data_raw;
    return firestoreDB.runTransaction(async transaction => {
        try {
            assertString(data.subject_id, "Subject ID");
            assertString(data.group_id, "Group ID"); 
        } catch (error) {
            throw new functions.https.HttpsError('not-found',error)
        }
        const subjectRef = makeRef.subjects.withConverter(subjectConverter).doc(data.subject_id);
        const subject = (await transaction.get(subjectRef)).data()
        const groupRef = makeRef.classGroups(data.subject_id).withConverter(subjectGroupConverter).doc(data.group_id);
        const group = (await transaction.get(groupRef)).data();
        if (!(group)) {
            throw new functions.https.HttpsError('not-found', 'SubjectGroup not found');
        }
        if (!subject) {
            throw new functions.https.HttpsError('not-found', 'Subject not found')
        }
        if (!(subject?.isOwner(uid))) {
            // if false (not owner then throw error)
            throw new functions.https.HttpsError('permission-denied', "Not the subject owner");
        }

        // Requester has permissions: now check for the desired action:
        switch (data.action) {
            case 'create':
                return create(data, transaction, group, groupRef);
            case 'update':
                return update(data, transaction, group, groupRef);
            case 'delete':
                return remove(data, transaction, group, groupRef);

            default:
                //return an error
                throw new functions.https.HttpsError('invalid-argument',
                    'Invalid classGroup action request');
        }
    })
})

/**
 * Create Session
 * @param data 
 * @param transaction 
 */
async function create(data: classRequestData, transaction: FirebaseFirestore.Transaction, subjectGroup: SubjectGroup, groupRef: FirebaseFirestore.DocumentReference<SubjectGroup>) {
    const startTime = new Date() // put starttime here
    const session = new Session("", startTime);
    const sessionRef = makeRef.sessions(data.group_id, data.subject_id).withConverter(sessionConverter).doc();
    //Check that a session doesn't already exist:
    subjectGroup.sessions.forEach(sess=> {
        if (!sess.end) throw new functions.https.HttpsError('invalid-argument',
        'Invalid classGroup action request');
    } )
    subjectGroup.sessions.push({ id: sessionRef.id, start: startTime });
    if (subjectGroup.sessions.length > 10){
        // Only keeps the most recent 10 sessions in cache
        subjectGroup.sessions.shift();
    }
    transaction.set(sessionRef, session)
    transaction.set(groupRef, subjectGroup)
    return { response: 'success' }
}

/**
 * Update Session ( To End The Session )
 * @param data
 * @param transaction 
 */
async function update(data: classRequestData, transaction: FirebaseFirestore.Transaction,subjectGroup: SubjectGroup, groupRef: FirebaseFirestore.DocumentReference<SubjectGroup>) {
    if (!data.id) {
        throw new functions.https.HttpsError('invalid-argument', 
        'No session id has been specified in the request')
    }
    if (!data.updateAction){
        throw new functions.https.HttpsError('invalid-argument', 
        'No update action has been specified in the request')
    }
    switch (data.updateAction) {
        case "end":
            const sessionIndex = subjectGroup.sessions.findIndex(el=>el.id ===data.id)
            if( sessionIndex < 0){
                throw new functions.https.HttpsError('not-found', "Could not find session in group object");
            }
            const sessionRef = makeRef.sessions(data.group_id, data.subject_id).withConverter(sessionConverter).doc(data.id);
            const session = await transaction.get(sessionRef)
            const sessionData = session.data();
            if (!session.exists || !sessionData){
                throw new functions.https.HttpsError('not-found', "Could not find session document");
            }
            if (sessionData.session_end){
                // Check if the session has ended previously.
                throw new functions.https.HttpsError('already-exists','Session has already ended - cannot process action');
            }
            const session_end = new Date();
            subjectGroup.sessions[sessionIndex].end = session_end;
            sessionData.session_end = session_end;
            transaction.set(groupRef,subjectGroup);
            transaction.set(sessionRef,sessionData);
            return { response: 'success' }; // put something here
        default:              
            throw new functions.https.HttpsError('invalid-argument', "The updateAction is invalid");
    }
}

/**
 * Delete/Remove Session
 * @param data
 * @param transaction 
 */
async function remove(data: classRequestData, transaction: FirebaseFirestore.Transaction, subjectGroup: SubjectGroup, groupRef: FirebaseFirestore.DocumentReference<SubjectGroup>) {
    // transaction.delete()
}
export default sessionRequest;
export { sessionRequest };