import { attr } from '@ember-data/model';
import humanFileSize from 'ember-osf-web/utils/human-file-size';
import OsfModel from './osf-model';

export default class InstitutionSummaryMetricModel extends OsfModel {
    @attr('number') publicProjectCount!: number;
    @attr('number') privateProjectCount!: number;
    @attr('number') userCount!: number;
    @attr('number') publicRegistrationCount!: number;
    @attr('number') publishedPreprintCount!: number;
    @attr('number') embargoedRegistrationCount!: number;
    @attr('number') storageByteCount!: number;
    @attr('number') publicFileCount!: number;
    @attr('number') monthlyLoggedInUserCount!: number;
    @attr('number') monthlyActiveUserCount!: number;
    @attr('string') reportYearmonth!: string;

    get convertedStorageCount(): string {
        return humanFileSize(parseFloat(this.storageByteCount.toFixed(1)));
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'institution-summary-metric': InstitutionSummaryMetricModel;
    } // eslint-disable-line semi
}
