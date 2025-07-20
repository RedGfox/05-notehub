import axios from 'axios';
import type { Note } from '../types/note';

const BASE_URL = 'https://notehub-public.goit.study/api';
const token = import.meta.env.VITE_NOTEHUB_TOKEN;

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export interface FetchNoteResponse {
  notes: Note[];
  totalPages: number;
}

interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
}

export const fetchNotes = async (
  page: number = 1,
  perPage: number = 12,
  search?: string
): Promise<FetchNoteResponse> => {
  const params: FetchNotesParams = { page, perPage };

  if (search?.trim()) {
    params.search = search;
  }
  const response = await instance.get<FetchNoteResponse>(`/notes`, {
    params,
  });
  return response.data;
};

export const createNote = async (noteData: {
  title: string;
  content: string;
  tag: Note['tag'];
}): Promise<Note> => {
  const response = await instance.post<Note>('/notes', noteData);
  return response.data;
};

export const deleteNote = async (id: number): Promise<Note> => {
  const response = await instance.delete<Note>(`/notes/${id}`);
  return response.data;
};
