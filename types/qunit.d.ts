interface Assert {
    pushResult(assertResult: {
        result: boolean;
        actual: any;
        expected: any;
        message: string;
        negative?: boolean;
    }): void;
}
