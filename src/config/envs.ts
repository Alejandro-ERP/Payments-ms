import 'dotenv/config';
import * as joi from 'joi';
import { env } from 'process';

const envSchema = joi
  .object({
    PORT: joi.number().required(),
    STRIPE_SECRET_KEY: joi.string().required(),
    STRIPE_PUBLIC_KEY: joi.string().required(),
    STRIPE_SECRET_END_POINT_KEY: joi.string().required(),
    SUCCESS_URL: joi.string().required(),
    CANCEL_URL: joi.string().required(),
  })
  .unknown(true);

const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const envConfig = {
  port: envVars.PORT,
  stripeSecretKey: envVars.STRIPE_SECRET_KEY,
  stripePublicKey: envVars.STRIPE_PUBLIC_KEY,
  stripeSecretEndPointKey: envVars.STRIPE_SECRET_END_POINT_KEY,
  cancelUrl: envVars.CANCEL_URL,
  successUrl: envVars.SUCCESS_URL,
};
