export const CHANGE_VALUE = 'CHANGE_VALUE';
export const VALIDATE = 'VALIDATE';
export const SET_INVALID = 'SET_INVALID';
export const SET_VALID = 'SET_VALID';
export const SUBMIT = 'SUBMIT';
export const SUBMITTING = 'SUBMITTING';
export const SUBMITTED = 'SUBMITTED';

// Change the value of a field to a new value
export const changeValue = (field, value) => ({
    type: CHANGE_VALUE,
    field,
    value
});

// Validate an individual field given a specific validation
export const validate = (field, validation) => ({
    type: VALIDATE,
    field,
    validation
});

// Mark a field as invalid with a specific error message
export const setInvalid = (field, error) => ({
    type: SET_INVALID,
    field,
    error
});

// Mark the field as invalid with the error message to be removed
export const setValid = (field, error) => ({
    type: SET_VALID,
    field,
    error
});

// Submit the form
// We'll supply all of the validations for the form as well as a handler
// to call after the form has been validated
export const submit = (validations, handler) => ({
    type: SUBMIT,
    validations,
    handler
});

// Mark the form as submitting for display indication
export const setSubmitting = () => ({
    type: SUBMITTING
});

// Mark the form as submitted for display indication
export const setSubmitted = () => ({
    type: SUBMITTED
});
