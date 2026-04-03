/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { FileText } from "lucide-react";
// extensions
import type { TSlashCommandAdditionalOption } from "@/extensions";
// types
import type { IEditorProps } from "@/types";

type Props = Pick<IEditorProps, "disabledExtensions" | "flaggedExtensions">;

export const coreEditorAdditionalSlashCommandOptions = (_props: Props): TSlashCommandAdditionalOption[] => {
  const options: TSlashCommandAdditionalOption[] = [
    {
      commandKey: "subpage",
      key: "subpage",
      title: "Subpage",
      description: "Create a subpage linked to this page.",
      searchTerms: ["pagina", "subpage", "subpagina", "child", "page", "nested"],
      icon: <FileText className="size-3.5" />,
      section: "general",
      pushAfter: "divider",
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).run();
        // Dispatch a custom DOM event so the host app can handle page creation
        // and insert the subpage node with real data from the API response
        const event = new CustomEvent("plane:create-subpage", {
          detail: { editor },
          bubbles: true,
        });
        document.dispatchEvent(event);
      },
    },
  ];
  return options;
};
