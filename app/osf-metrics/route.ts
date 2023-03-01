import Route from '@ember/routing/route';
import config from 'ember-get-config';

const {
    OSF: {
        apiUrl,
    },
} = config;

interface MetricsReportName {
    id: string;
    type: 'metrics-report-name';
    links: {
        recent: string,
    };
}

interface MetricsReportNameResponse {
    data: MetricsReportName[];
}

export default class OsfMetricsRoute extends Route {
    async model() {
        const url = `${apiUrl}/_/metrics/reports/`;
        const response = await fetch(url);
        const responseJson: MetricsReportNameResponse = await response.json();
        return responseJson.data.map(metricsReport => metricsReport.id);
    }
}
