import { takeEvery } from 'redux-saga';
import { put, select, fork, call } from 'redux-saga/effects';

import {
    setValid,
    setInvalid,
    VALIDATE
} from './actions';
import createValidator from './createValidator';

function* handleValidate (action) {
    const { validation, field } = action;

    if (Array.isArray(validation)) {
        const allValid = yield validation.map(v => call(handleValidate, {
            ...action,
            validation: v
        }));

        return;
    }

    const validator = yield call(createValidator, validation);
    const value = yield select(state => state[field].value);

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

export default function* rootSaga() {
    yield takeEvery(VALIDATE, handleValidate);
}
