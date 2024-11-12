import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { postSpaces } from "./PostSpaces";
import { getSpaces } from "./GetSpaces";
import { updateSpace } from "./UpdateSpaces";
import { deleteSpace } from "./DeleteSpaces";
import { JsonError, MissingFieldError } from "../shared/Validator";

const ddbClient = new DynamoDBClient({});

const httpMethodsMap = {
  GET: getSpaces,
  POST: postSpaces,
  PUT: updateSpace,
  DELETE: deleteSpace,
};

async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  let message: string;

  try {
    if (httpMethodsMap[event.httpMethod]) {
      return httpMethodsMap[event.httpMethod](event, ddbClient);
    }
  } catch (error) {
    if (error instanceof MissingFieldError) {
      return {
        statusCode: 400,
        body: JSON.stringify(error.message),
      };
    }
    if (error instanceof JsonError) {
      return {
        statusCode: 400,
        body: JSON.stringify(error.message),
      };
    }
    return {
      statusCode: 500,
      body: JSON.stringify(error.message),
    };
  }

  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify(message),
  };
  return response;
}

export { handler };
