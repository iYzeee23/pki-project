import path from "path";
import dotenv from "dotenv";

const ENV_PATH = path.resolve(__dirname, "../.env");

dotenv.config({ path: ENV_PATH });

export default ({ config }: any) => ({
  ...config,
  extra: {
    ...config.extra,
    EXPO_API_BASE_URL: process.env.EXPO_API_BASE_URL
  }
});
