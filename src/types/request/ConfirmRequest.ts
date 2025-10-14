import z from "zod";

export const ConfirmSchema = z.object({
  username: z.string(),
  code: z.string().regex(/^\d{6}$/, "Mã OTP phải gồm 6 chữ số."),
});

export type ConfirmSchemaType = z.infer<typeof ConfirmSchema>;