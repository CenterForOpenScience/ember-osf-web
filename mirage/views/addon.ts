import { Schema } from 'ember-cli-mirage';

export function getAddons(schema: Schema) {
    const { addons } = schema;

    return addons.all();
}
