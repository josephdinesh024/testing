const bcrypt = require('bcrypt');


export const isPasswordCorrect = async(password,hashPassword)=>{
        return await bcrypt.compare(password, hashPassword);
    }

export const hashPassword = async(password)=>{
    return await bcrypt.hash(password, 10)
}