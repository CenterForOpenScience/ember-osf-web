import Route from '@ember/routing/route';
import config from 'ember-get-config';

const {
    OSF: {
        apiUrl,
    },
} = config;

export interface MetricsReportAttrs {
    report_date: string, // YYYY-MM-DD
    [attr: string]: string | number | object,
}

interface MetricsReport {
    id: string;
    type: string;
    attributes: MetricsReportAttrs;
}

interface RecentMetricsReportResponse {
    data: MetricsReport[];
}

export default class OsfMetricsRoute extends Route {
    queryParams = {
        daysBack: {
            refreshModel: true,
        },
        yFields: {
            replace: true,
        },
        xGroupField: {
            replace: true,
        },
        xGroupFilter: {
            replace: true,
        },
    }

    async model(params: { daysBack: string, reportName?: string }) {
        const url = `${apiUrl}/_/metrics/reports/${params.reportName}/recent/?days_back=${params.daysBack}`
        const response = await fetch(url);
        const responseJson: RecentMetricsReportResponse = await response.json();
        return responseJson.data.map(datum => datum.attributes);
    }
}
