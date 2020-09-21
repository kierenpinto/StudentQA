import authCallbacks from './authCallbacks'
import firestore from './firestore'
export default function(store){
    authCallbacks(store)
    firestore(store)
}