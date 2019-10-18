declare module 'ember-cli-chart' {
    interface DataSet {
        data?: number[];
        backgroundColor?: string[];
    }

    export interface ChartData {
        labels?: string[];
        datasets?: DataSet[];
    }

    export interface ChartOptions {
        aspectRatio?: number;
        legend?: {
            display?: boolean,
        };
        onHover?: (_: MouseEvent, shapes: Shape[]) => void;
    }

    export interface Shape {
        _index: number;
    }
}
