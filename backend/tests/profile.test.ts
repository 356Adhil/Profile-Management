import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { createApp } from "../src/app";
import { connectDB } from "../src/config/db";
import { Profile } from "../src/models/Profile";

let mongod: MongoMemoryServer;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await connectDB(mongod.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

beforeEach(async () => {
  await Profile.deleteMany({});
});

test("GET /profile returns empty draft when no profile exists", async () => {
  const app = createApp();
  const res = await request(app).get("/profile");
  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty("version", 0);
  expect(res.body).toHaveProperty("skills");
});

test("PUT /profile validates email and returns 400", async () => {
  const app = createApp();

  const res = await request(app)
    .put("/profile")
    .field("name", "Adhil")
    .field("email", "not-an-email")
    .field("bio", "hi")
    .field("skills", JSON.stringify(["js"]))
    .field("version", "0");

  expect(res.status).toBe(400);
  expect(res.body.message).toBe("Validation error");
});

test("PUT /profile creates profile and returns version 1", async () => {
  const app = createApp();

  const res = await request(app)
    .put("/profile")
    .field("name", "Adhil")
    .field("email", "adhil@test.com")
    .field("bio", "bio")
    .field("skills", JSON.stringify(["react", "node"]))
    .field("version", "0");

  expect(res.status).toBe(200);
  expect(res.body.version).toBe(1);
});

test("PUT /profile returns 409 on version conflict", async () => {
  const app = createApp();

  // create
  const created = await request(app)
    .put("/profile")
    .field("name", "Adhil")
    .field("email", "adhil@test.com")
    .field("skills", JSON.stringify(["react"]))
    .field("version", "0");

  expect(created.body.version).toBe(1);

  // update with stale version 0
  const conflict = await request(app)
    .put("/profile")
    .field("name", "Adhil 2")
    .field("email", "adhil@test.com")
    .field("skills", JSON.stringify(["react"]))
    .field("version", "0");

  expect(conflict.status).toBe(409);
});