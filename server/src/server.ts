import dotenv from "dotenv";
import path from "path";
import { connectDb } from "./database";
import { createApp } from "./app";

const ENV_PATH = path.resolve(__dirname, "../../.env");

dotenv.config({ path: ENV_PATH });

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
