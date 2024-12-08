const request = require("supertest");
const app = require("../app");

describe("GET /status", () => {
  it("should return 200 status and OK message", async () => {
    const res = await request(app).get("/status");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("redis", true);
    expect(res.body).toHaveProperty("db", true);
  });
});

describe("POST /users", () => {
  it("should create a new user", async () => {
    const res = await request(app)
      .post("/users")
      .send({ email: "test@example.com", password: "password123" });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("email", "test@example.com");
  });

  it("should return 400 for missing email or password", async () => {
    const res = await request(app)
      .post("/users")
      .send({ password: "password123" });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Missing email or password");
  });
});

describe("GET /files", () => {
  it("should return paginated files", async () => {
    const res = await request(app).get("/files?page=1");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should return an empty array for pages with no data", async () => {
    const res = await request(app).get("/files?page=9999");
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(0);
  });
});

describe("GET /files/:id/data", () => {
  it("should return file content if file exists", async () => {
    const fileId = "existing-file-id";
    const res = await request(app).get(`/files/${fileId}/data`);
    expect(res.status).toBe(200);
    expect(res.text).toBe("File content here");
  });

  it("should return 404 for non-existent file", async () => {
    const fileId = "non-existent-id";
    const res = await request(app).get(`/files/${fileId}/data`);
    expect(res.status).toBe(404);
  });
});
