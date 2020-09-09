/**
 * Asserts that a string is present otherwise an exception is triggered.
 * @param str The string to check the assertion against
 * @param msg Text to add to the error message: Not Valid String Type for : ${txt}
 */
function assertString(str:string,msg?:string){
    if (!(typeof(str) === 'string')){
        if (msg){
            throw new TypeError("Not Valid String Type for:" + msg);
        }else{
            throw new TypeError("Not Valid String Type");
        }
    }
}

/**
 * Asserts that a boolean is true otherwise an exception is triggered.
 * @param bool The boolean to check the assertion against
 * @param msg Text to add to the error message: Not Valid String Type for : ${txt}
 */
function assertTrue(bool:boolean, msg?:string){
    if (bool == true){
        if (msg){
            throw new TypeError("True Assertion failed- False value Boolean for:" + msg);
        }else{
            throw new TypeError("True Assertion failed- False value Boolean");
        }
    }
}

export {assertString, assertTrue}