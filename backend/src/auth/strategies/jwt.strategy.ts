import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ensureEnvLoaded } from '../../config/env';

ensureEnvLoaded();

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  institutionId?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'dev_secret_key_change_in_prod',
    });
  }

  async validate(payload: JwtPayload) {
    return {
      id: payload.sub,
      sub: payload.sub,
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
      institutionId: payload.institutionId,
    };
  }
}