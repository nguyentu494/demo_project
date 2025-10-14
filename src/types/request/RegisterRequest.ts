import z from "zod";

export const RegisterSchema = z
  .object({
    username: z
      .string()
      .min(3, "Tên đăng nhập phải có ít nhất 3 ký tự")
      .regex(/^[a-zA-Z0-9_]+$/, "Chỉ chứa chữ, số và dấu gạch dưới"),
    email: z.string().email("Email không hợp lệ"),
    password: z
      .string()
      .min(8, "Tối thiểu 8 ký tự")
      .regex(/\d/, "Phải chứa ít nhất 1 số")
      .regex(/[A-Z]/, "Phải chứa ít nhất 1 chữ hoa")
      .regex(/[a-z]/, "Phải chứa ít nhất 1 chữ thường")
      .regex(
        /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
        "Phải chứa ít nhất 1 ký tự đặc biệt"
      ),
    repassword: z.string().min(1, "Mời nhập lại mật khẩu"),
  })
  .refine((data) => data.password === data.repassword, {
    path: ["repassword"],
    message: "Mật khẩu không khớp",
  });

export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
