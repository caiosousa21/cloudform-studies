import { Amplify } from "aws-amplify";
import { SignInOutput, fetchAuthSession, signIn } from "@aws-amplify/auth";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";

const awsRegion = "sa-east-1";
const userPoolId = "sa-east-1_1907zwIAt";
const userPoolClientId = "3i6jllgoal4gr8mbn26p0k1peo";
const identityPoolId = "sa-east-1:4b04f69b-3ff6-4810-b562-cbb0c67f9120";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: userPoolId,
      userPoolClientId: userPoolClientId,
      identityPoolId: identityPoolId,
    },
  },
});
export class AuthService {
  public async login(userName: string, password: string) {
    const signInOutput: SignInOutput = await signIn({
      username: userName,
      password: password,
      options: {
        authFlowType: "USER_PASSWORD_AUTH",
      },
    });
    return signInOutput;
  }
  /**
   * call only after login
   */
  public async getIdToken() {
    const authSession = await fetchAuthSession();
    return authSession.tokens?.idToken?.toString();
  }

  public async generateTemporaryCredentials() {
    const idToken = await this.getIdToken();
    const cognitoIdentityPool = `cognito-idp.${awsRegion}.amazonaws.com/${userPoolId}`;
    const cognitoIdentity = new CognitoIdentityClient({
      credentials: fromCognitoIdentityPool({
        identityPoolId: identityPoolId,
        logins: { [cognitoIdentityPool]: idToken },
      }),
    });
    const credentials = await cognitoIdentity.config.credentials();
    return credentials;
  }
}
