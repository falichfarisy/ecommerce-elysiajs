import { describe, it, expect, beforeAll, afterAll } from "bun:test";

const BASE_URL = "http://localhost:3001";

describe("Auth API", () => {
	it("POST /api/auth/register - should register a new user", async () => {
		const randomEmail = `test-${Date.now()}@example.com`;
		const response = await fetch(`${BASE_URL}/api/auth/register`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				email: randomEmail,
				password: "test123456",
				username: "Test User",
			}),
		});
		const data = await response.json();
		expect(data.success).toBe(true);
		expect(data.data.user).toBeDefined();
	});
});