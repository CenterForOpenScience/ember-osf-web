import { EmberLocation } from '@ember/routing/api';

declare module '@ember/routing/history-location' {
    export default interface HistoryLocation extends EmberLocation {
        history: any;
        location: Location;
        _previousURL: string; // eslint-disable-line @typescript-eslint/naming-convention,no-underscore-dangle,id-denylist,id-match
        _popstateHandler?: () => void; // eslint-disable-line @typescript-eslint/naming-convention,no-underscore-dangle,id-denylist,id-match
        _removeEventListener: () => void; // eslint-disable-line @typescript-eslint/naming-convention,no-underscore-dangle,id-denylist,id-match
    } // eslint-disable-line semi
}
