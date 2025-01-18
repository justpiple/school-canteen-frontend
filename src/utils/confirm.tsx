import React from "react";
import { createRoot } from "react-dom/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface ConfirmOptions {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

/**
 * A `confirm` dialog component built using ShadCN's UI components.
 *
 * This component renders a modal dialog for confirmation purposes.
 * It displays a title, description, and two buttons (Confirm and Cancel).
 * It returns a `Promise<boolean>` that resolves to `true` if the user confirms,
 * or `false` if the user cancels.
 *
 * ### Dependencies:
 * - **ShadCN UI Components**: This component utilizes ShadCN's `AlertDialog` and `Button` components.
 * - **React**: Utilizes React's `createRoot` for rendering the dialog dynamically.
 *
 * ### Example Usage:
 * ```tsx
 * import { confirm } from "@/path-to/confirm";
 *
 * async function handleDelete() {
 *   const result = await confirm({
 *     title: "Delete Item",
 *     description: "Are you sure you want to delete this item? This action cannot be undone.",
 *     confirmLabel: "Delete",
 *     cancelLabel: "Cancel",
 *   });
 *
 *   if (result) {
 *     console.log("Item deleted");
 *   } else {
 *     console.log("Deletion cancelled");
 *   }
 * }
 * ```
 *
 * ### Props:
 * - `title` (string): The title displayed in the dialog.
 * - `description` (string): The description providing more context to the user.
 * - `confirmLabel` (string, optional): The label for the confirm button. Default: "Confirm".
 * - `cancelLabel` (string, optional): The label for the cancel button. Default: "Cancel".
 *
 * ### Behavior:
 * - The dialog dynamically mounts to the DOM when called and unmounts after the user makes a choice.
 * - Clicking the "Confirm" button resolves the promise with `true`.
 * - Clicking the "Cancel" button resolves the promise with `false`.
 *
 * ### Notes:
 * - Ensure you have the `AlertDialog` and `Button` components from ShadCN set up in your project.
 *
 * @param {ConfirmOptions} options - The options for configuring the confirm dialog.
 * @param {string} options.title - The title of the confirm dialog.
 * @param {string} options.description - A detailed description displayed in the dialog.
 * @param {string} [options.confirmLabel="Confirm"] - The label for the confirm button.
 * @param {string} [options.cancelLabel="Cancel"] - The label for the cancel button.
 * @returns {Promise<boolean>} A promise that resolves to `true` if confirmed, `false` if canceled.
 */

export function confirm({
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
}: ConfirmOptions): Promise<boolean> {
  return new Promise((resolve) => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);

    const cleanup = () => {
      root.unmount();
      document.body.removeChild(container);
    };

    root.render(
      <AlertDialog open={true} onOpenChange={() => {}}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button
                variant="outline"
                onClick={() => {
                  resolve(false);
                  cleanup();
                }}
              >
                {cancelLabel}
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="destructive"
                onClick={() => {
                  resolve(true);
                  cleanup();
                }}
                className="bg-red-500 hover:bg-red-400"
              >
                {confirmLabel}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>,
    );
  });
}
