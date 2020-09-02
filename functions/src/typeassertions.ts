/**
 * Asserts that a string is present otherwise an exception is triggered.
 * @param str The string to check the assertion against
 * @param txt Text to add to the error message: Not Valid String Type for : ${txt}
 */
function assertString(str:string,txt?:string){
    if (!(typeof(str) === 'string')){
        if (txt){
            throw new TypeError("Not Valid String Type for:" + txt);
        }else{
            throw new TypeError("Not Valid String Type");
        }
    }
}

export {assertString}