import { Request, Schema } from 'ember-cli-mirage';
import Response from 'ember-cli-mirage/response';

export function confirmedEmailsView(schema: Schema, request: Request) {
    const root = schema.roots.first();
    if (!root.currentUser) {
        return new Response(403);
    }

    const { token } = JSON.parse(request.requestBody);
    const emails = root.currentUser.unconfirmedEmails;
    const index = emails.findIndex(
        (emailInfo: any) => emailInfo.token === token,
    );
    if (index < 0) {
        return new Response(500); // gotta stay true to v1
    }
    emails.splice(index, 1);
    return new Response(200);
}
