import vine from "@vinejs/vine";
import { CustomErrorrReporter } from "./CustomErrorHandlerReporter.js";

vine.errorReporter = () => new CustomErrorrReporter();

export const newsSchema = vine.object({
  title: vine.string().minLength(10).maxLength(255),
  content: vine.string().minLength(10).maxLength(30000),
});
