import path from "path";
import dotenv from "dotenv";

const ENV_PATH = path.resolve(__dirname, "../.env");

dotenv.config({ path: ENV_PATH });

export default ({ config }: any) => ({
  ...config,
  extra: {
    ...config.extra,
    API_BASE_URL: process.env.API_BASE_URL
  }
});
