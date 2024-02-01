import vine from "@vinejs/vine";
import { CustomErrorrReporter } from "./CustomErrorHandlerReporter.js";

//* error reporter
vine.errorReporter = () => new CustomErrorrReporter();

export const registerSchema = vine.object({
  name: vine.string().minLength(2).maxLength(255),
  email: vine.string().email(),
  password: vine.string().minLength(6).maxLength(255),
});

export const userLoginSchema = vine.object({
    email: vine.string().email(),
    password: vine.string(),
  });
