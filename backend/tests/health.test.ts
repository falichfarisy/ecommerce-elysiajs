import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";

const BASE_URL = "http://localhost:3001";

describe("Health Check", () => {
	it("should return API info", async () => {
		const response = await fetch(`${BASE_URL}/`);
		const data = await response.json();
		expect(data.message).toBe("E-Commerce API");
	});
});