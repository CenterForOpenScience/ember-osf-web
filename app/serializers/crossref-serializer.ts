import RESTSerializer from '@ember-data/serializer/rest';

export default class CrossrefSerializer extends RESTSerializer {
    normalizeQueryResponse(_: any, primaryModelClass: any, payload: any, __: any, ___: any) {
        const documentHash = {
            data: null,
        };
        const items = payload.message.items;
        documentHash.data = items.map((item: any) => ({
            id: item.id,
            type: primaryModelClass.modelName,
            attributes: this.extractAttributes(primaryModelClass, item),
        }));
        return documentHash;
    }
}
