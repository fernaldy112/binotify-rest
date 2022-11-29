import { Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface UserInfo {
  [key: string]: string;
}

function isValidId(id: string): boolean {
  return /^\d+$/.test(id) && +id != 0;
}

function anyOf(...preds: boolean[]) {
  return new AnyOf(preds);
}

function allOf(...preds: boolean[]) {
  return new AnyOf(preds, true);
}

class AnyOf {
  constructor(private preds: boolean[], private inverted: boolean = false) {}

  is(value: boolean) {
    if (this.inverted) {
      value = !value;
    }

    for (const pred of this.preds) {
      if (pred === value) {
        return !this.inverted;
      }
    }

    return this.inverted;
  }
}

function getClientUserId(req: Request) {
  const token = req.headers.authorization!.split(" ")[1];
  const userInfo: UserInfo = jwt.verify(token, "binotify") as JwtPayload;

  return +userInfo.user_id;
}

export { isValidId, anyOf, allOf, UserInfo, getClientUserId };
