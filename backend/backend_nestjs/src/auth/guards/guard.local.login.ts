import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class GuardLocalUser extends AuthGuard('local_user') {}