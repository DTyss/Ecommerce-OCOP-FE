import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "@tanstack/react-form";
import { AutoCompleteSelect } from "@/components/form/AutoCompleteSelect";
import { Field, FieldContent, FieldLabel, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { api } from "@/config/api";
import { getProvinces, getHCMProvince, getWardsByProvince } from "@/utils/addressUtils";
import { Loader2, X } from "lucide-react";
import { cn } from "@/utils/utils";

interface VietMapSuggestion {
  ref_id: string;
  description: string;
  display: string;
}

interface AddressFormFieldsProps {
  form: any;
  fieldPrefix?: string;
  onCityChange?: (selectedItem: any) => void;
  mode?: "new" | "edit";
  isMapSelectionMode?: boolean;
  onMapSelectionModeChange?: (value: boolean) => void;
}

export function AddressFormFields({
  form,
  fieldPrefix = "",
  onCityChange,
  mode = "new",
  isMapSelectionMode = false,
}: AddressFormFieldsProps) {
  const { t } = useTranslation("shops");

  // Get data directly from addressUtils
  const provinces = useMemo(() => {
    return getProvinces().map((p) => ({
      code: Number(p.province_code), // Fix: use province_code and convert to number
      name: p.name,
    }));
  }, []);

  const [addressSuggestions, setAddressSuggestions] = useState<VietMapSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [suggestionCache] = useState<Record<string, VietMapSuggestion[]>>({});
  const [isAddressInputFocused, setIsAddressInputFocused] = useState(false);
  const [wardInputValue, setWardInputValue] = useState("");
  const hasConvertedEditMode = useRef(false);
  const previousWardValue = useRef<any>(undefined);
  const isInitialMount = useRef(true);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getFieldName = useCallback(
    (fieldName: string) => (fieldPrefix ? `${fieldPrefix}.${fieldName}` : fieldName),
    [fieldPrefix],
  );

  const getProvinceNameByCode = useCallback(
    (code: number | string | undefined): string => {
      if (!code || provinces.length === 0) return "";
      const province = provinces.find((p) => p.code === Number(code));
      return province?.name ?? "";
    },
    [provinces],
  );

  const getWardNameByCode = useCallback((code: number | string | undefined, provinceCode?: number | string): string => {
    if (!code) return "";
    const provinceCodeNum = provinceCode ? Number(provinceCode) : undefined;
    if (!provinceCodeNum) return "";
    const wardOptions = getWardsByProvince(provinceCodeNum);
    const ward = wardOptions.find((ward) => Number(ward.ward_code) === Number(code));
    return ward?.name ?? "";
  }, []);

  useEffect(() => {
    const hcmProvince = getHCMProvince();
    if (hcmProvince) {
      const hcmForForm = {
        code: hcmProvince.province_code,
        name: hcmProvince.name,
      };
      const currentProvinceCode = form.getFieldValue(getFieldName("provinceCode"));
      const needsUpdate =
        !currentProvinceCode ||
        (typeof currentProvinceCode === "string" &&
          isNaN(Number(currentProvinceCode)) &&
          currentProvinceCode !== hcmForForm.code.toString());

      if (needsUpdate) {
        form.setFieldValue(getFieldName("provinceCode"), hcmForForm.code);
        if (onCityChange) {
          onCityChange(hcmForForm);
        }
      }
    }
  }, [form, getFieldName, onCityChange, mode]);

  useEffect(() => {
    if (mode === "edit" && provinces.length > 0) {
      const currentProvinceCode = form.getFieldValue(getFieldName("provinceCode"));
      if (currentProvinceCode && typeof currentProvinceCode === "string" && isNaN(Number(currentProvinceCode))) {
        const province = provinces.find((p) => p.name === currentProvinceCode);
        if (province) {
          form.setFieldValue(getFieldName("provinceCode"), province.code);

          // Trigger validation after setting provinceCode
          setTimeout(() => {
            const currentValue = form.getFieldValue(getFieldName("provinceCode"));
            form.setFieldValue(getFieldName("provinceCode"), currentValue);
          }, 100);
        }
      }
    }
  }, [form, getFieldName, mode, provinces]);

  const provinceCode = useStore(form.store, (state: any) => {
    const fieldName = getFieldName("provinceCode");
    return fieldName.split(".").reduce((acc, part) => acc?.[part], state.values);
  });

  useEffect(() => {
    if (mode === "edit" && provinces.length > 0) {
      const currentWardCode = form.getFieldValue(getFieldName("wardCode"));

      if (
        currentWardCode &&
        currentWardCode !== "" &&
        typeof currentWardCode === "string" &&
        isNaN(Number(currentWardCode))
      ) {
        if (provinceCode) {
          const provinceCodeNum = typeof provinceCode === "number" ? provinceCode : Number(provinceCode);
          if (!isNaN(provinceCodeNum)) {
            const wardOptions = getWardsByProvince(provinceCodeNum);
            const ward = wardOptions.find((ward) => ward.name === currentWardCode);
            if (ward) {
              form.setFieldValue(getFieldName("wardCode"), Number(ward.ward_code));
              hasConvertedEditMode.current = true;

              // Trigger validation after setting wardCode for submit button
              setTimeout(() => {
                const currentValue = form.getFieldValue(getFieldName("wardCode"));
                form.setFieldValue(getFieldName("wardCode"), currentValue);
              }, 100);
            }
          }
        }
      } else if (currentWardCode && currentWardCode !== "" && !hasConvertedEditMode.current) {
        hasConvertedEditMode.current = true;
      }
    }
  }, [form, getFieldName, mode, provinces, provinceCode]);

  const fetchAddressSuggestions = async (address: string, wardCode: number | string, cityCode: number | string) => {
    if (address.length < 7) {
      return;
    }

    // Guard clause: Don't proceed if provinces data isn't loaded or map selection mode is active
    if (!provinces || provinces.length === 0 || isMapSelectionMode) {
      return;
    }

    const provinceCode = Number(cityCode);
    const wardCodeNum = Number(wardCode);

    const selectedProvince = provinces.find((p) => p.code === provinceCode);
    if (!selectedProvince) {
      return;
    }

    const wardOptions = getWardsByProvince(provinceCode);
    const selectedWard = wardOptions.find((ward) => Number(ward.ward_code) === wardCodeNum);
    if (!selectedWard) {
      return;
    }

    const cacheKey = `${address.toLowerCase()}-${wardCodeNum}-${provinceCode}`;

    if (suggestionCache[cacheKey]) {
      setAddressSuggestions(suggestionCache[cacheKey]);
      setShowSuggestions(true);
      return;
    }

    setIsLoadingSuggestions(true);
    try {
      const params = {
        address: address,
        ward: selectedWard.name,
        city: selectedProvince.name,
        provinceCode: provinceCode,
        wardCode: wardCodeNum,
        display_type: "1",
      };

      const response = await api.get("/vietmap/autocomplete", { params });
      const suggestions = response.data;

      suggestionCache[cacheKey] = suggestions;
      setAddressSuggestions(suggestions);
      setShowSuggestions(true);
    } catch {
      setAddressSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleSuggestionSelect = (suggestion: VietMapSuggestion) => {
    const currentRefId = form.getFieldValue(getFieldName("vietMapRefId"));

    if (currentRefId !== suggestion.ref_id) {
      form.setFieldValue(getFieldName("fullAddress"), suggestion.display);
      form.setFieldValue(getFieldName("vietMapRefId"), suggestion.ref_id);
      form.setFieldMeta(getFieldName("fullAddress"), (meta: any) => ({ ...meta, errorMap: {}, errors: [] }));
      form.setFieldMeta(getFieldName("vietMapRefId"), (meta: any) => ({ ...meta, errorMap: {}, errors: [] }));
    }

    setIsAddressInputFocused(false); // Reset focus state after selection
    setShowSuggestions(false);
    setAddressSuggestions([]);
  };

  const handleClearAddress = useCallback(() => {
    form.setFieldValue(getFieldName("fullAddress"), "");
    form.setFieldValue(getFieldName("vietMapRefId"), "");
    setShowSuggestions(false);
    setAddressSuggestions([]);
    form.setFieldMeta(getFieldName("fullAddress"), (meta: any) => ({ ...meta, errorMap: {}, errors: [] }));
    form.setFieldMeta(getFieldName("vietMapRefId"), (meta: any) => ({ ...meta, errorMap: {}, errors: [] }));
  }, [form, getFieldName]);

  const handleClearWard = useCallback(
    (customHandleChange?: (value: string) => void) => {
      if (customHandleChange) {
        customHandleChange("");
      } else {
        form.setFieldValue(getFieldName("wardCode"), "");
      }
      setWardInputValue("");
      form.setFieldMeta(getFieldName("wardCode"), (meta: any) => ({ ...meta, errorMap: {}, errors: [] }));
      form.setFieldValue(getFieldName("fullAddress"), "");
      form.setFieldValue(getFieldName("vietMapRefId"), "");
      setShowSuggestions(false);
      setAddressSuggestions([]);
    },
    [form, getFieldName],
  );

  const wardFieldValue = form.getFieldValue(getFieldName("wardCode"));

  const isWardFieldDisabled = mode === "edit" && provinceCode ? false : !provinceCode;

  const convertWardToName = useCallback(
    (wardValue: any, provinceCode: number | string): string | undefined => {
      if (!wardValue || !provinceCode) return undefined;

      const isWardCode = typeof wardValue === "number" || (typeof wardValue === "string" && !isNaN(Number(wardValue)));

      if (isWardCode) {
        return getWardNameByCode(wardValue, provinceCode);
      } else {
        // Try to find ward by name and convert to code
        const provinceCodeNum = typeof provinceCode === "number" ? provinceCode : Number(provinceCode);
        const wardOptions = getWardsByProvince(provinceCodeNum);
        const ward = wardOptions.find((item) => item.name === wardValue);
        if (ward) {
          form.setFieldValue(getFieldName("wardCode"), Number(ward.ward_code));
          return ward.name;
        }
        return wardValue as string;
      }
    },
    [getWardNameByCode, form, getFieldName],
  );

  // Sync wardInputValue with wardFieldValue - only sync when form value changes from external source
  const previousWardFormValue = useRef<any>(undefined);

  useEffect(() => {
    // Handle initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (wardFieldValue && provinceCode) {
        previousWardValue.current = wardFieldValue;
        previousWardFormValue.current = wardFieldValue;
        const wardName = convertWardToName(wardFieldValue, provinceCode);
        if (wardName) {
          setWardInputValue(wardName);
          return;
        }

        // Stale ward code from old address format — clear so it doesn't leak into submission
        const isNumericWardCode =
          typeof wardFieldValue === "number" ||
          (typeof wardFieldValue === "string" && wardFieldValue !== "" && !isNaN(Number(wardFieldValue)));
        if (isNumericWardCode) {
          form.setFieldValue(getFieldName("wardCode"), "");
          previousWardValue.current = "";
          previousWardFormValue.current = "";
        }
      }
    }

    // Skip if value hasn't changed (prevents unnecessary syncs when user is typing)
    if (wardFieldValue === previousWardFormValue.current) {
      return;
    }

    // Handle ward cleared
    const isWardNowEmpty = !wardFieldValue || wardFieldValue === "";
    const wasWardSet =
      previousWardValue.current !== undefined && previousWardValue.current !== null && previousWardValue.current !== "";

    if (isWardNowEmpty) {
      // Only clear if form value was cleared (not when user is typing)
      if (wasWardSet) {
        setWardInputValue("");
        form.setFieldValue(getFieldName("fullAddress"), "");
        form.setFieldValue(getFieldName("vietMapRefId"), "");
        setShowSuggestions(false);
        setAddressSuggestions([]);
      }
      previousWardValue.current = wardFieldValue;
      previousWardFormValue.current = wardFieldValue;
      return;
    }

    // Sync wardInputValue when wardFieldValue, provinceCode, and wards are available
    if (provinceCode && wardFieldValue) {
      const wardName = convertWardToName(wardFieldValue, provinceCode);
      // Only sync if the input value doesn't start with the expected ward name
      // This allows user to continue typing without interruption
      if (wardName && !wardInputValue.startsWith(wardName)) {
        setWardInputValue(wardName);
      }
    }

    previousWardValue.current = wardFieldValue;
    previousWardFormValue.current = wardFieldValue;
  }, [wardFieldValue, provinceCode, wardInputValue, convertWardToName, form, getFieldName]);

  // Reset isInitialMount when component unmounts to handle remounting
  useEffect(() => {
    return () => {
      isInitialMount.current = true;
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
    };
  }, []);

  const currentProvince = useMemo(() => {
    if (!provinceCode) {
      return null;
    }

    let found = null;
    if (typeof provinceCode === "string" && isNaN(Number(provinceCode))) {
      found = provinces.find((p) => p.name === provinceCode) ?? null;
    } else {
      const code = Number(provinceCode);
      found = provinces.find((p) => p.code === code) ?? null;
    }

    return found;
  }, [provinceCode, provinces]);

  const wardOptions = useMemo(() => {
    let provinceCodeNum: number | null = null;

    if (currentProvince?.code) {
      provinceCodeNum = currentProvince.code;
    } else if (provinceCode) {
      if (typeof provinceCode === "string" && isNaN(Number(provinceCode))) {
        const province = provinces.find((p) => p.name === provinceCode);
        provinceCodeNum = province?.code ?? null;
      } else {
        provinceCodeNum = Number(provinceCode) || null;
      }
    }

    if (!provinceCodeNum || isNaN(provinceCodeNum)) {
      return [];
    }

    const allWards = getWardsByProvince(provinceCodeNum);
    // const filtered = allWards.filter((ward) => !excludedWardNames.includes(ward.name));
    return allWards.map((ward) => ({ name: ward.name, code: Number(ward.ward_code) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProvince, provinceCode]);

  return (
    <>
      <form.Field
        name={getFieldName("provinceCode")}
        defaultValue={79}
        validators={{
          onChange: ({ value }: { value: number | string }) => {
            if (!value) {
              return t("addressForm.cityRequired");
            }
            return undefined;
          },
        }}
      >
        {(field: any) => (
          <FieldGroup className="mb-6">
            <Field className="gap-1.5">
              <FieldLabel htmlFor={getFieldName("provinceCode")} required>
                {t("addressForm.city")}
              </FieldLabel>
              <FieldContent>
                <AutoCompleteSelect
                  id={getFieldName("provinceCode")}
                  name={getFieldName("provinceCode")}
                  value={getProvinceNameByCode(field.state.value)}
                  onChange={(_value: string, selectedItem?: any) => {
                    if (selectedItem) {
                      field.handleChange(selectedItem.code);
                      form.setFieldValue(getFieldName("wardCode"), "");
                      if (onCityChange) {
                        onCityChange(selectedItem);
                      }
                    }
                  }}
                  onBlur={field.handleBlur}
                  placeholder={t("addressForm.cityPlaceholder")}
                  options={provinces}
                  disabled={false}
                  error={field.state.meta.errors.length > 0}
                />
              </FieldContent>
              {field.state.meta.errors.length > 0 && (
                <p className="mt-1 text-sm text-red-600">{field.state.meta.errors[0]}</p>
              )}
            </Field>
          </FieldGroup>
        )}
      </form.Field>

      <form.Field
        name={getFieldName("wardCode")}
        validators={{
          onChange: ({ value, formApi }: { value: number | string; formApi: any }) => {
            // Safety check - formApi might be undefined during form transitions
            if (!formApi || typeof formApi.getFieldValue !== "function") {
              return undefined;
            }

            // Get addressType from form to determine if this field should be validated
            const addressType = formApi.getFieldValue("addressType" as any);

            // Only validate wardCode when addressType is "new"
            // For "old" address type, this field is not required
            if (addressType !== "new") {
              return undefined;
            }

            if (!value) {
              return t("addressForm.wardRequired");
            }
            return undefined;
          },
        }}
      >
        {(field: any) => (
          <FieldGroup className="mb-6">
            <Field className="gap-1.5">
              <FieldLabel htmlFor={getFieldName("wardCode")} required>
                {t("addressForm.ward")}
              </FieldLabel>
              <FieldContent>
                <AutoCompleteSelect
                  id={getFieldName("wardCode")}
                  name={getFieldName("wardCode")}
                  value={wardInputValue}
                  onChange={(_value: string, selectedItem?: any) => {
                    if (selectedItem) {
                      const currentWardCode = form.getFieldValue(getFieldName("wardCode"));
                      const isWardChanging = currentWardCode !== selectedItem.code;

                      field.handleChange(selectedItem.code);
                      setWardInputValue(selectedItem.name);
                      form.setFieldMeta(getFieldName("wardCode"), (meta: any) => ({
                        ...meta,
                        errorMap: {},
                        errors: [],
                      }));

                      if (isWardChanging) {
                        form.setFieldValue(getFieldName("fullAddress"), "");
                        form.setFieldValue(getFieldName("vietMapRefId"), "");
                        setShowSuggestions(false);
                        setAddressSuggestions([]);
                      }
                    } else if (!_value) {
                      handleClearWard(field.handleChange);
                    } else {
                      setWardInputValue(_value);
                      field.handleChange("");
                      form.setFieldMeta(getFieldName("wardCode"), (meta: any) => ({
                        ...meta,
                        errorMap: {},
                        errors: [],
                      }));
                    }
                  }}
                  onBlur={field.handleBlur}
                  placeholder={t("addressForm.wardPlaceholder")}
                  options={wardOptions}
                  disabled={isWardFieldDisabled}
                  error={field.state.meta.errors.length > 0}
                />
              </FieldContent>
              {field.state.meta.errors.length > 0 && (
                <p className="mt-1 text-sm text-red-600">{field.state.meta.errors[0]}</p>
              )}
            </Field>
          </FieldGroup>
        )}
      </form.Field>

      <form.Field
        name={getFieldName("fullAddress")}
        validators={{
          onChange: ({ fieldApi }: { fieldApi: any }) => {
            const currentRefId = fieldApi.form.getFieldValue(getFieldName("vietMapRefId"));
            if (currentRefId) return undefined;
            return undefined;
          },
          onBlur: ({ fieldApi }: { fieldApi: any }) => {
            const currentRefId = fieldApi.form.getFieldValue(getFieldName("vietMapRefId"));
            if (currentRefId) return undefined;
            return undefined;
          },
          onBlurAsync: async ({ value, fieldApi }: { value: string; fieldApi: any }) => {
            const currentRefId = fieldApi.form.getFieldValue(getFieldName("vietMapRefId"));
            if (currentRefId) return undefined;

            const wardValue = fieldApi.form.getFieldValue(getFieldName("wardCode"));
            const provinceValue = fieldApi.form.getFieldValue(getFieldName("provinceCode"));

            if (!wardValue) return undefined;

            if (!value.trim()) return t("addressForm.addressRequired");
            if (!provinceValue) return t("addressForm.addressEnterCityFirst");
            if (value.length < 7) return t("addressForm.addressMinLength");
            if (mode === "edit" && value.trim()) return undefined;

            return t("addressForm.addressSelectRequired");
          },
          onSubmit: ({ value, fieldApi }: { value: string; fieldApi: any }) => {
            const wardValue = fieldApi.form.getFieldValue(getFieldName("wardCode"));
            const provinceValue = fieldApi.form.getFieldValue(getFieldName("provinceCode"));
            const currentRefId = fieldApi.form.getFieldValue(getFieldName("vietMapRefId"));

            if (!wardValue) return undefined;

            if (!value.trim()) return t("addressForm.addressRequired");
            if (!provinceValue) return t("addressForm.addressEnterCityFirst");
            if (value.length < 7) return t("addressForm.addressMinLength");
            if (mode === "edit" && value.trim()) return undefined;

            if (!currentRefId) return t("addressForm.addressSelectRequired");
            return undefined;
          },
          onChangeAsync: async ({ value, fieldApi }: { value: string; fieldApi: any }) => {
            if (value.trim()) {
              const wardCode = fieldApi.form.getFieldValue(getFieldName("wardCode"));
              const provinceCodeValue = fieldApi.form.getFieldValue(getFieldName("provinceCode"));
              const currentRefId = fieldApi.form.getFieldValue(getFieldName("vietMapRefId"));

              if (wardCode && provinceCodeValue && value.length >= 7 && !currentRefId && !isMapSelectionMode) {
                fetchAddressSuggestions(value, wardCode, provinceCodeValue);
              } else {
                setShowSuggestions(false);
              }
            }
            return undefined;
          },
        }}
        asyncDebounceMs={500}
        onBlurAsyncDebounceMs={500}
      >
        {(field: any) => {
          const currentRefId = form.getFieldValue(getFieldName("vietMapRefId"));
          const hasAddress = !!(field.state.value && field.state.value.trim() !== "");
          const wardValue = form.getFieldValue(getFieldName("wardCode"));
          const isWardSelected = !!wardValue;
          const isAddressSelected =
            !isAddressInputFocused && (!!(currentRefId && hasAddress) || (mode === "edit" && hasAddress));

          return (
            <FieldGroup className="mb-6">
              <Field className="gap-1.5">
                <FieldLabel
                  htmlFor={getFieldName("fullAddress")}
                  required
                  className="flex w-full items-center justify-between"
                >
                  <div>
                    {t("addressForm.address")}
                    <small className="text-gray-500">({t("addressForm.addressHint")})</small>
                  </div>
                </FieldLabel>

                <FieldContent className={cn("relative", !isWardSelected && "cursor-not-allowed")}>
                  {/* Show selected address as tag */}
                  {isAddressSelected && isWardSelected ? (
                    <div className="flex items-center">
                      <div className="flex h-auto w-full min-w-0 flex-1 items-center rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
                        <span className="flex-1 text-base leading-6 font-normal text-blue-900">
                          {field.state.value}
                        </span>
                        <button
                          type="button"
                          onClick={handleClearAddress}
                          className="ml-2 rounded-full p-1 transition-colors hover:bg-blue-100"
                        >
                          <X className="h-4 w-4 text-blue-600" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <Input
                      type="text"
                      id={getFieldName("fullAddress")}
                      name={getFieldName("fullAddress")}
                      value={field.state.value ?? ""}
                      disabled={!isWardSelected}
                      onChange={(e) => {
                        if (!isWardSelected) return;
                        field.handleChange(e.target.value);
                        const currentRefId = form.getFieldValue(getFieldName("vietMapRefId"));
                        if (currentRefId) {
                          form.setFieldValue(getFieldName("vietMapRefId"), "");
                        }
                        // Only clear onSubmit errors, keep onBlurAsync errors
                        form.setFieldMeta(getFieldName("fullAddress"), (meta: any) => {
                          const newErrorMap = { ...meta.errorMap };
                          delete newErrorMap.onSubmit;
                          return {
                            ...meta,
                            errorMap: newErrorMap,
                            errors: [],
                          };
                        });
                        form.setFieldMeta(getFieldName("vietMapRefId"), (meta: any) => ({
                          ...meta,
                          errorMap: {},
                          errors: [],
                        }));
                      }}
                      onBlur={async (e) => {
                        const relatedTarget = e.relatedTarget as HTMLElement;
                        if (relatedTarget?.closest?.(".address-suggestions-dropdown")) {
                          return;
                        }

                        setIsAddressInputFocused(false);
                        setShowSuggestions(false);

                        if (blurTimeoutRef.current) {
                          clearTimeout(blurTimeoutRef.current);
                        }

                        // Debounce manual blur handler slightly to allow dropdown item clicks to resolve
                        blurTimeoutRef.current = setTimeout(async () => {
                          await field.handleBlur();
                        }, 150);
                      }}
                      onFocus={() => {
                        if (!isWardSelected) return;
                        setIsAddressInputFocused(true);
                        const wardCode = form.getFieldValue(getFieldName("wardCode"));
                        const provinceCodeValue = form.getFieldValue(getFieldName("provinceCode"));
                        const addressValue = field.state.value ?? "";
                        const currentRefId = form.getFieldValue(getFieldName("vietMapRefId"));

                        if (currentRefId) {
                          return;
                        }

                        if (addressValue.length >= 7 && wardCode && provinceCodeValue && !isMapSelectionMode) {
                          const cacheKey = `${addressValue?.toLowerCase()}-${wardCode}-${provinceCodeValue}`;
                          if (suggestionCache[cacheKey]) {
                            setAddressSuggestions(suggestionCache[cacheKey]);
                            setShowSuggestions(true);
                          } else {
                            fetchAddressSuggestions(addressValue, wardCode, provinceCodeValue);
                          }
                        }
                      }}
                      error={!isWardSelected ? false : field.state.meta.errors.length > 0}
                      placeholder={t("addressForm.addressPlaceholder")}
                      autoComplete="street-address"
                    />
                  )}

                  {!isAddressSelected && showSuggestions && !isMapSelectionMode && (
                    <div className="address-suggestions-dropdown absolute top-full left-0 z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg">
                      {isLoadingSuggestions && (
                        <div className="flex items-center px-3 py-2 text-gray-500">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t("addressForm.loadingSuggestions")}
                        </div>
                      )}
                      {!isLoadingSuggestions && addressSuggestions.length === 0 && (
                        <div className="px-3 py-2 text-gray-500">{t("addressForm.noSuggestions")}</div>
                      )}
                      {!isLoadingSuggestions &&
                        addressSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleSuggestionSelect(suggestion);
                            }}
                            className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                          >
                            {suggestion.display}
                          </button>
                        ))}
                    </div>
                  )}
                </FieldContent>

                {(() => {
                  // Don't show errors when ward is not selected
                  if (!isWardSelected) {
                    return null;
                  }

                  // Don't show errors if user has selected from suggestions
                  if (currentRefId) {
                    return null;
                  }

                  const addressError = field.state.meta.errorMap?.onBlurAsync ?? field.state.meta.errorMap?.onSubmit;
                  const vietMapMeta = form.getFieldMeta(getFieldName("vietMapRefId")) as any;
                  const vietMapError = vietMapMeta?.errorMap?.onSubmit;

                  const errorToShow = addressError ?? vietMapError;
                  return errorToShow ? <p className="mt-1 text-sm text-red-600">{errorToShow}</p> : null;
                })()}
              </Field>
            </FieldGroup>
          );
        }}
      </form.Field>

      <form.Field
        name={getFieldName("vietMapRefId")}
        validators={{
          onSubmit: ({ value, fieldApi }: { value: string; fieldApi: any }) => {
            const addressValue = fieldApi.form.getFieldValue(getFieldName("fullAddress"));
            const wardValue = fieldApi.form.getFieldValue(getFieldName("wardCode"));

            // In edit mode, don't require vietMapRefId if address already has value
            if (mode === "edit" && addressValue?.trim()) {
              return undefined;
            }

            // Only validate if address and ward are filled
            if (addressValue && wardValue && !value) {
              return t("addressForm.addressSelectRequired");
            }
            return undefined;
          },
        }}
      >
        {(field: any) => <input type="hidden" value={field.state.value ?? ""} />}
      </form.Field>
    </>
  );
}
