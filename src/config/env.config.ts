import { config } from 'dotenv'; 

config({ quiet: true });

class Environment {
  [key: string]: any;
  public NODE_ENV: string = "";
  public SERVICE_NAME: string = "";
  public PORT: string = "";

  public MONGODB_URI: string = "";
  public JWT_SECRET: string = "";
  public JWT_EXPIRATION: string = "";

  public SALT_ROUNDS: string = "";

  public ENCRYPTION_SECRET: string = "";
  public ENCRYPTION_IV: string = "";
  public ENCRYPTION_CYPHER_TYPE: string = "";

  public ONE_PIPE_URL: string = "";
  public ONE_PIPE_API_KEY: string = "";
  public ONE_PIPE_SECRET_KEY: string = "";

  constructor() {
    for (const key of Object.keys(this)) {
      if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
        throw new Error(`Environment variable ${key} is not defined`);
      } else {
        this[key] = process.env[key] || "";
      }
    }
  }
}
export const Env = new Environment();