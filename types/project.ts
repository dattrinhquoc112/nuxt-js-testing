import type { IPaginationPayload } from './pagination';

export type ProjectStatus =
  | 'PENDING_PUBLISH'
  | 'NOT_STARTED'
  | 'STARTED'
  | 'PUBLISHED'
  | 'ENDED';
export interface IProjectListPayload extends IPaginationPayload {
  status: string;
  nameKeyword: string;
}
export interface IProject {
  id: string;
  name: string;
  thumbnail?: string;
  status: ProjectStatus;
  startTime?: string;
  endTime?: string;
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface IUpdateProjectPayload {
  name?: string;
  startTime?: string;
  endTime?: string;
  eventEnglishName?: string;
  eventOfficialUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeyword?: string;
  ogImageUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
}
