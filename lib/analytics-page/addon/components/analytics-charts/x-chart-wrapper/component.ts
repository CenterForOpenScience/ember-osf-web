import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';

import { ChartSpec } from 'analytics-page/components/analytics-charts/component';

interface ChartWrapperArgs {
    // Required arguments
    chartSpec: ChartSpec;
    chartEnabled: boolean;
    overlayShown: boolean;
    apiError: boolean;
}

export default class ChartWrapper extends Component<ChartWrapperArgs> {
    @service intl!: Intl;

    get c3ChartConfig(): unknown {
        return this.args.chartSpec.c3ChartConfig;
    }
}
