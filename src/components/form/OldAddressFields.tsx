import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { AutoCompleteSelect, type AutoCompleteOption } from "@/components/form/AutoCompleteSelect";
import { FieldGroup, Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { api } from "@/config/api";
import { getProvinces, getAllOldWardsHCM, getOldDistrictsHCM, getOldWardsByDistrict } from "@/utils/addressUtils";
import { Loader2, X } from "lucide-react";
import { cn } from "@/utils/utils";

interface VietMapSuggestion {
  ref_id: string;
  description: string;
  display: string;
}

interface OldAddressFieldsProps {
  form: any;
  fieldPrefix?: string;
  mode?: "new" | "edit";
  initialDistrict?: string;
  initialWardName?: string;
  onTempNewAddressChange?: (address: string) => void; // Callback to expose tempNewAddress
}

export function OldAddressFields({
  form,
  fieldPrefix = "",
  mode = "new",
  initialDistrict,
  initialWardName,
  onTempNewAddressChange,
}: OldAddressFieldsProps) {
  const getFieldName = useCallback(
    (fieldName: string) => (fieldPrefix ? `${fieldPrefix}.${fieldName}` : fieldName),
    [fieldPrefix],
  );

  const selectedDistrict = form.state.values.district;

  // Get data directly from addressUtils
  const provinces = useMemo(() => {
    return getProvinces().map((p) => ({
      name: p.name,
      code: Number(p.province_code), // code is a number
    }));
  }, []);

  const oldWards = useMemo(() => {
    if (selectedDistrict) {
      // Find district code from district name
      const oldDistricts = getOldDistrictsHCM();
      const district = oldDistricts.find((d) => d.name === selectedDistrict);
      if (district?.district_code) {
        return getOldWardsByDistrict(district.district_code).map((w) => ({
          code: Number(w.ward_code), // convert to number
          name: w.name,
        }));
      }
    }
    return getAllOldWardsHCM().map((w) => ({
      code: Number(w.ward_code), // convert to number
      name: w.name,
    }));
  }, [selectedDistrict]);

  const oldDistricts = useMemo(() => {
    return getOldDistrictsHCM();
  }, []);

  useEffect(() => {
    if (mode === "edit" && initialDistrict && oldDistricts.length > 0 && !hasManuallyClearedDistrict.current) {
      // Find district in oldDistricts
      const district = oldDistricts.find((d) => d.name === initialDistrict);
      if (district) {
        const currentDistrict = form.getFieldValue(getFieldName("district"));
        if (!currentDistrict) {
          form.setFieldValue(getFieldName("district"), district.name);
          setDistrictInputValue(district.name);
        }
      }
    }
  }, [mode, initialDistrict, oldDistricts, form, getFieldName]);

  useEffect(() => {
    if (
      mode === "edit" &&
      initialWardName &&
      selectedDistrict &&
      oldWards.length > 0 &&
      !hasManuallyClearedWard.current
    ) {
      const normalizedInitialWardName = initialWardName.trim();
      const ward = oldWards.find((w) => w.name.trim() === normalizedInitialWardName);

      if (ward) {
        const currentWard = form.getFieldValue(getFieldName("wardName"));
        if (!currentWard || Number(currentWard) !== Number(ward.code)) {
          form.setFieldValue(getFieldName("wardName"), String(ward.code));
          form.setFieldValue(getFieldName("wardCode"), Number(ward.code)); // store as number
          setWardInputValue(ward.name);
          setWardNameForAPI(ward.name);
        } else {
          setWardInputValue(ward.name);
          setWardNameForAPI(ward.name);
        }
      }
    }
  }, [mode, initialWardName, oldWards, selectedDistrict, form, getFieldName]);

  const [districtInputValue, setDistrictInputValue] = useState("");
  const [wardInputValue, setWardInputValue] = useState("");
  const [tempNewAddress, setTempNewAddress] = useState(""); // Store display_new temporarily
  const [wardNameForAPI, setWardNameForAPI] = useState(""); // Store combined ward name for fetchAddressSuggestions
  const [addressSuggestions, setAddressSuggestions] = useState<VietMapSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [suggestionCache] = useState<Record<string, VietMapSuggestion[]>>({});
  const [isAddressInputFocused, setIsAddressInputFocused] = useState(false);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Track if user has manually cleared the fields (to prevent restoring initial values)
  const hasManuallyClearedDistrict = useRef(false);
  const hasManuallyClearedWard = useRef(false);

  const districtOptions = useMemo(() => {
    return oldDistricts.map(
      (district, index) =>
        ({
          name: district.name,
          code: Number(district.district_code ?? index), // Use district_code or fallback to index for unique key
        }) as AutoCompleteOption,
    );
  }, [oldDistricts]);

  // Initialize HCM province immediately for old addresses
  useEffect(() => {
    const currentProvince = form.getFieldValue(getFieldName("provinceCode"));
    if (!currentProvince) {
      // Set HCM province code immediately to prevent validation errors
      form.setFieldValue(getFieldName("provinceCode"), 79);
    }
  }, [form, getFieldName]);

  const previousDistrictFormValue = useRef<any>(undefined);

  useEffect(() => {
    const districtValue = form.getFieldValue(getFieldName("district"));
    if (districtValue === previousDistrictFormValue.current) {
      return;
    }

    if (!districtValue) {
      if (previousDistrictFormValue.current !== undefined && previousDistrictFormValue.current !== null) {
        setDistrictInputValue("");
      }
      previousDistrictFormValue.current = districtValue;
      return;
    }

    const districtValueStr = String(districtValue);
    if (!districtInputValue.startsWith(districtValueStr)) {
      setDistrictInputValue(districtValueStr);
    }

    previousDistrictFormValue.current = districtValue;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, getFieldName]);

  const previousWardFormValue = useRef<any>(undefined);

  useEffect(() => {
    const wardValue = form.getFieldValue(getFieldName("wardName"));
    const districtValue = form.getFieldValue(getFieldName("district"));

    if (wardValue === previousWardFormValue.current) {
      return;
    }

    if (!districtValue) {
      previousWardFormValue.current = wardValue;
      return;
    }

    if (!wardValue) {
      if (previousWardFormValue.current !== undefined && previousWardFormValue.current !== null) {
        setWardInputValue("");
        setWardNameForAPI("");
      }
      previousWardFormValue.current = wardValue;
      return;
    }

    const wardValueStr = String(wardValue);

    let wardId: string | number;
    if (wardValueStr.includes(",")) {
      const [, wardIdStr] = wardValueStr.split(",");
      wardId = wardIdStr?.trim() ?? wardValueStr;
    } else {
      wardId = wardValueStr;
    }

    // Try to match ward code as number
    const wardIdAsNumber = Number(wardId);
    if (!isNaN(wardIdAsNumber) && wardIdAsNumber > 0) {
      // Only sync if oldWards are loaded
      if (oldWards.length > 0) {
        const ward = oldWards.find((w) => w.code === wardIdAsNumber);
        if (ward) {
          const expectedWardName = ward.name;
          // Always update if the ward name doesn't match
          if (wardInputValue !== expectedWardName) {
            setWardInputValue(expectedWardName);
            setWardNameForAPI(ward.name);
          }
        }
      }
    } else {
      const districtValueStr = districtValue ? String(districtValue) : "";
      if (districtValueStr && wardValueStr.includes(districtValueStr)) {
        const wardName = wardValueStr.replace(districtValueStr, "").trim();
        if (!wardInputValue.startsWith(wardName)) {
          setWardInputValue(wardName);
          setWardNameForAPI(wardValueStr);
        }
      } else {
        if (!wardInputValue.startsWith(wardValueStr)) {
          setWardInputValue(wardValueStr);
          setWardNameForAPI(wardValueStr);
        }
      }
    }

    previousWardFormValue.current = wardValue;
  }, [form, getFieldName, oldWards, wardInputValue]);

  // Notify parent component when tempNewAddress changes
  useEffect(() => {
    if (onTempNewAddressChange) {
      onTempNewAddressChange(tempNewAddress);
    }
  }, [tempNewAddress, onTempNewAddressChange]);

  const getWardCodeByName = useCallback(
    (wardName: string, districtName: string): number | undefined => {
      if (!wardName || !districtName) return undefined;

      const ward = oldWards.find((w) => w.name === wardName);
      if (!ward) {
        return undefined;
      }

      const wardId = ward.code; // ward.code is now number
      return wardId;
    },
    [oldWards],
  );

  // Clear ward when district changes
  const handleDistrictChange = (value: string, selectedItem?: AutoCompleteOption) => {
    if (selectedItem) {
      // User selected an item from dropdown
      form.setFieldValue(getFieldName("district"), selectedItem.name);
      setDistrictInputValue(selectedItem.name);
      // Clear ward when district changes
      form.setFieldValue(getFieldName("wardName"), "");
      form.setFieldValue(getFieldName("wardCode"), 0);
      setWardInputValue("");
      setWardNameForAPI("");
    } else if (!value) {
      // User cleared the input
      hasManuallyClearedDistrict.current = true;
      hasManuallyClearedWard.current = true; // Also mark ward as cleared when district is cleared
      form.setFieldValue(getFieldName("district"), "");
      setDistrictInputValue("");
      // Clear ward and address when district is cleared
      form.setFieldValue(getFieldName("wardName"), "");
      form.setFieldValue(getFieldName("wardCode"), 0);
      setWardInputValue("");
      setWardNameForAPI("");
      // Clear address and vietMapRefId
      form.setFieldValue(getFieldName("fullAddress"), "");
      form.setFieldValue(getFieldName("fullAddressOld"), "");
      form.setFieldValue(getFieldName("vietMapRefId"), "");
      setTempNewAddress(""); // Clear temp new address when district is cleared
      setShowSuggestions(false);
      setAddressSuggestions([]);
    } else {
      setDistrictInputValue(value);
      form.setFieldValue(getFieldName("district"), "");
      form.setFieldValue(getFieldName("wardName"), "");
      form.setFieldValue(getFieldName("wardCode"), 0);
      setWardInputValue("");
      setWardNameForAPI("");
    }
  };

  const handleWardChange = (value: string, selectedItem?: AutoCompleteOption, field?: any) => {
    const districtValue = form.getFieldValue(getFieldName("district"));

    if (selectedItem) {
      const wardName = selectedItem.name;

      setWardNameForAPI(wardName);

      setWardInputValue(wardName);

      const wardId = getWardCodeByName(wardName, districtValue);

      const wardFormat = wardId ? String(wardId) : "";

      if (wardFormat) {
        if (field) {
          field.handleChange(wardFormat);
        } else {
          form.setFieldValue(getFieldName("wardName"), wardFormat);
        }
      }

      if (wardId) {
        form.setFieldValue(getFieldName("wardCode"), wardId); // wardId is number
      }

      form.setFieldMeta(getFieldName("wardName"), (meta: any) => ({
        ...meta,
        errorMap: {},
        errors: [],
      }));
    } else if (!value) {
      // User cleared the ward input
      hasManuallyClearedWard.current = true;
      if (field) {
        field.handleChange("");
      } else {
        form.setFieldValue(getFieldName("wardName"), "");
      }
      form.setFieldValue(getFieldName("wardCode"), 0);
      setWardInputValue("");
      setWardNameForAPI("");
      form.setFieldValue(getFieldName("fullAddress"), "");
      form.setFieldValue(getFieldName("fullAddressOld"), "");
      form.setFieldValue(getFieldName("vietMapRefId"), "");
      setTempNewAddress(""); // Clear temp new address when ward is cleared
      setShowSuggestions(false);
      setAddressSuggestions([]);
      form.setFieldMeta(getFieldName("wardName"), (meta: any) => ({
        ...meta,
        errorMap: {},
        errors: [],
      }));
    } else {
      // User is typing, clear ward value
      setWardInputValue(value);
      if (field) {
        field.handleChange("");
      } else {
        form.setFieldValue(getFieldName("wardName"), "");
      }
      form.setFieldValue(getFieldName("wardCode"), 0);
      setWardNameForAPI("");
      form.setFieldValue(getFieldName("fullAddress"), "");
      form.setFieldValue(getFieldName("fullAddressOld"), "");
      form.setFieldValue(getFieldName("vietMapRefId"), "");
      setTempNewAddress(""); // Clear temp new address when ward changes
      setShowSuggestions(false);
      setAddressSuggestions([]);
    }
  };

  const getProvinceNameByCode = (code: number | string | undefined): string => {
    if (!code || provinces.length === 0) return "";
    const province = provinces.find((p) => p.code === Number(code));
    return province?.name ?? "";
  };

  const fetchAddressSuggestions = async (address: string, wardNameForAPI: string) => {
    if (address.length < 7 || !wardNameForAPI) return;

    const selectedProvince = provinces.find((p) => p.name === "Thành phố Hồ Chí Minh");
    if (!selectedProvince) {
      return;
    }

    // wardNameForAPI now contains only ward name (phường), not district
    const wardName = wardNameForAPI;
    const districtName = form.getFieldValue(getFieldName("district"));

    const wardCode = getWardCodeByName(wardName, districtName);

    const cacheKey = `${address.toLowerCase()}-${wardNameForAPI}-${wardCode ?? 0}`;

    if (suggestionCache[cacheKey]) {
      setAddressSuggestions(suggestionCache[cacheKey]);
      setShowSuggestions(true);
      return;
    }

    setIsLoadingSuggestions(true);
    try {
      const params = {
        address: address,
        ward: wardNameForAPI,
        city: selectedProvince.name,
        provinceCode: selectedProvince.code,
        wardCode: wardCode ?? 0,
        display_type: "6",
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
      // With type 6: display = old address (for user), display_new = new address (for backend)
      const oldDisplay = suggestion.display;
      const newDisplay = (suggestion as any).display_new;

      // Set display (old address) for user to see in UI
      form.setFieldValue(getFieldName("fullAddress"), oldDisplay);
      form.setFieldValue(getFieldName("fullAddressOld"), oldDisplay);
      form.setFieldValue(getFieldName("vietMapRefId"), suggestion.ref_id);

      // Store display_new temporarily for form submission
      if (newDisplay) {
        setTempNewAddress(newDisplay);
      } else {
        // Fallback if display_new is missing
        setTempNewAddress(oldDisplay);
      }

      form.setFieldMeta(getFieldName("fullAddress"), (meta: any) => ({ ...meta, errorMap: {}, errors: [] }));
      form.setFieldMeta(getFieldName("vietMapRefId"), (meta: any) => ({ ...meta, errorMap: {}, errors: [] }));
    }

    setIsAddressInputFocused(false);
    setShowSuggestions(false);
    setAddressSuggestions([]);
  };

  const handleClearAddress = useCallback(() => {
    form.setFieldValue(getFieldName("fullAddress"), "");
    form.setFieldValue(getFieldName("fullAddressOld"), "");
    form.setFieldValue(getFieldName("vietMapRefId"), "");
    setTempNewAddress(""); // Clear temp new address
    setShowSuggestions(false);
    setAddressSuggestions([]);
    form.setFieldMeta(getFieldName("fullAddress"), (meta: any) => ({ ...meta, errorMap: {}, errors: [] }));
    form.setFieldMeta(getFieldName("vietMapRefId"), (meta: any) => ({ ...meta, errorMap: {}, errors: [] }));
  }, [form, getFieldName]);

  // Wrap component in form.Subscribe to reactively get addressType and district
  return (
    <>
      {/* Province Field */}
      <form.Field
        name={getFieldName("provinceCode")}
        validators={{
          onChange: () => {
            return;
          },
        }}
      >
        {(field: any) => (
          <FieldGroup className="mb-6">
            <Field className="gap-1.5">
              <FieldLabel htmlFor={getFieldName("provinceCode")} required>
                Tỉnh/Thành Phố
              </FieldLabel>
              <FieldContent>
                <AutoCompleteSelect
                  id={getFieldName("provinceCode")}
                  name={getFieldName("provinceCode")}
                  value={getProvinceNameByCode(field.state.value)}
                  onChange={(_value: string, selectedItem?: any) => {
                    if (selectedItem) {
                      field.handleChange(selectedItem.code);
                    }
                  }}
                  onBlur={field.handleBlur}
                  placeholder="Thành phố Hồ Chí Minh"
                  options={provinces}
                  disabled={true}
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

      {/* District Field */}
      <form.Field
        name={getFieldName("district")}
        validators={{
          onChange: ({ value }: { value: string }) => {
            if (!value.trim()) {
              return "District là bắt buộc";
            }
            return undefined;
          },
        }}
      >
        {(field: any) => (
          <FieldGroup className="mb-6">
            <Field className="gap-1.5">
              <FieldLabel htmlFor={getFieldName("district")} required>
                Quận/huyện
              </FieldLabel>
              <FieldContent>
                <AutoCompleteSelect
                  id={getFieldName("district")}
                  name={getFieldName("district")}
                  value={districtInputValue}
                  onChange={handleDistrictChange}
                  onBlur={field.handleBlur}
                  placeholder="Chọn Quận/huyện"
                  options={districtOptions}
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

      <form.Field name={getFieldName("district")}>
        {(districtField: any) => {
          const currentDistrict = districtField.state.value;

          const wardOptions = (() => {
            if (!currentDistrict) return [];
            return oldWards.map(
              (ward) =>
                ({
                  name: ward.name,
                  code: ward.code,
                }) as AutoCompleteOption,
            );
          })();

          return (
            <form.Field
              name={getFieldName("wardName")}
              validators={{
                onChange: ({ value, fieldApi }: { value: string; fieldApi: any }) => {
                  const districtValue = fieldApi.form.getFieldValue(getFieldName("district"));
                  // Don't validate if district is not selected
                  if (!districtValue) {
                    return undefined;
                  }
                  if (!value.trim()) {
                    return "Phường/Xã là bắt buộc";
                  }
                  return undefined;
                },
              }}
            >
              {(field: any) => (
                <FieldGroup className="mb-6">
                  <Field className="gap-1.5">
                    <FieldLabel htmlFor={getFieldName("wardName")} required>
                      Phường/Xã
                    </FieldLabel>
                    <FieldContent>
                      <AutoCompleteSelect
                        id={getFieldName("wardName")}
                        name={getFieldName("wardName")}
                        value={wardInputValue}
                        onChange={(value, selectedItem) => handleWardChange(value, selectedItem, field)}
                        onBlur={field.handleBlur}
                        placeholder="Chọn Phường/Xã"
                        options={wardOptions}
                        disabled={!currentDistrict}
                        error={!currentDistrict ? false : field.state.meta.errors.length > 0}
                      />
                    </FieldContent>
                    {!currentDistrict
                      ? null
                      : field.state.meta.errors.length > 0 && (
                          <p className="mt-1 text-sm text-red-600">{field.state.meta.errors[0]}</p>
                        )}
                  </Field>
                </FieldGroup>
              )}
            </form.Field>
          );
        }}
      </form.Field>

      {/* Address Field */}
      <form.Field
        name={getFieldName("fullAddress")}
        validators={{
          onChange: ({ fieldApi }: { fieldApi: any }) => {
            // Don't validate if user has selected from suggestions
            const currentRefId = fieldApi.form.getFieldValue(getFieldName("vietMapRefId"));
            if (currentRefId) {
              return undefined;
            }
            return undefined;
          },
          onBlur: ({ fieldApi }: { fieldApi: any }) => {
            // Don't validate if user has selected from suggestions
            const currentRefId = fieldApi.form.getFieldValue(getFieldName("vietMapRefId"));
            if (currentRefId) {
              return undefined;
            }
            return undefined;
          },
          onBlurAsync: async ({ value, fieldApi }: { value: string; fieldApi: any }) => {
            const currentRefId = fieldApi.form.getFieldValue(getFieldName("vietMapRefId"));
            if (currentRefId) {
              return undefined;
            }

            const wardValue = fieldApi.form.getFieldValue(getFieldName("wardName"));
            const districtValue = fieldApi.form.getFieldValue(getFieldName("district"));

            if (!wardValue || !districtValue) {
              return undefined;
            }

            if (!value.trim()) {
              return "Địa chỉ là bắt buộc";
            }

            if (value.length < 7) {
              return "Vui lòng nhập ít nhất 7 ký tự cho địa chỉ";
            }

            // In edit mode, don't require vietMapRefId if address already has value
            if (mode === "edit" && value.trim()) {
              return undefined;
            }

            if (!currentRefId) {
              return "Bạn phải chọn 1 địa chỉ trong danh mục phía dưới";
            }

            return undefined;
          },
          onSubmit: ({ value, fieldApi }: { value: string; fieldApi: any }) => {
            const wardValue = fieldApi.form.getFieldValue(getFieldName("wardName"));
            const districtValue = fieldApi.form.getFieldValue(getFieldName("district"));
            const currentRefId = fieldApi.form.getFieldValue(getFieldName("vietMapRefId"));

            // Don't validate if ward or district is not selected
            if (!wardValue || !districtValue) {
              return undefined;
            }

            if (!value.trim()) {
              return "Địa chỉ là bắt buộc";
            }

            // Check minimum length requirement
            if (value.length < 7) {
              return "Vui lòng nhập ít nhất 7 ký tự cho địa chỉ";
            }

            // In edit mode, don't require vietMapRefId if address already has value
            if (mode === "edit" && value.trim()) {
              return undefined;
            }

            // If no vietMapRefId, user must select from suggestions
            if (!currentRefId) {
              return "Bạn phải chọn 1 địa chỉ trong danh mục phía dưới";
            }

            return undefined;
          },
          onChangeAsync: async ({ value, fieldApi }: { value: string; fieldApi: any }) => {
            if (value.trim()) {
              const currentRefId = fieldApi.form.getFieldValue(getFieldName("vietMapRefId"));

              if (wardNameForAPI && value.length >= 7 && !currentRefId) {
                fetchAddressSuggestions(value, wardNameForAPI);
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
          const wardValue = form.getFieldValue(getFieldName("wardName"));
          const districtValue = form.getFieldValue(getFieldName("district"));
          const isWardSelected = !!wardValue;
          const isDistrictSelected = !!districtValue;
          const isAddressSelected =
            !isAddressInputFocused &&
            (!!(currentRefId && hasAddress) || (mode === "edit" && hasAddress)) &&
            isWardSelected &&
            isDistrictSelected;

          return (
            <FieldGroup className="mb-6">
              <Field className="gap-1.5">
                <FieldLabel htmlFor={getFieldName("fullAddress")} required>
                  Địa chỉ
                  <small className="text-gray-500">(Vui lòng nhập ít nhất 7 ký tự cho địa chỉ)</small>
                </FieldLabel>
                <FieldContent
                  className={cn("relative", (!isWardSelected || !isDistrictSelected) && "cursor-not-allowed")}
                >
                  {/* Show selected address as tag */}
                  {isAddressSelected && isWardSelected && isDistrictSelected ? (
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
                      disabled={!isWardSelected || !isDistrictSelected}
                      onChange={(e) => {
                        if (!isWardSelected || !isDistrictSelected) return;
                        const newValue = e.target.value;
                        field.handleChange(newValue);
                        // Clear temp new address when user types manually
                        if (tempNewAddress) {
                          setTempNewAddress("");
                        }
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
                        // Don't blur if clicking on suggestions dropdown
                        const relatedTarget = e.relatedTarget as HTMLElement;
                        if (relatedTarget.closest(".address-suggestions-dropdown")) {
                          return;
                        }

                        setIsAddressInputFocused(false);
                        setShowSuggestions(false);

                        // Clear any existing timeout
                        if (blurTimeoutRef.current) {
                          clearTimeout(blurTimeoutRef.current);
                        }

                        // Debounce blur validation - trigger after 500ms
                        blurTimeoutRef.current = setTimeout(async () => {
                          const addressValue = field.state.value ?? "";
                          const currentRefId = form.getFieldValue(getFieldName("vietMapRefId"));
                          const wardValue = form.getFieldValue(getFieldName("wardName"));
                          const districtValue = form.getFieldValue(getFieldName("district"));

                          // Only validate if ward and district are selected and no refId
                          // In edit mode, skip validation if address already has value
                          if (
                            wardValue &&
                            districtValue &&
                            !currentRefId &&
                            !(mode === "edit" && addressValue?.trim())
                          ) {
                            let errorMessage: string | undefined = undefined;

                            if (!addressValue?.trim()) {
                              errorMessage = "Địa chỉ là bắt buộc";
                            } else if (addressValue.length < 7) {
                              errorMessage = "Vui lòng nhập ít nhất 7 ký tự cho địa chỉ";
                            } else {
                              errorMessage = "Bạn phải chọn 1 địa chỉ trong danh mục phía dưới";
                            }

                            // Set error to errorMap
                            if (errorMessage) {
                              form.setFieldMeta(getFieldName("fullAddress"), (meta: any) => ({
                                ...meta,
                                errorMap: {
                                  ...meta.errorMap,
                                  onBlurAsync: errorMessage,
                                },
                              }));
                            }
                          }

                          // Also trigger native blur handler
                          await field.handleBlur();
                        }, 500);
                      }}
                      onFocus={() => {
                        if (!isWardSelected || !isDistrictSelected) return;
                        setIsAddressInputFocused(true);
                        const addressValue = field.state.value ?? "";
                        const currentRefId = form.getFieldValue(getFieldName("vietMapRefId"));

                        if (currentRefId) {
                          return;
                        }

                        if (addressValue.length >= 7 && wardNameForAPI) {
                          const cacheKey = `${addressValue?.toLowerCase()}-${wardNameForAPI}`;
                          if (suggestionCache[cacheKey]) {
                            setAddressSuggestions(suggestionCache[cacheKey]);
                            setShowSuggestions(true);
                          } else {
                            fetchAddressSuggestions(addressValue, wardNameForAPI);
                          }
                        }
                      }}
                      error={!isWardSelected || !isDistrictSelected ? false : field.state.meta.errors.length > 0}
                      placeholder={
                        !isDistrictSelected
                          ? "Vui lòng chọn Quận/Huyện trước"
                          : !isWardSelected
                            ? "Vui lòng chọn Phường/Xã trước"
                            : "Vui lòng nhập địa chỉ cụ thể, ví dụ: 123 Cộng Hòa"
                      }
                      autoComplete="street-address"
                    />
                  )}

                  {/* Address Suggestions Dropdown - Only show when not selected */}
                  {!isAddressSelected && showSuggestions && (
                    <div className="address-suggestions-dropdown absolute top-full left-0 z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg">
                      {isLoadingSuggestions && (
                        <div className="flex items-center px-3 py-2 text-gray-500">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Loading suggestions...
                        </div>
                      )}
                      {!isLoadingSuggestions && addressSuggestions.length === 0 && (
                        <div className="px-3 py-2 text-gray-500">No suggestions found</div>
                      )}
                      {!isLoadingSuggestions &&
                        addressSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            type="button"
                            onMouseDown={(e) => {
                              // Prevent input blur when clicking suggestion
                              e.preventDefault();
                              handleSuggestionSelect(suggestion);
                            }}
                            className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                          >
                            {(suggestion as any).display_old ?? suggestion.display}
                          </button>
                        ))}
                    </div>
                  )}
                </FieldContent>

                {(() => {
                  // Don't show errors when ward or district is not selected
                  if (!isWardSelected || !isDistrictSelected) {
                    return null;
                  }

                  // Don't show errors if user has selected from suggestions
                  if (currentRefId) {
                    return null;
                  }

                  // Show errors from onBlurAsync (when user blurs) or onSubmit (when form is submitted)
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
            const wardValue = fieldApi.form.getFieldValue(getFieldName("wardName"));
            const districtValue = fieldApi.form.getFieldValue(getFieldName("district"));

            // In edit mode, don't require vietMapRefId if address already has value
            if (mode === "edit" && addressValue?.trim()) {
              return undefined;
            }

            // Only validate if address, ward and district are filled
            if (addressValue && wardValue && districtValue && !value) {
              return "Bạn phải chọn 1 địa chỉ trong danh mục phía dưới";
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
