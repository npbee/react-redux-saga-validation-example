import {
    VALIDATE,
    SET_VALID,
    SET_INVALID,
    CHANGE_VALUE
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
                validated: false,
                errors: state.errors.concat(error)
            };
        }
        case SET_VALID: {
            const { error } = action;

            return {
                ...state,
                validating: false,
                validated: state.errors.length === 0,
                errors: state.errors.filter(e => e !== error)
            };
        }
        default:
            return state;
    }
}


const initialState = {
    username: { ...initialFieldState },
    email: { ...initialFieldState },
    password: { ...initialFieldState }
};

export default function(state = initialState, action) {
    switch (action.type) {
        case CHANGE_VALUE:
        case SET_VALID:
        case SET_INVALID:
        case VALIDATE:
            const { field } = action;
            const handledField = handleField(state[field], action);

            return {
                ...state,
                [field]: handledField
            };
        default:
            return state;
    }
}

