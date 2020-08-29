

enum UserType {
    Teacher,
    Student,
    Other
}

class User {
    constructor(public uid: string, public name: string, public email: string, public type: UserType) { }
}

const userConverter = {
    toFirestore(user: User): FirebaseFirestore.DocumentData {
        return { uid: user.uid, name: user.name, email: user.email };
    },
    fromFirestore(
        snapshot: FirebaseFirestore.QueryDocumentSnapshot
    ): User {
        const data = snapshot.data();
        const findType = ()=>{
            switch (data.type) {
                case 'teacher':
                    return UserType.Teacher

                case 'student':
                    return UserType.Student
                    
                default:
                    return UserType.Other
            }
        }

        return new User(data.uid, data.name, data.email, findType());
    }
};



export {User,userConverter, UserType};

