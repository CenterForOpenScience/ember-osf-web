import { Factory, ModelInstance, trait, Trait } from 'ember-cli-mirage';
import { biosampleRecord } from 'ember-osf-web/mirage/fixtures/cedar-records/cedar-record.biosample';
import CedarMetadataRecordModel from 'ember-osf-web/models/cedar-metadata-record';
import CedarMetadataTemplateModel from 'ember-osf-web/models/cedar-metadata-template';

interface CedarMetadataRecordTraits {
    isDraft: Trait;
}

export default Factory.extend<CedarMetadataRecordModel & CedarMetadataRecordTraits>({
    metadata() {
        return biosampleRecord;
    },

    afterCreate(record, server) {
        // eslint-disable-next-line max-len
        const template = server.schema.cedarMetadataTemplates.find('2') as ModelInstance<CedarMetadataTemplateModel>;

        record.update({
            template,
        });
    },

    isPublished() {
        return true;
    },

    isDraft: trait({
        afterCreate(record) {
            record.update({
                isPublished: false,
            });
        },
    }),
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        'cedar-metadata-record': CedarMetadataRecordModel;
    } // eslint-disable-line semi
}


declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        'cedarMetadataRecords': CedarMetadataRecordModel;
    } // eslint-disable-line semi
}
