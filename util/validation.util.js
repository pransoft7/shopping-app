function isEmpty(value) {
    return !value && value.trim().length === '';
}

function validateCredentials(email, password) {
    return (
        email && email.includes('@', '.') &&
        password && password.trim().length >= 4
    );

}

function validateUserDetails(email, password, name, street, postal, city) {
    return (
        validateCredentials(email, password) &&
        !isEmpty(name) &&
        !isEmpty(street) &&
        !isEmpty(postal) &&
        !isEmpty(city)
    );
}

function isEmailConfirmed(email, confirmEmail) {
    return email === confirmEmail;
}

function isPasswordConfirmed(password, confirmPassword) {
    return password === confirmPassword;
}

module.exports = {
    validateUserDetails,
    isEmailConfirmed,
    isPasswordConfirmed
};