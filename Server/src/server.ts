import dotenv from "dotenv";
import { connectDb } from "./database";
import { createApp } from "./app";

dotenv.config();

async function main() {
    await connectDb();

    const app = createApp();
    const port = Number(process.env.PORT);

    app.listen(port, () => console.log(`Server listening on: ${port}`));
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
