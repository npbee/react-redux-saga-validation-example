import React, { Component } from 'react';
import debounce from 'lodash/debounce';
import startCase from 'lodash/startCase';
import noop from 'lodash/noop';

export default class Field extends Component {
    constructor(props) {
        super(props);

        this.handleDebouncedInput = this.props.validateOn === 'debouncedInput' ?
            debounce(this.handleValidate.bind(this), 300) : noop;
    }

    handleChange(e) {
        const { name } = this.props;
        const { value } = e.target;

        this.props.onChange(name, value);

        this.handleDebouncedInput();
    }

    handleBlur() {
        if (this.props.validateOn === 'blur') {
            return this.handleValidate();
        }
    }

    handleValidate() {
        const { name, onValidate, validation } = this.props;

        return onValidate(name, validation);
    }

    render() {
        const {
            errors,
            name,
            validated,
            validating,
            value
        } = this.props;

        const hasErrors = errors.length > 0;

        return <div className='field'>
            <label>{startCase(name)}</label>
            <input
                text="text"
                value={value}
                placeholder={name}
                onChange={this.handleChange.bind(this)}
                onBlur={this.handleBlur.bind(this)}
            />

            {validating && <div className='field-status field-status--loading'>
                Checking..
            </div>}

            {validated && <div className='field-status field-status--validated'>
                Ok!
            </div>}

            {hasErrors && <div className='field-status field-staus--errors'>
                {errors.map(e => <div key={e} className='field-status__error'>{e}</div>)}
            </div>}
        </div>;
    }
}
