import React, { useEffect, useState } from 'react';
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Avatar,
  Typography,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

type ChromeTab = chrome.tabs.Tab;

interface TabListProps {
  tabs: ChromeTab[];
  tabOpenTimes: Record<number, number>;
  onCloseTab: (tabId: number | undefined) => void;
}

export function TabList({ tabs, tabOpenTimes, onCloseTab }: TabListProps) {
  const [tabDurations, setTabDurations] = useState<Record<number, string>>({});

  useEffect(() => {
    const updateDurations = () => {
      const now = Date.now();
      const durations: Record<number, string> = {};

      Object.keys(tabOpenTimes).forEach((tabId) => {
        const openTime = tabOpenTimes[Number(tabId)];
        const elapsed = now - openTime;
        const seconds = Math.floor((elapsed / 1000) % 60);
        const minutes = Math.floor((elapsed / 1000 / 60) % 60);
        const hours = Math.floor(elapsed / 1000 / 60 / 60);
        const days = Math.floor(elapsed / 1000 / 60 / 60 / 24);

        durations[Number(tabId)] = days
          ? `${days}d ${hours}h`
          : hours
          ? `${hours}h ${minutes}m`
          : minutes
          ? `${minutes}m ${seconds}s`
          : `${seconds}s`;
      });

      setTabDurations(durations);
    };

    updateDurations();
    const interval = setInterval(updateDurations, 1000);

    return () => clearInterval(interval);
  }, [tabOpenTimes]);

  return (
    <List sx={{ bgcolor: '#fff', border: '1px solid #ccc', borderRadius: 1 }}>
      {tabs.map((tab) => (
        <ListItem
          key={tab.id}
          secondaryAction={
            <IconButton edge="end" onClick={() => onCloseTab(tab.id)}>
              <CloseIcon />
            </IconButton>
          }
          sx={{ borderBottom: '1px solid #ddd' }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              {tab.favIconUrl && (
                <ListItemAvatar>
                  <Avatar src={tab.favIconUrl} alt="Tab icon" />
                </ListItemAvatar>
              )}

              <ListItemText
                primary={
                  <span className="max-w-[450px] overflow-hidden text-ellipsis inline-block whitespace-nowrap">
                    {tab.title}
                  </span>
                }
                secondary={
                  <span className="max-w-[450px] overflow-hidden text-ellipsis inline-block whitespace-nowrap">
                    {tab.url}
                  </span>
                }
              />
            </Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: '0.75rem', marginTop: 0.5 }}
            >
              {tabDurations[tab.id ?? 0] || 'no duration recorded'}
            </Typography>
          </Box>
        </ListItem>
      ))}
    </List>
  );
}
