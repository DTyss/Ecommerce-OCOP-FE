import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { Icon } from "@iconify/react";
import { AddressCard } from "../../components/AddressCard";
import { UserAvatar } from "../../components/UserAvatar";
import { MOCK_ADDRESSES } from "@/features/account/mock/data";
import { useStorefrontAuthStore } from "@/features/account/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function StorefrontProfilePage() {
  const { t } = useTranslation("storefront");
  const navigate = useNavigate();
  const user = useStorefrontAuthStore((state) => state.user);
  const updateProfile = useStorefrontAuthStore((state) => state.updateProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [editValues, setEditValues] = useState({
    fullName: user?.fullName ?? "",
    phone: user?.phone ?? "",
  });

  useEffect(() => {
    if (!user) {
      navigate({
        to: "/account/login",
        search: { redirect: "/profile" },
      });
    }
  }, [navigate, user]);

  useEffect(() => {
    if (!user) {
      return;
    }

    setEditValues({
      fullName: user.fullName,
      phone: user.phone,
    });
  }, [user]);

  const userAddresses = useMemo(
    () => (user ? MOCK_ADDRESSES.filter((address) => address.userId === user.id) : []),
    [user],
  );

  if (!user) {
    return null;
  }

  const joinedDate = new Date(user.joinedDate).toLocaleDateString("vi-VN", {
    month: "long",
    year: "numeric",
  });

  const handleSave = () => {
    const fullName = editValues.fullName.trim();
    const phone = editValues.phone.trim();

    if (!fullName) {
      setError(t("auth.fullNameRequired"));
      return;
    }

    if (!/^(0|\+84)[0-9]{8,9}$/.test(phone)) {
      setError(t("auth.phoneInvalid"));
      return;
    }

    updateProfile({ fullName, phone });
    setError("");
    setIsEditing(false);
  };

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <UserAvatar user={user} size="lg" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t("profile.title")}</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {user.fullName} · {user.email}
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            className="border-ocop text-ocop hover:bg-ocop hover:text-white"
            onClick={() => setIsEditing((value) => !value)}
          >
            <Icon icon={isEditing ? "mdi:close" : "mdi:pencil-outline"} />
            {isEditing ? t("profile.cancel") : t("profile.edit")}
          </Button>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{t("profile.personalInfo")}</h2>
          {isEditing && (
            <Button type="button" className="bg-ocop hover:bg-ocop-dark text-white" onClick={handleSave}>
              {t("profile.save")}
            </Button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="profile-full-name">{t("auth.fullName")}</Label>
            {isEditing ? (
              <Input
                id="profile-full-name"
                value={editValues.fullName}
                onChange={(event) =>
                  setEditValues((values) => ({
                    ...values,
                    fullName: event.target.value,
                  }))
                }
                className="dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              />
            ) : (
              <p className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-800 dark:bg-gray-800 dark:text-gray-100">
                {user.fullName}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-phone">{t("auth.phone")}</Label>
            {isEditing ? (
              <Input
                id="profile-phone"
                value={editValues.phone}
                onChange={(event) =>
                  setEditValues((values) => ({
                    ...values,
                    phone: event.target.value,
                  }))
                }
                className="dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              />
            ) : (
              <p className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-800 dark:bg-gray-800 dark:text-gray-100">
                {user.phone}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>{t("auth.email")}</Label>
            <p className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-800 dark:bg-gray-800 dark:text-gray-100">
              {user.email}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{t("profile.emailReadOnly")}</p>
          </div>

          <div className="space-y-2">
            <Label>{t("profile.joinedDate")}</Label>
            <p className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-800 dark:bg-gray-800 dark:text-gray-100">
              {joinedDate}
            </p>
          </div>
        </div>

        {error && <p className="text-ocop-red mt-4 text-sm">{error}</p>}
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{t("profile.addresses")}</h2>
          <Button type="button" variant="outline" className="border-ocop text-ocop hover:bg-ocop hover:text-white">
            <Icon icon="mdi:plus" />
            {t("profile.addAddress")}
          </Button>
        </div>

        {userAddresses.length > 0 ? (
          <div className="grid gap-3">
            {userAddresses.map((address) => (
              <AddressCard key={address.id} address={address} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
            <Icon icon="mdi:map-marker-off-outline" className="mx-auto text-gray-300" width={56} />
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">{t("profile.noAddresses")}</p>
          </div>
        )}
      </section>
    </div>
  );
}
