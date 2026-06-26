import { useNavigate } from "@tanstack/react-router";
import { IconButton } from "@/components/common/IconButton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Eye, Pencil, X, Printer, Check } from "lucide-react";

/**
 * Common TableActions Component
 * Reusable action buttons for table rows
 *
 * Design Specs (from Figma):
 * - Icon size: 20px (size-5) - Auto from Icon component
 * - Button size: icon-only (no padding) - size="icon"
 * - Gap between buttons: 12px (gap-3)
 * - Colors: gray-500 default, secondary/danger on hover
 *
 * Actions:
 * - View: Eye icon, hover blue (secondary)
 * - Edit: Pencil icon, hover blue (secondary)
 * - Delete: X icon, hover red (danger)
 */

interface TableActionsProps<TData extends { id: string | number }> {
  row: TData;
  /** Base URL for view/edit navigation. */
  baseUrl: string;
  /** Delete handler. Second arg (row) is optional for callers that need extra data */
  onDelete?: (id: string | number, row?: TData) => void | Promise<void>;
  /** Custom edit handler (optional, defaults to navigation) */
  onEdit?: (id: string | number) => void;
  /** Static additional search params for view page */
  viewSearchParams?: Record<string, unknown>;
  /** Show/hide specific actions */
  actions?: {
    view?: boolean;
    edit?: boolean;
    delete?: boolean;
    print?: boolean;
  };
  /** Print handler */
  onPrint?: (id: string | number) => void;
  /** If true, append repo=processing to view URL */
  isProcessingRepo?: boolean;
  isStatus?: string;
  /** Handler for verify/check action (used for at_hub status) */
  onVerify?: (id: string | number) => void;
  /** Permission flags to control action visibility */
  canView?: boolean;
  canUpdate?: boolean;
  canCreate?: boolean;
  canDelete?: boolean;
}

function TableActions<TData extends { id: string | number }>({
  row,
  baseUrl,
  onDelete,
  onEdit,
  onPrint,
  onVerify,
  viewSearchParams,
  isStatus,
  actions = { view: true, edit: true, delete: true, print: false },
  canView = true,
  canUpdate = true,
  canDelete = true,
}: TableActionsProps<TData>) {
  const navigate = useNavigate();
  const itemId = row.id.toString();
  const isHubVerify = isStatus === "at_hub";

  const handleView = () => {
    const rowStatus = "status" in row && typeof row.status === "string" ? row.status : undefined;
    navigate({
      to: `${baseUrl}/$id`,
      params: { id: itemId },
      search: {
        ...viewSearchParams,
        ...(rowStatus && { status: rowStatus }),
      } as never,
    });
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(row.id);
    } else {
      const rowStatus = "status" in row && typeof row.status === "string" ? row.status : undefined;
      navigate({
        to: `${baseUrl}/$id/edit`,
        params: { id: itemId },
        search: {
          ...viewSearchParams,
          ...(rowStatus && { status: rowStatus }),
        } as never,
      });
    }
  };

  const handleDelete = async () => {
    if (onDelete) {
      await onDelete(row.id, row);
    }
  };

  const handlePrint = () => {
    if (onPrint) {
      onPrint(row.id);
    }
  };

  const handleVerify = () => {
    if (onVerify) {
      onVerify(row.id);
    }
  };

  if (isHubVerify) {
    return (
      <div className="flex items-center gap-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <IconButton icon={Check} variant="secondary" size="icon" onClick={handleVerify} aria-label="Xác thực" />
          </TooltipTrigger>
          <TooltipContent side="top">Xác thực</TooltipContent>
        </Tooltip>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {/* View */}
      {actions.view && canView && (
        <Tooltip>
          <TooltipTrigger asChild>
            <IconButton icon={Eye} variant="secondary" size="icon" onClick={handleView} aria-label="Xem chi tiết" />
          </TooltipTrigger>
          <TooltipContent side="top">Xem chi tiết</TooltipContent>
        </Tooltip>
      )}

      {/* Print */}
      {actions.print && canView && (
        <Tooltip>
          <TooltipTrigger asChild>
            <IconButton icon={Printer} variant="secondary" size="icon" onClick={handlePrint} aria-label="In đơn" />
          </TooltipTrigger>
          <TooltipContent side="top">In đơn</TooltipContent>
        </Tooltip>
      )}

      {/* Edit */}
      {actions.edit && canUpdate && (
        <Tooltip>
          <TooltipTrigger asChild>
            <IconButton icon={Pencil} variant="secondary" size="icon" onClick={handleEdit} aria-label="Chỉnh sửa" />
          </TooltipTrigger>
          <TooltipContent side="top">Chỉnh sửa</TooltipContent>
        </Tooltip>
      )}

      {/* Delete */}
      {actions.delete && canDelete && (
        <Tooltip>
          <TooltipTrigger asChild>
            <IconButton icon={X} variant="danger" size="icon" onClick={handleDelete} aria-label="Xóa" />
          </TooltipTrigger>
          <TooltipContent side="top">Xóa</TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}

export type { TableActionsProps };
export { TableActions };
