import dotenv from "dotenv";
import path from "path";
import http from "http";
import { connectDb } from "./database";
import { createApp } from "./app";
import { Server } from "socket.io";

const ENV_PATH = path.resolve(__dirname, "../../.env");

dotenv.config({ path: ENV_PATH });

async function main() {
    await connectDb();

    const app = createApp();
    const port = Number(process.env.PORT);

    const server = http.createServer(app);

    const io = new Server(server, {
        cors: {
            origin: process.env.CORS_ORIGIN
        },
    });

    app.set("io", io);

    server.listen(port, () => console.log(`Server listening on: ${port}`));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
