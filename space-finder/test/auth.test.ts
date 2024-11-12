import { ListBucketsCommand, S3Client } from "@aws-sdk/client-s3";
import { AuthService } from "./AuthService";

async function testAuth() {
  console.log("testAuth started");
  const service = new AuthService();
  const loginResult = await service.login("cfms", "iV#j&wEV9uEcvb47");
  const idToken = await service.getIdToken();
  const credentials = await service.generateTemporaryCredentials();
  const buckets = await listBuckets(credentials);
  console.log(buckets);
}

async function listBuckets(credentials: any) {
  console.log(credentials);

  const client = new S3Client({
    credentials: credentials,
  });
  const command = new ListBucketsCommand({});
  const result = await client.send(command);
  return result;
}

testAuth();
