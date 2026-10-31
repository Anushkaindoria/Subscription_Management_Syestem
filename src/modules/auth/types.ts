import { SessionUserDTO } from "@/contracts";

export interface AuthSession {
  token: string;
  user: SessionUserDTO;
}

export interface PasswordResetTokenRecord {
  token: string;
  userId: string;
  expiresAt: Date;
}
