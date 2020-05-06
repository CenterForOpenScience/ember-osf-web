declare module 'mime-types' {
    export default class Mime {
        static types: any;
        static lookup(filename: string): string | false;
    }
}
