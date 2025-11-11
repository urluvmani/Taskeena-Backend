import bcrypt from "bcrypt"
export const hashPassword = async (password)=>{
try {
    const hashedpass =await bcrypt.hash(password,10)
    return hashedpass
} catch (error) {
    console.log(error)
}
}
export const comparepassword =async  (password, hashedpass)=>{
    try {
        const comparepassword = await bcrypt.compare(password,hashedpass)
        return comparepassword;
    } catch (error) {
    console.log(error)
        
    }
}