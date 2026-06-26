import i18n from "@/config/i18n";
import type { AxiosError } from "axios";

interface ApiErrorResponse {
    success: false;
    statusCode: number;
    errorCode: string;
    message: string;
    errors?: Array<{
        field: string;
        message: string;
        errorCode: string;
    }>;
}

// Map error code prefix to i18n namespace
const ERROR_CODE_PREFIXES: Record<string, string> = {
    AUTH: "apiErrors:auth",
    USER: "apiErrors:user",
    USER_ROLE: "apiErrors:userRole",
    USER_DOC: "apiErrors:userDoc",
    SHOP: "apiErrors:shop",
    SHOP_STAFF: "apiErrors:shopStaff",
    ORDER: "apiErrors:order",
    SHIPPER: "apiErrors:shipper",
    PACKAGE: "apiErrors:package",
    WALLET: "apiErrors:wallet",
    PROMOTION: "apiErrors:promotion",
    CUSTOMER_GROUP: "apiErrors:customerGroup",
    DEPARTMENT: "apiErrors:department",
    DEPT_PERM: "apiErrors:deptPerm",
    ADDRESS: "apiErrors:address",
    REVIEW: "apiErrors:review",
    PAYMENT_CARD: "apiErrors:paymentCard",
    PENDING_DISPATCH: "apiErrors:pendingDispatch",
    MANUAL_DISPATCH: "apiErrors:manualDispatch",
    SVD: "apiErrors:shopVolume"
};

// System error codes
const SYSTEM_ERROR_CODES = ["UNKNOWN_ERROR", "VALIDATION_ERROR", "QUERY_FAILED_ERROR"];

/**
 * Get i18n key for an error code
 */
function getErrorI18nKey(errorCode: string): string | null {
    if (!errorCode) return null;

    // Check system errors first
    if (SYSTEM_ERROR_CODES.includes(errorCode)) {
        return `apiErrors:system.${errorCode}`;
    }

    // Find matching prefix
    for (const [prefix, namespace] of Object.entries(ERROR_CODE_PREFIXES)) {
        if (errorCode.startsWith(prefix)) {
            return `${namespace}.${errorCode}`;
        }
    }

    return null;
}

/**
 * Get translated error message from error code
 */
export function getErrorMessageByCode(errorCode: string, fallback?: string): string {
    const i18nKey = getErrorI18nKey(errorCode);

    if (i18nKey && i18n.exists(i18nKey)) {
        return i18n.t(i18nKey);
    }

    return fallback ?? errorCode;
}

/**
 * Get API error message with i18n support
 * Priority: i18n translation > API message > fallback
 */
export function getApiErrorMessage(error: unknown, fallbackMessage?: string): string {
    if (!error) return fallbackMessage ?? i18n.t("errors.unknown");

    const axiosError = error as AxiosError<ApiErrorResponse>;
    const errorData = axiosError.response?.data;

    // Try to get translated message from error code
    if (errorData?.errorCode) {
        const translatedMessage = getErrorMessageByCode(errorData.errorCode);
        if (translatedMessage !== errorData.errorCode) {
            return translatedMessage;
        }
    }

    // Fallback to API message
    if (errorData?.message) {
        return errorData.message;
    }

    if (axiosError.message) {
        return axiosError.message;
    }

    return fallbackMessage ?? i18n.t("errors.unknown");
}

/**
 * Get error code from API error
 */
export function getApiErrorCode(error: unknown): string | null {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    return axiosError.response?.data?.errorCode ?? null;
}

export function getApiFieldErrors(error: unknown): Record<string, string> | null {
    const axiosError = error as AxiosError<ApiErrorResponse>;

    if (!axiosError.response?.data?.errors) return null;

    const fieldErrors: Record<string, string> = {};
    axiosError.response.data.errors.forEach((err) => {
        // Try to translate field error
        const translatedMessage = getErrorMessageByCode(err.errorCode, err.message);
        fieldErrors[err.field] = translatedMessage;
    });

    return fieldErrors;
}
