import nodemailer from "nodemailer";
import { Elysia } from "elysia";

const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST || "smtp.gmail.com",
	port: Number(process.env.SMTP_PORT) || 587,
	secure: false,
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS,
	},
});

interface SendEmailOptions {
	to: string;
	subject: string;
	html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
	try {
		await transporter.sendMail({
			from: process.env.SMTP_FROM || "noreply@ecommerce.com",
			to,
			subject,
			html,
		});
		return { success: true };
	} catch (error: any) {
		console.error("Email send error:", error.message);
		return { success: false, error: error.message };
	}
}

export const emailTemplates = {
	orderConfirmation: (orderId: number, total: number, items: string[]) => ({
		subject: `Order Confirmation #${orderId}`,
		html: `
			<h1>Thank you for your order!</h1>
			<p>Your order #${orderId} has been confirmed.</p>
			<h2>Order Details</h2>
			<ul>
				${items.map((item) => `<li>${item}</li>`).join("")}
			</ul>
			<p><strong>Total: Rp ${total.toLocaleString("id-ID")}</strong></p>
			<p>We will notify you when your order is shipped.</p>
		`,
	}),

	orderShipped: (orderId: number, trackingNumber?: string) => ({
		subject: `Your Order #${orderId} Has Been Shipped`,
		html: `
			<h1>Your order is on its way!</h1>
			<p>Order #${orderId} has been shipped.</p>
			${trackingNumber ? `<p>Tracking Number: <strong>${trackingNumber}</strong></p>` : ""}
			<p>You can track your order status in your account.</p>
		`,
	}),

	passwordReset: (resetToken: string) => ({
		subject: "Reset Your Password",
		html: `
			<h1>Password Reset Request</h1>
			<p>Click the link below to reset your password:</p>
			<p><a href="${process.env.BETTER_AUTH_URL}/reset-password?token=${resetToken}">Reset Password</a></p>
			<p>This link expires in 1 hour.</p>
			<p>If you didn't request this, please ignore this email.</p>
		`,
	}),
};

export const emailModule = new Elysia({ prefix: "/email" })
	.get("/health", async () => {
		try {
			await transporter.verify();
			return { success: true, message: "Email service connected" };
		} catch (error: any) {
			return { success: false, message: error.message };
		}
	});