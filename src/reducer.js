import {
    VALIDATE,
    SET_VALID,
    SET_INVALID,
    CHANGE_VALUE,
    SUBMITTING,
    SUBMITTED
} from './actions';

const initialFieldState = {
    value: '',
    validated: false,
    validating: false,
    errors: []
};

function handleField(state, action) {
    switch (action.type) {
        case VALIDATE: {
            return {
                ...state,
                validated: false,
                validating: true,
                errors: []
            };
        }
        case CHANGE_VALUE: {
            const { value } = action;

            return {
                ...state,
                value
            };
        }
        case SET_INVALID: {
            const { error } = action;

            return {
                ...state,
                validating: false,
                validated: true,
                errors: state.errors.concat(error)
            };
        }
        case SET_VALID: {
            const { error } = action;

            return {
                ...state,
                validating: false,
                validated: true,
                errors: state.errors.filter(e => e !== error)
            };
        }
        default:
            return state;
    }
}


const initialState = {
    fields: {
        username: { ...initialFieldState },
        email: { ...initialFieldState },
        password: { ...initialFieldState }
    },
    submitting: false,
    submitted: false,
    valid: true
};

export default function(state = initialState, action) {
    switch (action.type) {
        case CHANGE_VALUE:
        case SET_VALID:
        case SET_INVALID:
        case VALIDATE:
            const { field } = action;
            const handledField = handleField(state.fields[field], action);
            const fields = {
                ...state.fields,
                [field]: handledField
            };

            // Compute the overall validity from the individual field validity
            const valid = Object.keys(fields)
                .every(name => fields[name].errors.length === 0);

            return {
                ...state,
                fields,
                valid
            };
        case SUBMITTING:
            return {
                ...state,
                submitting: true
            };
        case SUBMITTED:
            return {
                ...state,
                submitting: false,
                submitted: true
            };
        default:
            return state;
    }
}

