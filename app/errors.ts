/* eslint-disable max-classes-per-file */
export class OsfError extends Error {
    constructor(message: string) {
        super(message);
        this.message = 'An error occured.';
        this.name = 'OsfError';
    }
}

export class NotLoggedIn extends OsfError {}
/* eslint-enable max-classes-per-file */

export class NotUpdatedError extends OsfError {
    constructor(message: string) {
        super(message);
        this.message = 'File name not reset.';
        this.name = 'NotUpdatedError';
    }
}
