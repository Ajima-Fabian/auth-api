import request from "supertest";
import app from "../app.js";

describe("Auth API Tests", () => {
  it("should return 200 for health check", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
  });
});