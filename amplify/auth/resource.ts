import { defineAuth } from "@aws-amplify/backend";

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  userAttributes: {
    "custom:first_name": {
      dataType: "String",
      mutable: true,
      maxLen: 36,
      minLen: 1,
    },
    "custom:last_name": {
      dataType: "String",
      mutable: true,
      maxLen: 36,
      minLen: 1,
    },
  },  
});
