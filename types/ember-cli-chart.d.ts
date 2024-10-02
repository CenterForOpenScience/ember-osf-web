declare module 'ember-cli-chart' {
    interface DataSet {
        data?: number[];
        backgroundColor?: string[];
        fill?: boolean;
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
        scales?: {
            xAxes?: [
                {
                    display?: boolean
                }

            ],
            yAxes?: [
                {
                    display?: boolean
                }

            ]
        }
    }

    export interface Shape {
        _index: number;
    }
}
