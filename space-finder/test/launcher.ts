import { handler } from "../src/services/spaces/handler";

handler(
  {
    httpMethod: "POST",
    body: JSON.stringify({
      location: "São Paulo",
    }),
  } as any,
  {} as any
);
