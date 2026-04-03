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
        editor.chain().focus().deleteRange(range).run();

        // Extract context from the current URL: /:workspaceSlug/projects/:projectId/pages/:pageId
        const match = window.location.pathname.match(/\/([^/]+)\/projects\/([^/]+)\/pages\/([^/]+)/);
        if (!match) {
          console.error("[Subpage] Cannot extract context from URL:", window.location.pathname);
          return;
        }
        const [, workspaceSlug, projectId, pageId] = match;

        // Create subpage via internal API (uses session cookies)
        fetch(`/api/workspaces/${workspaceSlug}/projects/${projectId}/pages/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: "Untitled subpage", parent: pageId }),
        })
          .then((res) => {
            if (!res.ok) throw new Error(`API ${res.status}`);
            return res.json();
          })
          .then((page) =>
            editor
              .chain()
              .focus()
              .insertContent({
                type: SUBPAGE_EMBED_NAME,
                attrs: {
                  page_id: page.id,
                  page_name: page.name || "Untitled subpage",
                  project_id: projectId,
                  workspace_slug: workspaceSlug,
                },
              })
              .run()
          )
          .catch((err) => console.error("[Subpage] Failed:", err));
      },
    },
  ];
  return options;
};
