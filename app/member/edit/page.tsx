"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { v4 as uuidv4 } from "uuid";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";


// BEST INFO
// https://aws.amazon.com/blogs/mobile/new-in-aws-amplify-integrate-with-sql-databases-oidc-saml-providers-and-the-aws-cdk/
//
// https://docs.amplify.aws/react/start/account-setup/
// https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-postgres-mysql-database/

// TODO JLS
// * Figure out how to create a sandbox?
// * Connect to DB
// * Should make schema
// * See if we can get / insert / update data

export default function EditMemberPage() {
  
  // Amplify.configure(outputs);
  // const client = generateClient<Schema>() // use this Data client for CRUDL requests

  // New Member
  // const meMember = {
  //   member_id: uuidv4(),
  //   prefix: '',
  //   first: 'John',
  //   last: 'Simpson',
  //   suffix: '',
  //   email: 'jjsimpson@gmail.com',
  //   email2: 'john@jjsimpson.com',
  //   phone: '(925) 456-4617',
  //   birthday: 0,
  //   active: 'true',
  //   schedualable: 'true',
  //   update: Date.now(),
  //   creation: Date.now(),
  //   sub: ''
  // };


  // client.models.member.create(meMember);
  


  return (
    <div>edit member</div>
  );
}
