import Controller from '@ember/controller';
import { action, get } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { MetricsReportAttrs } from './route';


type ReportFields = {
    keywordFields: string[],
    numericFields: string[],
};


function gatherFields(obj: any): ReportFields {
    const keywordFields: string[] = []
    const numericFields: string[] = []
    for (const fieldName in obj) {
        if (fieldName === 'report_date' || fieldName === 'timestamp') {
            continue;
        }
        const fieldValue = obj[fieldName];
        switch (typeof fieldValue) {
            case 'string':
                keywordFields.push(fieldName);
                break;
            case 'number':
                numericFields.push(fieldName);
                break;
            case 'object':
                const nestedFields = gatherFields(fieldValue);
                keywordFields.push(...nestedFields.keywordFields.map(
                    nestedFieldName => `${fieldName}.${nestedFieldName}`,
                ));
                numericFields.push(...nestedFields.numericFields.map(
                    nestedFieldName => `${fieldName}.${nestedFieldName}`,
                ));
                break;
            default:
                console.log(`ignoring unexpected ${fieldName}: ${fieldValue}`)
        }
    }
    return {
        keywordFields,
        numericFields,
    };
}


export default class MetricsReportDetailController extends Controller {
    queryParams = [
        { daysBack: { scope: 'controller' as const } },
        'yFields',
        'xGroupField',
        'xGroupFilter',
    ]

    @tracked daysBack: string = '13';
    @tracked model: MetricsReportAttrs[] = [];
    @tracked yFields: string[] = [];
    @tracked xGroupField?: string;
    @tracked xField: string = 'report_date';
    @tracked xGroupFilter: string = '';

    get reportFields(): ReportFields {
        const aReport: MetricsReportAttrs = this.model![0];
        return gatherFields(aReport);
    }

    get chartRows(): Array<Array<string|number|null>>{
        if (!this.xGroupField) {
            const fieldNames = [this.xField, ...this.yFields];
            const rows = this.model.map(
                datum => fieldNames.map(
                    fieldName => (get(datum, fieldName) as string | number | undefined) ?? null,
                ),
            );
            return [fieldNames, ...rows];
        }
        const groupedFieldNames = new Set<string>();
        const rowsByX: any = {};
        for (const datum of this.model) {
            const xValue = get(datum, this.xField) as string;
            if (!rowsByX[xValue]) {
                rowsByX[xValue] = {};
            }
            const groupName = get(datum, this.xGroupField) as string;
            if (!this.xGroupFilter || groupName.includes(this.xGroupFilter)) {
                this.yFields.forEach(fieldName => {
                    const groupedField = `${groupName} ${fieldName}`;
                    groupedFieldNames.add(groupedField);
                    const fieldValue = get(datum, fieldName);
                    rowsByX[xValue][groupedField] = fieldValue;
                });
            }
        }
        const rows = Object.entries(rowsByX).map(
            ([xValue, rowData]: [string, any]) => {
                const yValues = [...groupedFieldNames].map(
                    groupedFieldName => (rowData[groupedFieldName] as string | number | undefined) ?? null,
                );
                return [xValue, ...yValues];
            },
        );
        return [
            [this.xField, ...groupedFieldNames],
            ...rows,
        ];
    }

    @action
    yFieldToggle(fieldName: string) {
        if (this.yFields.includes(fieldName)) {
            this.yFields = this.yFields.filter(f => f !== fieldName);
        } else {
            this.yFields = [...this.yFields, fieldName];
        }
    }
}

declare module '@ember/controller' {
    interface Registry {
        'osf-metrics.report-detail': MetricsReportDetailController;
    }
}

