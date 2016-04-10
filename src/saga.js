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

    if (Array.isArray(validation)) {
        const allValid = yield validation.map(v => call(handleValidate, {
            ...action,
            validation: v
        }));

        return;
    }

    const validator = yield call(createValidator, validation);
    const value = yield select(state => state.fields[field].value);

    try {
        const valid = yield call(validator.test, value);
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
    const fieldsNotValidated = Object.keys(state.fields).reduce((notValidated, key) => {
        const field = state.fields[key];

        if (field.validated) {
            return notValidated;
        } else {
            return notValidated.concat(validate(key, validations[key]));
        }

    }, []);

    if (fieldsNotValidated.length) {
        yield fieldsNotValidated.map(put);
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
