/**
 * Jubileu Agência — Subpage Embed Extension
 * Task: JB-143 Phase 2
 *
 * React NodeView that renders a clickable card for subpage references.
 */

import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import { FileText } from "lucide-react";
// local imports
import { SubpageEmbedExtensionConfig } from "./extension-config";
import type { TSubpageEmbedAttributes } from "./types";
import { ESubpageEmbedAttributeNames } from "./types";

type Props = {
  widgetCallback: (args: {
    pageId: string;
    pageName: string;
    projectId: string | undefined;
    workspaceSlug: string | undefined;
  }) => React.ReactNode;
};

function DefaultSubpageWidget(props: {
  pageId: string;
  pageName: string;
  projectId: string | undefined;
  workspaceSlug: string | undefined;
}) {
  const { pageName, workspaceSlug, projectId, pageId } = props;
  const href = `/${workspaceSlug}/projects/${projectId}/pages/${pageId}`;

  return (
    <a
      href={href}
      className="border-custom-border-200 bg-custom-background-80 text-sm text-custom-text-200 hover:bg-custom-background-90 flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 font-medium no-underline transition-colors"
      onClick={(e) => {
        e.preventDefault();
        window.location.href = href;
      }}
    >
      <FileText className="text-custom-text-300 size-4 flex-shrink-0" />
      <span className="truncate">{pageName || "Untitled subpage"}</span>
    </a>
  );
}

export function SubpageEmbedExtension(props?: Props) {
  return SubpageEmbedExtensionConfig.extend({
    addNodeView() {
      return ReactNodeViewRenderer((nodeProps: NodeViewProps) => {
        const attrs = nodeProps.node.attrs as TSubpageEmbedAttributes;
        const pageId = attrs[ESubpageEmbedAttributeNames.PAGE_ID] ?? "";
        const pageName = attrs[ESubpageEmbedAttributeNames.PAGE_NAME] ?? "";
        const projectId = attrs[ESubpageEmbedAttributeNames.PROJECT_ID];
        const workspaceSlug = attrs[ESubpageEmbedAttributeNames.WORKSPACE_SLUG];

        return (
          <NodeViewWrapper key={attrs[ESubpageEmbedAttributeNames.ID]}>
            {props?.widgetCallback ? (
              props.widgetCallback({ pageId, pageName, projectId, workspaceSlug })
            ) : (
              <DefaultSubpageWidget
                pageId={pageId}
                pageName={pageName}
                projectId={projectId}
                workspaceSlug={workspaceSlug}
              />
            )}
          </NodeViewWrapper>
        );
      });
    },
  });
}
