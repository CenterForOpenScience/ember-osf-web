declare module 'ember-basic-dropdown/utils/calculate-position' {
    export default function calculatePosition(
        trigger?: HTMLElement,
        content?: HTMLElement,
        destination?: HTMLElement,
        style?: object,
    ): {
        horizontalPosition: string,
        verticalPosition: string,
        style: {
            top: number,
            left: number,
            right: number,
            width: number,
        },
    };
}
