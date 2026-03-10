import React, { useState, useEffect } from "react";
import axios from 'src/utils/axios'
import api from 'src/utils/api'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";

const UpdateChecker = () => {
  const [currentVersion, setCurrentVersion] = useState(null);
  // Use Vite's import.meta.env for environment variables
  const [localVersion, setLocalVersion] = useState(import.meta.env.VITE_APP_PROJECT_VERSION || "1.0.0");
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const fetchVersion = async () => {
      try {
        const response = await axios.get(
          `${api.protocol}${api.baseUrl}misc/get-current-version?t=${Date.now()}`
        );
        const serverVersion = response.data.version;
        setCurrentVersion(serverVersion);

        if (!dismissed && compareVersions(serverVersion, localVersion) > 0) {
          setIsUpdateAvailable(true);
          setIsDialogOpen(true);
        }
      } catch (error) {
        console.error("Error fetching version:", error);
      }
    };

    fetchVersion();
    const intervalId = setInterval(fetchVersion, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [localVersion, dismissed]);

  // Helper function to compare semantic versions
  const compareVersions = (v1, v2) => {
    const v1Parts = v1.split('.').map(Number);
    const v2Parts = v2.split('.').map(Number);
    
    for (let i = 0; i < 3; i++) {
      if (v1Parts[i] > v2Parts[i]) return 1;
      if (v1Parts[i] < v2Parts[i]) return -1;
    }
    return 0;
  };

  const handleUpdate = () => {
    setLoading(true);
    
    // For Vite projects, we can use the browser's cache API to clear the cache
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            return caches.delete(cacheName);
          })
        );
      }).then(() => {
        // After clearing cache, reload the page
        setTimeout(() => {
          window.location.reload(true); // Force reload from server
          handleCloseDialog();
        }, 1000);
      }).catch(error => {
        console.error('Error clearing cache:', error);
        // Fallback to simple reload if cache clearing fails
        window.location.reload(true);
        handleCloseDialog();
      });
    } else {
      // Fallback for browsers that don't support Cache API
      window.location.reload(true);
      handleCloseDialog();
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setDismissed(true);
  };

  return (
    <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
      <DialogTitle>Update Available</DialogTitle>
      <DialogContent>
        <Typography>
          A new version ({currentVersion}) of the application is available. 
          Your current version is {localVersion}. 
          Please update to enjoy new features and improvements.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog} color="secondary">
          Later
        </Button>
        <LoadingButton loading={loading} onClick={handleUpdate} color="primary">
          Update Now
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateChecker;
