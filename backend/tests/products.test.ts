import { describe, it, expect, beforeAll, afterAll } from "bun:test";

const BASE_URL = "http://localhost:3001";

describe("Products API", () => {
	it("GET /product - should return all products", async () => {
		const response = await fetch(`${BASE_URL}/product`);
		const data = await response.json();
		expect(response.status).toBe(200);
		expect(data.success).toBe(true);
		expect(Array.isArray(data.data)).toBe(true);
	});

	it("POST /product - should create a product (no auth)", async () => {
		const response = await fetch(`${BASE_URL}/product`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				name: "Test Product",
				description: "Test Description",
				price: 100000,
				stock: 10,
				category: "Test",
			}),
		});
		const data = await response.json();
		expect(data.success).toBe(true);
		expect(data.data.name).toBe("Test Product");
	});

	it("GET /product/:id - should return single product", async () => {
		const response = await fetch(`${BASE_URL}/product/1`);
		const data = await response.json();
		expect(response.status).toBe(200);
		expect(data.success).toBe(true);
	});
});