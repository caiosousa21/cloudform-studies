import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { validateAsSpaceEntry } from "../shared/Validator";
import { createRandomId, parseJson } from "../shared/utils";

export async function postSpaces(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  const randomId = createRandomId();
  const item = parseJson(event.body);
  item.id = randomId;
  validateAsSpaceEntry(item);

  const result = await ddbClient.send(
    new PutItemCommand({
      TableName: process.env.TABLE_NAME,
      Item: marshall(item),
    })
  );
  console.log("DynamoDB result:", result);
  return {
    statusCode: 201,
    body: JSON.stringify({ id: randomId }),
  };
}
