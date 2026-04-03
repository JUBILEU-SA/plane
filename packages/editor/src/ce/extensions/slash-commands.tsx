/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { FileText } from "lucide-react";
// extensions
import type { TSlashCommandAdditionalOption } from "@/extensions";
import { SUBPAGE_EMBED_NAME } from "@/extensions/subpage-embed/extension-config";
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
        // Delete the slash command text
        editor.chain().focus().deleteRange(range).run();
        // Insert subpage embed node with placeholder attributes
        // The actual page creation is handled by the host application
        // via the editor's onSubpageCreate callback
        editor
          .chain()
          .focus()
          .insertContent({
            type: SUBPAGE_EMBED_NAME,
            attrs: {
              page_id: "pending",
              page_name: "New subpage",
              project_id: undefined,
              workspace_slug: undefined,
            },
          })
          .run();
      },
    },
  ];
  return options;
};
