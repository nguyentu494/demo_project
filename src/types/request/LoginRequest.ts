import z from "zod";

export const LoginRequest = z.object({
    username: z.string().min(1, "Mời nhập tên đăng nhập"),
    password: z.string().min(1, "Mời nhập mật khẩu"),
})

export type LoginRequestType = z.infer<typeof LoginRequest>;