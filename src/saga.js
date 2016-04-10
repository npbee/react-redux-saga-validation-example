import { takeEvery } from 'redux-saga';
import { put, select, fork, call } from 'redux-saga/effects';

import {
    setValid,
    setInvalid,
    SUBMIT,
    setSubmitting,
    setSubmitted,
    validate,
    VALIDATE
} from './actions';
import createValidator from './createValidator';

function* handleValidate(action) {
    const { validation, field } = action;

    // If given an array of validation rules, we can yield a parallel saga to
    // recursively call the `handleValidate` saga with the individual validation
    if (Array.isArray(validation)) {
        yield validation.map(v => call(handleValidate, {
            ...action,
            validation: v
        }));

        // Return so that when the above parallel saga comes back we don't
        // continue on
        return;
    }

    // Construct the validator object with the supplied validation
    const validator = yield call(createValidator, validation);

    // Grab the current value from the state
    const value = yield select(state => state.fields[field].value);

    try {
        // Test to see if the value is valid
        // This will work even if the test returns a Promise because redux-saga
        // will wait for it to resolve.
        const valid = yield call(validator.test, value);

        // Grab the potential here so that we can remove it if needed
        const error = validator.report(value);

        if (valid) {
            yield put(setValid(field, error));
        } else {
            yield put(setInvalid(field, error));
        }
    } catch (e) {
        // Async error
        console.log(e);
    }
}

function* handleSubmit(action) {
    const { validations, handler } = action;
    const state = yield select(state => state);

    // Before submitting, find any fields that have not yet been validated so
    // that we can validate them.
    const fieldsNotValidated = Object.keys(state.fields).reduce((notValidated, name) => {
        const field = state.fields[name];

        if (field.validated) {
            return notValidated;
        } else {
            return notValidated.concat(name);
        }

    }, []);

    // If there are unvalidated fields, yield a parallel saga and dispatch
    // actions to validaate each field
    if (fieldsNotValidated.length) {
        yield fieldsNotValidated.map(
            name => put(validate(name, validations[name])));
    } else {
        const values = Object.keys(state.fields).reduce((vals, name) => {
            vals[name] = state.fields[name].value;

            return vals;
        }, {});

        yield put(setSubmitting());
        yield call(handler, values);
        yield put(setSubmitted());
    }

}

export default function* rootSaga() {
    yield fork(takeEvery, VALIDATE, handleValidate);
    yield fork(takeEvery, SUBMIT, handleSubmit);
}
