const last = (str: string) => str.slice(-1) === '/';
const first = (str: string) => str.slice(0, 1) === '/';

export default function pathJoin(...args: string[]): string {
    return args.slice(1).reduce((acc, val) => {
        let p: string;

        if (last(acc)) {
            p = first(val) ? val.slice(1) : val;
        } else if (first(val)) {
            p = val;
        } else {
            p = `/${val}`;
        }

        return `${acc}${p}`;
    }, args[0]);
}
