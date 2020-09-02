import * as admin from 'firebase-admin'

admin.initializeApp();

const db = admin.firestore();

// const users = (user: string) => db.collection('users').doc(user);
// const teachers = (teacher: string) => db.collection('teachers').doc(teacher);
// const students = (student: string) => db.collection('students').doc(student);
// const subjects = (subject: string) => db.collection('subjects').doc(subject);
// const classGroups = (classGroup: string, subject: string) => subjects(subject).collection('classes').doc(classGroup);
// const sessions = (session: string, classGroup: string, subject: string) => classGroups(classGroup, subject).collection('sessions').doc(session);
// const questions = (question: string, session: string, classGroup: string, subject: string) => sessions(session, classGroup, subject).collection('questions').doc(question);

const users = db.collection('users');
const teachers = db.collection('teachers');
const students = db.collection('students');
const subjects = db.collection('subjects');
const classGroups = (subject: string) => subjects.doc(subject).collection('classes');
const sessions = (classGroup: string, subject: string) => classGroups(subject).doc(classGroup).collection('sessions');
const questions = (session: string, classGroup: string, subject: string) => sessions(classGroup, subject).doc(session).collection('questions');

const makeRef = {users,teachers,students,subjects,classGroups,sessions, questions}
export {db as firestoreDB, makeRef}