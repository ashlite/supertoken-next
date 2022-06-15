export default function PasswordValidation(value) {
    const regex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&-+=()])(?=\\S+$).{8, 20}$/
    if (regex.test(value)) {
        return undefined
    } else {
        return 'Password must be at least 8 characters long, contain at least one number, one uppercase letter, one lowercase letter, and one special character (@#$%^&-+=())'
    }
}