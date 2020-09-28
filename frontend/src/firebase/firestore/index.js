import user from "./user";
import subject from "./subject";
import group from "./group";

export default function(store){
    user(store)
    subject(store)
    group(store)
}