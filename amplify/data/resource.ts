import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { schema as generatedSqlSchema } from './schema.sql';
import { subscribe } from "diagnostics_channel";


// Add a global authorization rule
const sqlSchema = generatedSqlSchema.authorization(allow => allow.publicApiKey());

// Set relationships
sqlSchema.setRelationships((models) => [
  models.members.relationships( {
      addresses: a.hasMany("addresses", "member_id"),
      emails: a.hasMany("emails", "member_id"),
      availability: a.hasMany("availability", "member_id"),
      church_member: a.hasMany("church_member", "member_id"),
      label_member: a.hasMany("label_member", "member_id"),
      schedule: a.hasMany("schedule", "member_id"),
    }),
  models.churches.relationships({
    church_member: a.hasMany("church_member", "church_id"),
    labels: a.hasMany("labels", "church_id"),
    schedule: a.hasMany("schedule", "church_id"),
    service: a.hasMany("service", "church_id"),
  }),
  models.labels.relationships({
    label_member: a.hasMany("label_member", "label_id"),
    schedule: a.hasMany("schedule", "label_id"),
  }),
  models.service.relationships({
    schedule: a.hasMany("schedule", "service_id"),
  }),
]);

// Add custom query
sqlSchema.addToSchema({
    getUserWithChurchBySub: a.query()
      // reference custom types added to the schema
      .arguments( {sub: a.string().required()} )
      .returns(a.ref("UserWithChurch").array())
      .handler(a.handler.inlineSql(
          `Select * from ctv.members JOIN ctv.church_member ON members.member_id=church_member.member_id JOIN ctv.churches on church_member.church_id = churches.church_id WHERE members.sub = :sub`
      ))
      .authorization(allow => [allow.guest()]),


      // Define custom types to provide end-to-end typed results
      // for custom queries / mutations
      UserWithChurch: a.customType({
        member_id: a.string(),
        first: a.string(),
        last: a.string(),
        sub: a.string(),
        notes: a.string(),
        gender: a.string(),
        church_member_id: a.string(),
        church_id: a.string(),
        church_name: a.string()
      })
  })


// const sqlSchema = generatedSqlSchema.setAuthorization((models) => [
//   models.members.authorization((allow) => [allow.publicApiKey(), allow.guest(), allow.authenticated()]),
// ]);


/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
});

const combinedSchema = a.combine([schema, sqlSchema]);

export type Schema = ClientSchema<typeof combinedSchema>;
// export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema: combinedSchema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
