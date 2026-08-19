import { Hono } from "hono";

const users = [
	{ id: 1, name: "John Doe", email: "john.doe@example.com" },
	{ id: 2, name: "Jane Smith", email: "jane.smith@example.com" },
	{ id: 3, name: "Jim Beam", email: "jim.beam@example.com" },
];

const app = new Hono();

app.get("/", (c) => c.text("Hello World"));

app.get("/users/:id", (c) => {
	const id = c.req.param("id");
	return c.text(`User ID: ${id}のプロフィールです。`);
});

app.get("/users", (c) => c.json(users));

app.post("/api/users", async (c) => {
	try {
		const {name, email} = await c.req.json();

		if (!name || !email) {
			return c.json({ error: "名前とメールアドレスは必須です" }, 400);
		}

		return c.json({
			message: "ユーザーを作成しました",
			user: { id: users.length + 1, name, email },
		}, 201);
	} catch (error) {
		return c.json({ error: "ユーザーの作成に失敗しました" }, 500);
	}
});

app.get("/api/users/:id", async (c) => {
	const id = Number(c.req.param("id"));
	const user = users.find((u) => u.id === id);

	if (user) {
		return c.json(user);
	} else {
		return c.json({ error: "ユーザーが見つかりません" }, 404);
	}
});

app.put("/api/users/:id", async (c) => {
	try {
		const id = Number(c.req.param("id"));
		const updates = await c.req.json();

		if (Object.keys(updates).length === 0) {
			return c.json({ error: "更新するデータがありません" }, 400);
		}

		return c.json({
			message: "ユーザーを更新しました",
			user: { id, ...updates },
		});
	} catch (error) {
		return c.json({ error: "ユーザーの更新に失敗しました" }, 500);
	}
});

app.delete("/api/users/:id", async (c) => {
		const id = Number(c.req.param("id"));

		return c.json({
			message: "ユーザーを削除しました",
			user: { id },
		});
	});

app.notFound((c) => c.json({ error: "Not Found" }, 404));

app.onError((err, c) => {
	console.error(err);

	 return c.json({ error: "Internal Server Error" }, 500);
});

export default app;
