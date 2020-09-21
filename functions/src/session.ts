/**
 * Session Class - stores the session information for a particular class.
 */
class ClassSession {
    /**
     * 
     * @param subject_id Subject ID parent in database
     * @param name Name of the session
     * @param session_start Session start timestamp
     * @param session_end Session end timestamp
     */
    constructor(public subject_id: string, public name:string, public session_start:Date, public session_end?:Date){}
}


const classSessionConverter = {
    toFirestore(session:ClassSession): FirebaseFirestore.DocumentData {
        const session_start = FirebaseFirestore.Timestamp.fromDate(session.session_start)
        let session_end;
        if (session.session_end){
            session_end = FirebaseFirestore.Timestamp.fromDate(session.session_end);   
        }
        return {...session, session_end, session_start}
    },
    fromFirestore(
        snapshot: FirebaseFirestore.QueryDocumentSnapshot
    ): ClassSession {
        const data = snapshot.data();
        const session_start = (<FirebaseFirestore.Timestamp> data.session_start).toDate();
        const session_end = (<FirebaseFirestore.Timestamp|undefined> data.session_end)?.toDate();
        return new ClassSession(data.id, data.name,session_start,session_end);
    }
};
