import user from "./user";
import subject from "./subject";
import group from "./group";
import session from "./session";
import student_subject from "./student_subject";

export default function(store){
    user(store)
    subject(store)
    group(store)
    session(store)
    student_subject(store)
}