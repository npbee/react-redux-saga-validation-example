import rules from './rules';
import omit from 'lodash/omit';

export default function createValidator(spec) {

    // If we're given a string like 'minLength:3', we can see if it exists in
    // our globally defined rules.
    if (typeof spec === 'string') {
        const [name, params] = spec.split(':');
        const rule = rules[name];

        if (rule) {
            return createValidator({
                ...rule,
                params
            });
        } else {
            // Whoops, rule not found...
        }
    }

    const {
        test,
        message,
        params = []
    } = spec;

    const args = Array.isArray(params) ? params : [params];

    return {
        test(value) {
            return test(value, ...args);
        },
        report(value) {
            if (typeof message === 'function') {
                return message(value, ...args);
            } else {
                return message;
            }
        }
    };
}
