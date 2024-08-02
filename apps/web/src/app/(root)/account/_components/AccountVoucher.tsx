"use client";

import useAuthStore from "@/stores/auth.store";

import { Card, CardContent } from "@/components/ui/card";
import { Ticket } from "lucide-react";
import { ButtonReferral } from "./ButtonReferral";
import Link from "next/link";

export const AccountVoucher = () => {
  const { user } = useAuthStore();
  return (
    
  );
};
