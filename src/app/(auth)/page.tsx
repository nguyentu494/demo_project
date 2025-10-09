"use client";

import { useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { WalletOptions } from "@/components/WalletOptions";

export default function LoginPage() {
  return (
    redirect("/login")
  );
}
