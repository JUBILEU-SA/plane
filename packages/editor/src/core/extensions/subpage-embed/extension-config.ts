/**
 * Jubileu Agência — Subpage Embed Extension
 * Task: JB-143 Phase 2
 *
 * TipTap Node that renders a clickable subpage reference block.
 * Based on the work-item-embed pattern.
 */

import { mergeAttributes, Node } from "@tiptap/core";

export const SUBPAGE_EMBED_NAME = "subpage-embed-component";

export const SubpageEmbedExtensionConfig = Node.create({
  name: SUBPAGE_EMBED_NAME,
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      page_id: {
        default: undefined,
      },
      page_name: {
        default: undefined,
      },
      project_id: {
        default: undefined,
      },
      workspace_slug: {
        default: undefined,
      },
      id: {
        default: undefined,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "subpage-embed-component",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["subpage-embed-component", mergeAttributes(HTMLAttributes)];
  },
});
