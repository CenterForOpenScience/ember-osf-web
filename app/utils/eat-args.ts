/**
 * A utility to eat up arguments.
 *
 * This is useful for avoiding linting rules about unused arguments.
 *
 * @return {boolean} Whether it ate any arguments.
 */
export default function eatArgs(...args: any[]) {
    if (args.length) {
        return true;
    } else {
        return false;
    }
}
