"use client";

import { useEffect } from "react";
import { uploadProfileImage } from "@/api/profile-images/core/uploadProfileImage";
import Profile from "@/components/perfil/Profile";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { useRouter } from "next/navigation";

const PerfilPage = () => {
  const { cliente, token } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.replace("/");
    }
  }, [token, router]);

  const handleUpdateProfileImage = async (imageUri: string) => {
    if (!cliente) return;
    try {
      await uploadProfileImage(imageUri);
    } catch (error) {
      throw error;
    }
  };

  if (!token) {
    return null;
  }

  return (
    <Profile
      user={cliente}
      primary="#000"
      height={600}
      onUpdateProfileImage={handleUpdateProfileImage}
    />
  );
};

export default PerfilPage;
