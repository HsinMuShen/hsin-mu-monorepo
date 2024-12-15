import { useEffect, useState } from 'react';
import {  Button, List, ListItem, ListItemText, Typography, Container } from '@mui/material';

type ChromeTab = chrome.tabs.Tab;

function App() {
  const [tabs, setTabs] = useState<ChromeTab[]>([]);

  const fetchTabs = () => {
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
      setTabs(tabs);
    });
  };

  const sortTabsByTitle = () => {
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
      const sortedTabs = [...tabs].sort((a, b) => (a.title || '').localeCompare(b.title || ''));
      
      sortedTabs.forEach((tab, index) => {
        if(!tab.id) return;
        chrome.tabs.move(tab.id, { index });
      });

      setTabs(sortedTabs);
    });
  };

  const closeTab = (tabId: number | undefined) => {
    if(!tabId) return;
    chrome.tabs.remove(tabId, () => {
      fetchTabs();
    });
  };

  useEffect(() => {
    fetchTabs();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Tab Sorter
      </Typography>
      <Button variant="contained" color="primary" onClick={sortTabsByTitle}>
        Sort Tabs by Title
      </Button>
      <List>
        {tabs.map((tab) => (
          <ListItem key={tab.id} secondaryAction={
            <Button variant="outlined" color="error" onClick={() => closeTab(tab.id)}>
              Close
            </Button>
          }>
            <ListItemText primary={tab.title} secondary={tab.url} />
          </ListItem>
        ))}
      </List>
      <p><a href="https://www.flaticon.com/free-icons/price" title="price icons">Price icons created by Freepik - Flaticon</a></p>
    </Container>
  );
}

export default App;
