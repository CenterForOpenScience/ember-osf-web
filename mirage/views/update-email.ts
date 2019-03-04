import { HandlerContext, Request, Schema } from 'ember-cli-mirage';

export function updateEmails(this: HandlerContext, schema: Schema, request: Request) {
    const { parentID } = request.params;
    const { emailID } = request.params;
    const emailList = schema.users.find(parentID).emails;
    const attrs = this.normalizedRequestAttrs('user-email');
    const updatedInfo = schema.userEmails.find(emailID).update(attrs);

    /*
    // If the user is updating an email to be primary,
    // manually make all other emails primary = false
    */
    if (attrs.primary) {
        emailList.models.forEach(email => {
            if (email.id !== emailID) {
                const updatedEmail = email;
                updatedEmail.primary = false;
                updatedEmail.save();
            }
        });
    }

    return updatedInfo;
}

export function createEmails(this: HandlerContext, schema: Schema, request: Request) {
    const { parentID } = request.params;
    const attrs = this.normalizedRequestAttrs('user-email');
    const user = schema.users.find(parentID);
    /*
    // If the user is adding an email, check if primary.
    // If has primary value use that. Otherwise it's false.
    */
    const primary = attrs.primary || false;

    const email = schema.userEmails.create({ ...attrs, user, confirmed: false, primary });

    return email;
}
