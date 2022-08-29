import { Response } from 'ember-cli-mirage';

export function postCountedUsage() {
    // no need to actually store metrics in mirage
    return new Response(201);
}
