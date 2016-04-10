import React, { Component } from 'react';
import { connect } from 'react-redux';

import { changeValue, validate, submit } from './actions';
import Field from './Field';

const validations = {
    email: 'email',
    password: ['minLength:6', 'doesNotMatch:password'],
    username: {
        test(val) {

            // Fake API call...
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
};

export class Root extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: {}
        };
    }

    handleSubmit(values) {
        return new Promise(resolve => setTimeout(() => {
            resolve();
            this.setState({ data: values });
        }, 500));
    }

    render() {
        const {
            fields,
            onChange,
            onSubmit,
            onValidate,
            submitting,
            submitted,
            valid
        } = this.props;
        const { email, username, password } = fields;
        const { data } = this.state;
        const buttonCopy = submitting ? 'Submitting...' : 'Submit';

        return <div className='content'>
            <h1><a href='https://github.com/npbee/react-redux-saga-validation-example'>Redux Saga Validation</a></h1>

            <form onSubmit={onSubmit(this.handleSubmit.bind(this))}>
                <Field
                    name='email'
                    onChange={onChange}
                    onValidate={onValidate}
                    validateOn='blur'
                    validation={validations.email}
                    {...email}
                />
                <p className='hint'>
                    Try entering an invalid email address.
                </p>

                <Field
                    name='username'
                    onChange={onChange}
                    onValidate={onValidate}
                    validateOn='debouncedInput'
                    validation={validations.username}
                    {...username}
                />
                <p className='hint'>
                    This one is async and will validate on debounced input.  Try
                    entering "fail" to simulate a username already existing.
                </p>

                <Field
                    name='password'
                    onChange={onChange}
                    onValidate={onValidate}
                    validateOn='blur'
                    validation={validations.password}
                    {...password}
                />
                <p className='hint'>
                    Validates on multiple rules.  Try entering "password" for a failure case.
                </p>

                <button type='submit'
                    disabled={submitting || !valid}>{buttonCopy}</button>

                <hr />

                <b>Submitted Values:</b>
                <pre><code>{JSON.stringify(data, null, 2)}</code></pre>
            </form>

        </div>
    }
}


function mapDispatchToProps(dispatch, ownProps) {
    return {

        // We'll have each field call the `onChange` handler with its own
        // field name and new value
        onChange: (field, value) => dispatch(changeValue(field, value)),

        // Each field will call the `onValidate` prop whenever it wants to
        // validate.  This will let the fields decide how and when they want to
        // validate themselves.
        onValidate: (field, validation) => dispatch(validate(field, validation)),

        // This is a curried function that takes the final submit function that
        // the component wants to call _after_ the fields have been validated
        onSubmit: handler => e => {
            e.preventDefault();

            return dispatch(submit(validations, handler));
        }
    };
}

// For this example, just connect the Root component to the entire state
export default connect(state => state, mapDispatchToProps)(Root);
