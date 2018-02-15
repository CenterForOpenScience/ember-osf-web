export default function pathJoin() {
    const last = str => str.slice(str.length - 1) === '/';
    const first = str => str.slice(0, 1) === '/';
    let p = arguments[0];

    for (let i = 1; i < arguments.length; i++) {
        const cur = arguments[i];
        if (last(p)) {
            if (first(cur)) {
                p += cur.slice(1);
            } else {
                p += cur;
            }
        } else if (first(cur)) {
            p += cur;
        } else {
            p = `${p}/${cur}`;
        }
    }
    return p;
}
