import z from "zod";

export const Step1Schema = z.object({
  username: z.string().min(1, "Vui lòng nhập email hoặc username"),
});

export const Step2Schema = z.object({
  username: z.string(),
  code: z.string().min(6, "Mã xác minh gồm 6 ký tự"),
  newPassword: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự"),
});

export type Step1Type = z.infer<typeof Step1Schema>;
export type Step2Type = z.infer<typeof Step2Schema>;