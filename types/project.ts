import type { IPaginationPayload } from './pagination';

export interface IProjectListPayload extends IPaginationPayload {
  status: string;
  nameKeyword: string;
}
export interface IProject {
  id: string;
  thumbnail: string;
  statusActive: string;
  titlePage: string;
  urlPage: string;
  periodTime: string;
  leftDays: number;
  editedAt: string;
}
