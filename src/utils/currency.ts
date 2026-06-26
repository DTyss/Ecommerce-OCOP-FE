/**
 * Format currency value with Vietnamese locale and currency symbol
 * @param amount - Number to format
 * @returns Formatted currency string (e.g., "1.234.567đ")
 */
export function formatCurrency(amount: number | string | undefined | null): string {
    if (amount === undefined || amount === null) {
        return "0đ";
    }

    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;

    if (isNaN(numAmount)) {
        return "0đ";
    }

    // Format với locale vi-VN
    const formatted = numAmount.toLocaleString("vi-VN", {
        style: "decimal",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });

    return formatted + "đ";
}

/**
 * Format currency value with locale-aware formatting
 * @param amount - Number to format
 * @param options - Formatting options
 * @returns Formatted currency string
 */
export function formatMoney(
    amount: number | string | undefined | null,
    options: {
        locale?: string;
        currency?: string;
        showSymbol?: boolean;
    } = {}
): string {
    const { locale = "vi-VN", currency = "VND", showSymbol = true } = options;

    if (amount === undefined || amount === null) {
        return showSymbol ? "0đ" : "0";
    }

    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;

    if (isNaN(numAmount)) {
        return showSymbol ? "0đ" : "0";
    }

    if (showSymbol) {
        return numAmount.toLocaleString(locale, {
            style: "currency",
            currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    }

    return numAmount.toLocaleString(locale, {
        style: "decimal",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}

/**
 * Parse formatted currency string back to number
 * @param currencyString - Formatted currency string
 * @returns Parsed number value
 */
export function parseCurrency(currencyString: string | undefined | null): number {
    if (!currencyString) {
        return 0;
    }

    // Remove all non-numeric characters except minus sign and decimal point
    const cleaned = currencyString.replace(/[^\d.-]/g, "");
    const parsed = parseFloat(cleaned);

    return isNaN(parsed) ? 0 : parsed;
}
