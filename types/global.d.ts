const MathJax: any;

// Augment qunit's `assert` typedef for compatibility with ember-percy's `percySnapshot`
interface Assert {
    test: {
        testName: string;
        module: {
            name: string;
        }
    };
}
