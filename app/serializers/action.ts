import OsfSerializer from './osf-serializer';

export default class ActionSerializer extends OsfSerializer {
    // Because `trigger` is a private method on DS.Model
    attrs: any = {
        ...this.attrs, // from OsfSerializer
        actionTrigger: 'trigger',
    };
}
