import rules from './rules';
import omit from 'lodash/omit';

export default function createValidator(spec) {

    if (typeof spec === 'string') {
        const [name, params] = spec.split(':');
        const rule = rules[name];

        if (rule) {
            return createValidator({
                ...rule,
                params
            });
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
