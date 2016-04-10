import React, { Component } from 'react';
import debounce from 'lodash/debounce';
import { connect } from 'react-redux';

import { changeValue, validate } from './actions';
import Field from './Field';

const fakeTestforUserName = {
    test(val) {
        return new Promise((resolve, reject) => setTimeout(() => {
            if (val == 'fail') {
                resolve(false);
            } else if (val === 'throw') {
                reject('Error!');
            }

            resolve(true);
        }, 500));
    },
    message: val => `${val} is already taken!`
}

const validation = {
    test: val => fakeApi(val),
    message: `The API says no!`
};

export class Root extends Component {
    constructor(props) {
        super(props);

    }

    handleChange(field, value) {
        this.props.dispatch(changeValue(field, value));
    }

    handleValidate(field, validation) {
        this.props.dispatch(validate(field, validation));
    }

    render() {
        const {
            username,
            email,
            password
        } = this.props;

        return <div className='content'>
            <h1>Redux Saga Validation</h1>

            <Field
                name='email'
                onChange={this.handleChange.bind(this)}
                onValidate={this.handleValidate.bind(this)}
                validateOn='blur'
                validation='email'
                {...email}
            />
            <p className='hint'>
                Try entering an invalid email address.
            </p>

            <Field
                name='username'
                onChange={this.handleChange.bind(this)}
                onValidate={this.handleValidate.bind(this)}
                validateOn='debouncedInput'
                validation={fakeTestforUserName}
                {...username}
            />
            <p className='hint'>
                This one is async and will validate on debounced input.  Try
                entering "fail" to simulate a username already existing.
            </p>

            <Field
                name='password'
                onChange={this.handleChange.bind(this)}
                onValidate={this.handleValidate.bind(this)}
                validateOn='blur'
                validation={['minLength:6', 'doesNotMatch:password']}
                {...password}
            />
            <p className='hint'>
                Validates on multiple rules.  Try entering "password" for a failure case.
            </p>

        </div>
    }
}

export default connect(state => state)(Root);
