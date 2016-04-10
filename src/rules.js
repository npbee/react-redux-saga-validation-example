import { isEmail, matches } from 'validator';

const minLength = {
    test: (val, threshold) => val.length > parseInt(threshold),
    message: (val, threshold) => `Value must be greater than ${threshold}.`
};

const email = {
    test: isEmail,
    message: 'Please input a valid email address.'
};

const doesNotMatch = {
    test: (val, str) => !matches(val, str),
    message: (_, str) => `Your password should not contain the phrase "${str}."`
};

export default {
    doesNotMatch,
    minLength,
    email
}
