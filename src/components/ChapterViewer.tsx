import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ShareIcon from '@mui/icons-material/Share';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import VerseDisplay from './VerseDisplay';
import { generateScriptureUrl } from '../utils/navigation';

type Chapter = {
  id: number;
  number: number;
  verses: string[];
};

type Book = {
  id: number;
  name: string;
  chapters: Chapter[];
};

type Props = {
  book: Book;
  selectedChapter: Chapter | null;
  onSelectChapter: (chapter: Chapter) => void;
  highlightedVerses?: number[];
  volumeName?: string;
};

const ChapterViewer: React.FC<Props> = ({ book, selectedChapter, onSelectChapter, highlightedVerses = [], volumeName = '' }) => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleShare = async () => {
    if (selectedChapter && volumeName) {
      const url = generateScriptureUrl(volumeName, book.name, selectedChapter.number);
      const fullUrl = window.location.origin + window.location.pathname + url;
      
      if (navigator.share) {
        try {
          await navigator.share({
            title: `${book.name} ${selectedChapter.number}`,
            url: fullUrl
          });
        } catch (error) {
          // User cancelled or share failed, fallback to clipboard
          await copyToClipboard(fullUrl);
        }
      } else {
        // Fallback: copy to clipboard
        await copyToClipboard(fullUrl);
      }
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setToastMessage('Link copied to clipboard!');
      setShowToast(true);
    } catch (error) {
      setToastMessage('Failed to copy link');
      setShowToast(true);
    }
  };

  return (
  <Box>
    <Box mb={2} sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
      {book.chapters.map((chapter) => (
        <Button
          key={chapter.id}
          variant={selectedChapter?.id === chapter.id ? 'contained' : 'outlined'}
          onClick={() => onSelectChapter(chapter)}
          size="small"
          sx={{ 
            minWidth: { xs: 36, sm: 40 },
            fontSize: { xs: '0.75rem', sm: '0.875rem' }
          }}
        >
          {chapter.number}
        </Button>
      ))}
    </Box>
    {selectedChapter && (
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
              textAlign: { xs: 'center', sm: 'left' }
            }}
          >
            {book.name} {selectedChapter.number}
          </Typography>
          <IconButton 
            onClick={handleShare}
            size="small"
            title="Share this chapter"
            sx={{ ml: 'auto' }}
          >
            <ShareIcon />
          </IconButton>
        </Box>
        <VerseDisplay 
          chapter={selectedChapter} 
          highlightedVerses={highlightedVerses}
        />
      </Box>
    )}
    
    {/* Toast notification */}
    <Snackbar
      open={showToast}
      autoHideDuration={3000}
      onClose={() => setShowToast(false)}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert 
        onClose={() => setShowToast(false)} 
        severity="success" 
        sx={{ width: '100%' }}
      >
        {toastMessage}
      </Alert>
    </Snackbar>
  </Box>
  );
};

export default ChapterViewer; 