import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { server } from "@/tests/mocks/server";
import { createHttpClient } from "./http-client";

const client = createHttpClient({
  baseUrl: "https://api.example.test",
});

describe("http client", () => {
  it("parses successful json responses", async () => {
    server.use(
      http.get("https://api.example.test/products/1", () =>
        HttpResponse.json({ id: "1", title: "Keyboard" }),
      ),
    );

    await expect(client.get("/products/1")).resolves.toEqual({
      id: "1",
      title: "Keyboard",
    });
  });

  it("turns validation responses into AppError", async () => {
    server.use(
      http.post("https://api.example.test/login", () =>
        HttpResponse.json(
          {
            code: "VALIDATION_ERROR",
            message: "Invalid input.",
            errors: {
              email: ["Email is required."],
            },
          },
          { status: 422 },
        ),
      ),
    );

    await expect(client.post("/login", {})).rejects.toMatchObject({
      code: "VALIDATION_ERROR",
      fields: {
        email: ["Email is required."],
      },
      status: 422,
    });
  });
});
