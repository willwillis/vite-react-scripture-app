import React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

type Book = {
  id: number;
  name: string;
  chapters: any[];
};

type Props = {
  books: Book[];
  selectedBook: Book | null;
  onSelect: (book: Book) => void;
};

const BookSelector: React.FC<Props> = ({ books, selectedBook, onSelect }) => (
  <Box mb={3} sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
    {books.map((book) => (
      <Button
        key={book.id}
        variant={selectedBook?.id === book.id ? 'contained' : 'outlined'}
        onClick={() => onSelect(book)}
        size="medium"
      >
        {book.name}
      </Button>
    ))}
  </Box>
);

export default BookSelector; 