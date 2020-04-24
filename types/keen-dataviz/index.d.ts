declare module 'keen-dataviz' {
    export default class KeenDataviz {
        el(container: string | Element): KeenDataviz;

        chartOptions(options: any): KeenDataviz;

        colors(colors: string[]): KeenDataviz;

        title(title: string): KeenDataviz;

        type(type: string): KeenDataviz;

        dateFormat(format: string): KeenDataviz;

        data(data: any): KeenDataviz;

        prepare(): KeenDataviz;

        render(): KeenDataviz;
    }
}
