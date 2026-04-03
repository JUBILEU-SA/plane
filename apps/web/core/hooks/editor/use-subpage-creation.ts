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
      const editor = customEvent.detail?.editor;
      if (!editor || !pageId || !projectId || !workspaceSlug) return;

      try {
        const page = await createPage({
          name: "Untitled subpage",
          parent: pageId,
        });

        if (!page?.id) return;

        // Insert the subpage embed node with real data from the API
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
          .run();
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
