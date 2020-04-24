declare module 'keen-analysis' {
    export default class KeenAnalysis {
        constructor(params: { projectId: string, readKey: string });

        query(type: string, params: any): Promise<any>;
    }
}
