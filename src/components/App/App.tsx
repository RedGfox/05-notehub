import { useState } from 'react';
import {
  useQuery,
  keepPreviousData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { deleteNote } from '../../services/noteService';
import { useDebounce } from 'use-debounce';

import NoteList from '../NoteList/NoteList';
import Pagination from '../Pagination/Pagination';
import SearchBox from '../SearchBox/SearchBox';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

import css from '../App/App.module.css';
import { fetchNotes } from '../../services/noteService';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const QueryClient = useQueryClient();

  const { mutate: deleteNoteId } = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      QueryClient.invalidateQueries({ queryKey: ['note'] });
    },
  });

  const handleDelete = (id: string) => {
    deleteNoteId(id);
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 3000);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['note', currentPage, debouncedSearchTerm],
    queryFn: () => fetchNotes(currentPage, 12, debouncedSearchTerm),
    placeholderData: keepPreviousData,
  });

  const totalPages = data ? data.totalPages : 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchTerm} onChange={setSearchTerm} />
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
        <button className={css.button} onClick={handleOpenModal}>
          Create note +
        </button>
      </header>
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {data?.notes && data.notes.length > 0 && (
        <NoteList notes={data.notes} onDelete={handleDelete} />
      )}

      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <NoteForm onClose={handleCloseModal} />
        </Modal>
      )}
    </div>
  );
}
