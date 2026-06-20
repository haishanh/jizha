import { config } from '@/lib/config';
import { SeqHandlerInput } from '@/lib/utils/common.util';
import * as jose from 'jose';
import assert from 'node:assert';

export type Jwt = {
  sign(d: jose.JWTPayload): Promise<string>;
  verify(d: string): Promise<jose.JWTPayload>;
};

function sign(payload: jose.JWTPayload, secret: string): Promise<string> {
  const alg = 'HS256';
  return (
    new jose.SignJWT(payload)
      .setProtectedHeader({ alg })
      .setIssuedAt()
      // .setExpirationTime('2h')
      .sign(new TextEncoder().encode(secret))
  );
}

async function verify(token: string, secret: string) {
  const { payload } = await jose.jwtVerify(token, new TextEncoder().encode(secret));
  return payload;
}

export function setup(input: SeqHandlerInput<{ jwt?: Jwt }>) {
  // should haven't initialized
  assert(!input.ctx.jwt, 'Expect jwt in ctx');

  input.ctx.jwt = {
    sign: (d: jose.JWTPayload) => sign(d, config.jwtSecret),
    verify: (d: string) => verify(d, config.jwtSecret),
  };
}
