var { AppModel } = require('./AppModel');
var Organizations = require("./OrganizationsModel");

const visibilityPlugin = require('objection-visibility').default;
// Import the plugin for check unique email address.
const unique = require('objection-unique')({
    fields: [
        'email'
    ],
    identifiers: ['id']
});

// User Model.
class UsersModel extends visibilityPlugin(unique(AppModel)) {
    // class User extends visibilityPlugin(AppModel) {

    constructor() {
        super();
    }

    static get hidden() {
        return ['password'];
    }

    static get tableName() {
        return 'users';
    }

    /** Each model must have a column (or a set of columns) that uniquely
    *   identifies the rows. The column(s) can be specified using the `idColumn`
    *   property. `idColumn` returns `id` by default and doesn't need to be
    *   specified unless the model's primary key is something else.
    */
    static get idColumn() {
        return 'id';
    }

    // Optional JSON schema. This is not the database schema!
    // No tables or columns are generated based on this. This is only
    // used for input validation. Whenever a model instance is created
    // either explicitly or implicitly it is checked against this schema.
    static get jsonSchema() {

        return {
            type: 'object',
            required: [],
            properties: {}
        };
    }

    static get relationMappings() {
        return {
            languages_user: {
                relation: this.ManyToManyRelation,
                modelClass: Organizations,
                join: {
                    from: 'users.id',
                    through: {
                        from: 'organizationsuser.user_id',
                        to: 'organizationsuser.organization_id'
                    },
                    to: 'organizations.id'
                }
            }
        }
    }
}

module.exports = UsersModel;