/**
 * Jubileu Agência — Subpage Creation Hook
 * Task: JB-143 Phase 2
 *
 * Listens for "plane:create-subpage" events dispatched by the editor's
 * /pagina slash command and creates a new subpage via the Plane API.
 */

import { useCallback, useEffect } from "react";
// plane editor
import { SUBPAGE_EMBED_NAME } from "@plane/editor";
// plane web
import { usePageStore } from "@/plane-web/hooks/store";
import type { EPageStoreType } from "@/plane-web/hooks/store";

type Props = {
  storeType: EPageStoreType;
  pageId: string | undefined;
  projectId: string | undefined;
  workspaceSlug: string;
};

export const useSubpageCreation = ({ storeType, pageId, projectId, workspaceSlug }: Props) => {
  const { createPage } = usePageStore(storeType);

  const handleCreateSubpage = useCallback(
    async (event: Event) => {
      const customEvent = event as CustomEvent;
      const editorInstance = customEvent.detail?.editor;
      if (!editorInstance || !pageId || !projectId || !workspaceSlug) {
        console.warn("[Subpage] Missing context:", { hasEditor: !!editorInstance, pageId, projectId, workspaceSlug });
        return;
      }

      try {
        const page = await createPage({
          name: "Untitled subpage",
          parent: pageId,
        });

        if (!page?.id) {
          console.warn("[Subpage] createPage returned no page");
          return;
        }

        // Use requestAnimationFrame to ensure the editor is ready after async operation
        requestAnimationFrame(() => {
          try {
            editorInstance.commands.insertContent({
              type: SUBPAGE_EMBED_NAME,
              attrs: {
                page_id: page.id,
                page_name: page.name || "Untitled subpage",
                project_id: projectId,
                workspace_slug: workspaceSlug,
              },
            });
          } catch (insertError) {
            console.error("[Subpage] Failed to insert node:", insertError);
            // Fallback: insert as a link
            editorInstance.commands.insertContent(
              `<p><a href="/${workspaceSlug}/projects/${projectId}/pages/${page.id}">${page.name || "Untitled subpage"}</a></p>`
            );
          }
        });
      } catch (error) {
        console.error("[Subpage] Failed to create subpage:", error);
      }
    },
    [createPage, pageId, projectId, workspaceSlug]
  );

  useEffect(() => {
    document.addEventListener("plane:create-subpage", handleCreateSubpage);
    return () => {
      document.removeEventListener("plane:create-subpage", handleCreateSubpage);
    };
  }, [handleCreateSubpage]);
};
