import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Env } from "@config/index";


type JwtRawPayload = Record<string, string> & { id: string };

export class JWT {
  private JWT_SECRET: string = Env.JWT_SECRET;
  private ENCRYPTION_SECRET: string = Env.ENCRYPTION_SECRET;
  private ENCRYPTION_IV: string = Env.ENCRYPTION_IV;
  private JWT_EXPIRATION: string = Env.JWT_EXPIRATION;
  private ENCRYPTION_CYPHER_TYPE: string = Env.ENCRYPTION_CYPHER_TYPE;

  public createEncryptedToken(payload: object): string {
    // @ts-ignore
    const token = jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRATION,
    });

    const cipher = crypto.createCipheriv(
      this.ENCRYPTION_CYPHER_TYPE,
      Buffer.from(this.ENCRYPTION_SECRET, "base64"),
      Buffer.from(this.ENCRYPTION_IV, 'base64')
    );
    let encrypted = cipher.update(token, "utf8", "hex");
    encrypted += cipher.final("hex");

    return encrypted;
  }

  decryptAndVerifyToken(
    encryptedToken: string
  ): JwtRawPayload | null {
    try {
      const decipher = crypto.createDecipheriv(
        this.ENCRYPTION_CYPHER_TYPE,
        Buffer.from(this.ENCRYPTION_SECRET, "base64"),
        Buffer.from(this.ENCRYPTION_IV, "base64")
      );
      let decrypted = decipher.update(encryptedToken, "hex", "utf8");
      decrypted += decipher.final("utf8");

      const decoded = jwt.verify(decrypted, this.JWT_SECRET);
      return decoded as JwtRawPayload;
    } catch (err) {
      console.error("Token verification failed", err);
      return null;
    }
  }
}
