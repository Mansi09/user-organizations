exports.up = async function (knex) {

    // Tables
    return knex.schema
        .createTableIfNotExists("organizations", tbl => {
            tbl.specificType("id", "serial")
            tbl.specificType("name", "character varying");
            tbl.specificType("is_active", "character varying");
            tbl.specificType('created_at', 'timestamp without time zone')
            tbl.specificType('deleted_at', 'timestamp without time zone')
            tbl.specificType('updated_at', 'timestamp without time zone')
        })

        .createTableIfNotExists("email_templates", tbl => {
            tbl.specificType("id", "serial")
            tbl.specificType("slug", "character varying");
            tbl.specificType("title", "character varying");
            tbl.specificType("notes", "text");
            tbl.specificType("content", "text");
            tbl.specificType("all_content", "json");
            tbl.specificType('created_at', 'timestamp without time zone')
            tbl.specificType('deleted_at', 'timestamp without time zone')
            tbl.specificType('updated_at', 'timestamp without time zone')
        })

        .createTableIfNotExists("roles", tbl => {
            tbl.specificType("id", "serial")
            tbl.specificType("name", "character varying");
            tbl.specificType('created_at', 'timestamp without time zone')
            tbl.specificType('deleted_at', 'timestamp without time zone')
            tbl.specificType('updated_at', 'timestamp without time zone')
        })

        .createTableIfNotExists("organizationsuser", tbl => {
            tbl.specificType("id", "serial")
            tbl.specificType("user_id", "bigint");
            tbl.specificType("oraganization_id", "bigint")
            tbl.specificType('created_at', 'timestamp without time zone')
            tbl.specificType('deleted_at', 'timestamp without time zone')
            tbl.specificType('updated_at', 'timestamp without time zone')
        })

        .createTableIfNotExists("users", tbl => {
            tbl.specificType("id", "serial")
            tbl.specificType("first_name", "character varying");
            tbl.specificType("last_name", "character varying");
            tbl.specificType("email", "character varying");
            tbl.specificType("password", "character varying");
            tbl.boolean("is_active").defaultTo(true)
            tbl.boolean("is_verify").defaultTo(false)
            tbl.specificType("forgot_password_token", "character varying");
            tbl.specificType("forgot_password_token_expiry_time", 'timestamp without time zone')
            tbl.specificType("email_verify_token", "character varying");
            tbl.specificType("token_expiry", 'timestamp without time zone')
            tbl.specificType("role_id", "bigint");
            tbl.specificType('created_at', 'timestamp without time zone')
            tbl.specificType('deleted_at', 'timestamp without time zone')
            tbl.specificType('updated_at', 'timestamp without time zone')
        })
}

exports.down = knex => knex.schema.dropTableIfExists("todo");
