import { EmberLocation } from '@ember/routing/api';

declare module '@ember/routing/history-location' {
    export default interface HistoryLocation extends EmberLocation {
        history: any;
        location: Location;
        _previousURL: string; // tslint:disable-line:variable-name
        _popstateHandler?: () => void; // tslint:disable-line:variable-name
        _removeEventListener: () => void; // tslint:disable-line:variable-name
    } // eslint-disable-line semi
}
