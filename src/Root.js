import React, { Component } from 'react';
import debounce from 'lodash/debounce';
import { connect } from 'react-redux';

import { changeValue, validate, submit } from './actions';
import Field from './Field';

const validations = {
    email: 'email',
    password: ['minLength:6', 'doesNotMatch:password'],
    username: {
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
            submitting,
            submitted,
            onChange,
            onValidate,
            onSubmit,
            valid
        } = this.props;
        const { email, username, password } = fields;
        const { data } = this.state;
        const buttonCopy = submitting ? 'Submitting...' : 'Submit';

        return <div className='content'>
            <h1>Redux Saga Validation</h1>

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
        onChange: (field, value) => dispatch(changeValue(field, value)),
        onValidate: (field, validation) => dispatch(validate(field, validation)),
        onSubmit: handler => e => {
            e.preventDefault();

            return dispatch(submit(validations, handler));
        }
    };
}

export default connect(state => state, mapDispatchToProps)(Root);
