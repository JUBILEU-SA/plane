/**
 * Jubileu Agência — Subpage Embed Extension
 * Task: JB-143 Phase 2
 */

export enum ESubpageEmbedAttributeNames {
  ID = "id",
  PAGE_ID = "page_id",
  PAGE_NAME = "page_name",
  PROJECT_ID = "project_id",
  WORKSPACE_SLUG = "workspace_slug",
}

export type TSubpageEmbedAttributes = {
  [ESubpageEmbedAttributeNames.ID]: string | undefined;
  [ESubpageEmbedAttributeNames.PAGE_ID]: string | undefined;
  [ESubpageEmbedAttributeNames.PAGE_NAME]: string | undefined;
  [ESubpageEmbedAttributeNames.PROJECT_ID]: string | undefined;
  [ESubpageEmbedAttributeNames.WORKSPACE_SLUG]: string | undefined;
};
