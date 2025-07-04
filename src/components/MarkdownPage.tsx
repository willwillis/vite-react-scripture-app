import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

interface MarkdownPageProps {
  slug: string;
}

const MarkdownPage: React.FC<MarkdownPageProps> = ({ slug }) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    import(`../pages/${slug}.md?raw`)
      .then((mod) => {
        setContent(mod.default || mod);
        setLoading(false);
      })
      .catch(() => {
        setError('Page not found.');
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography color="error" variant="h6">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{
      maxWidth: 1000,
      mx: 'auto',
      mt: 4,
      px: { xs: 2, sm: 3 },
      '& h1, & h2, & h3, & h4, & h5, & h6': { fontWeight: 700, mt: 3, mb: 1 },
      '& p': { mb: 2 },
      '& ul': { pl: 3, mb: 2 },
      '& li': { mb: 0.5 },
      '& code': { fontFamily: 'monospace', background: '#eee', px: 0.5, borderRadius: 1 },
      '& pre': { background: '#eee', p: 2, borderRadius: 2, overflowX: 'auto' },
    }}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </Box>
  );
};

export default MarkdownPage; 