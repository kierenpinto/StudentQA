import * as functions from 'firebase-functions';
import { firestoreDB, makeRef } from './dbRefs';
import { Subject, subjectConverter } from './subject';
import { assertString } from './typeassertions';

type SessionTuple = {
    id: string;
    start: Date;
    end?: Date;
}

/**
 * Subject Group class - stores the class group information within a subject. 
 */
class SubjectGroup {
    public join_code: string;
    constructor(public name: string, public sessions: Array<SessionTuple>=[],join_code?: string) {
        if (!join_code) {
            this.join_code = this.generate_code();
        } else {
            this.join_code = join_code;
        }
    }
    makeJoinCode() {
        this.join_code = this.generate_code();
    }
    /**
     * Generate a random join code (algorithm)
     */
    private generate_code() {
        const Overlap = (code: string): boolean => {
            // Check for overlapping join code in the database

            /* COMPLETE THIS!!! */


            return false;
        }
        let randString;
        do {
            randString = Math.random().toString(36).substring(2, 8);
        } while (Overlap(randString));
        return randString;
    }
}

const subjectGroupConverter = {
    toFirestore(group: SubjectGroup): FirebaseFirestore.DocumentData {
        return { ...group };
    },
    fromFirestore(
        snapshot: FirebaseFirestore.QueryDocumentSnapshot
    ): SubjectGroup {
        const data = snapshot.data();
        return new SubjectGroup(data.name, data.sessions || [] , data.join_code);
    }
};

const groupRequest = functions.https.onCall((data_raw, context) => {
    const uid = context.auth?.uid;
    if (!uid) {
        throw new functions.https.HttpsError('permission-denied', "Request has not been authenticated");
    }
    const data = <classRequestData>data_raw;
    return firestoreDB.runTransaction(async transaction => {
        // get parent subject document:
        // Ensure subject ID exists
        assertString(data.subject_id, "Subject ID");
        const subjectRef = makeRef.subjects.withConverter(subjectConverter).doc(data.subject_id);
        const subject = (await transaction.get(subjectRef)).data()
        if(!subject){
            throw new functions.https.HttpsError('not-found', 'Subject not found')
        }
        // get parent Subject Document to check permissions:
        if (!(subject?.isOwner(uid))) {
            // if false (not owner then throw error)
            throw new functions.https.HttpsError('permission-denied', "Not the subject owner");
        }

        // Requester has permissions: now check for the desired action:
        switch (data.action) {
            case 'create':
                return create(data, uid, transaction, subject, subjectRef);
            case 'update':
                return update(data, uid, transaction);
            case 'delete':
                return remove(data, uid, transaction,subject, subjectRef);

            default:
                //return an error
                throw new functions.https.HttpsError('invalid-argument', 
                'Invalid classGroup action request');
        }
    })
})
type classRequestData = {
    action?: string,
    name?: string,
    id?: string,
    subject_id: string,
    updateAction?:string
}

/**
 * Create Group
 * @param data 
 * @param uid 
 * @param transaction 
 */
async function create(data: classRequestData, uid: string, transaction: FirebaseFirestore.Transaction, 
    subject:Subject, subjectRef:FirebaseFirestore.DocumentReference<Subject>) {
    if (!data.name) {
        throw new functions.https.HttpsError('invalid-argument', 
        'No subject group name has been specified in the request')
    }
    const subjectGroup = new SubjectGroup(data.name);
    const groupRef = makeRef.classGroups(data.subject_id).withConverter(subjectGroupConverter).doc();
    subject.groups.push({id:groupRef.id,name:data.name})
    transaction.set(groupRef, subjectGroup)
    transaction.set(subjectRef,subject)
    return { response: 'success' };
}

/**
 * Update Group
 * @param data 
 * @param uid 
 * @param transaction 
 */
async function update(data: classRequestData, uid: string, transaction: FirebaseFirestore.Transaction) {
    if (!data.id) {
        throw new functions.https.HttpsError('invalid-argument', 
        'No subject group id has been specified in the request')
    }
    if (!data.updateAction){
        throw new functions.https.HttpsError('invalid-argument', 
        'No update action has been specified in the request')
    }
    const ref = makeRef.classGroups(data.subject_id).withConverter(subjectGroupConverter).doc();
    const subjectGroup = (await transaction.get(ref)).data();
    if (!subjectGroup) {
        throw new functions.https.HttpsError('not-found', 'No subject group with this id has been found')
    }else{
        
        switch (data.updateAction) {
            case 'rename':
                if (data.name){
                    subjectGroup.name = data.name 
                }else{
                    throw new functions.https.HttpsError('invalid-argument', 
                    "The rename action has no name field");
                }
                break;
        
            default:
                
                throw new functions.https.HttpsError('invalid-argument', "The updateAction is invalid");
        }
    }

    await transaction.update(ref,subjectGroup);
    return { response: 'success' };
}

/**
 * Delete/Remove Group
 * @param data 
 * @param uid 
 * @param transaction 
 */
async function remove(data: classRequestData, uid: string, transaction: FirebaseFirestore.Transaction, 
    subject:Subject, subjectRef:FirebaseFirestore.DocumentReference<Subject>) {
    if (!data.id) {
        throw new functions.https.HttpsError('invalid-argument', 
        'No subject group id has been specified in the request')
    }
    const ref = makeRef.classGroups(data.subject_id).withConverter(subjectGroupConverter).doc(data.id);
    // Unlink other things:
    const groupIndex = subject.groups.findIndex(el=>el.id == data.id);
    if ( groupIndex > 0 ){
        subject.groups.splice(groupIndex,1);
    }else {
        console.error("Couldn't find group to delete from subject. Skipping array splice step.")
    }
    transaction.set(subjectRef,subject);
    // Run delete
    transaction.delete(ref)
    return { response: 'success' };
}

/*
 * HELPER FUNCTIONS
 */


export { groupRequest, SubjectGroup, subjectGroupConverter }