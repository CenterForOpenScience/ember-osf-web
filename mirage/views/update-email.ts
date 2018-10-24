import { HandlerContext, Request, Schema } from 'ember-cli-mirage';
import UserEmail from 'ember-osf-web/models/user-email';

export function updateEmails(this: HandlerContext, schema: Schema, request: Request) {
    const { parentID } = request.params;
    const { emailID } = request.params;
    const emailList = schema.users.find(parentID).emails;
    const attrs = this.normalizedRequestAttrs();
    const updatedInfo = schema.userEmails.find(emailID).update(attrs);

    /*
    // If the user is updating an email to be primary,
    // manually make all other emails primary = false
    */
    if (attrs.primary) {
        emailList.models.forEach((email: UserEmail) => {
            if (email.id !== emailID) {
                const updatedEmail = email;
                updatedEmail.primary = false;
                updatedEmail.save();
            }
        });
    }

    return updatedInfo;
}
