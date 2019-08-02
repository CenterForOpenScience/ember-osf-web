declare module 'ember-a11y-testing/test-support/audit' {
    export default function a11yAudit(target?: string | Element, axeOptions?: object): Promise<void>;
}
