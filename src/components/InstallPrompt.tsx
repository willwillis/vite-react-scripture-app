import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';

const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Show the install prompt
      setShowInstallPrompt(true);
    };

    // Listen for the appinstalled event
    const handleAppInstalled = () => {
      // Hide the install prompt
      setShowInstallPrompt(false);
      // Clear the deferredPrompt
      setDeferredPrompt(null);
      console.log('PWA was installed');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    // Clear the deferredPrompt
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    setDeferredPrompt(null);
  };

  if (!showInstallPrompt) {
    return null;
  }

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'fixed',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        p: 2,
        maxWidth: 400,
        width: '90%',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        bgcolor: 'primary.main',
        color: 'white'
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
          Install Scripture App
        </Typography>
        <Typography variant="caption">
          Add to home screen for quick access
        </Typography>
      </Box>
      <Button
        variant="contained"
        size="small"
        onClick={handleInstallClick}
        sx={{ 
          bgcolor: 'white', 
          color: 'primary.main',
          '&:hover': {
            bgcolor: 'grey.100'
          }
        }}
      >
        Install
      </Button>
      <IconButton
        size="small"
        onClick={handleDismiss}
        sx={{ color: 'white' }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </Paper>
  );
};

export default InstallPrompt; 