"use client";

import { useAuthEmpleadoStore } from "@/providers/store/useAuthEmpleados";
import axios from "axios";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const empleadosAPI = axios.create({
  baseURL: API_URL,
});

empleadosAPI.interceptors.request.use((config) => {
  const token = useAuthEmpleadoStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
