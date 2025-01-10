import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Avatar,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

type ChromeTab = chrome.tabs.Tab;

interface TabListProps {
  tabs: ChromeTab[];
  onCloseTab: (tabId: number | undefined) => void;
}

export function TabList({ tabs, onCloseTab }: TabListProps) {
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
          {tab.favIconUrl && (
            <ListItemAvatar>
              <Avatar src={tab.favIconUrl} alt="Tab icon" />
            </ListItemAvatar>
          )}
          <ListItemText
            primary={tab.title}
            secondary={
              <span className="max-w-[450px] overflow-hidden text-ellipsis inline-block whitespace-nowrap">
                {tab.url}
              </span>
            }
          />
        </ListItem>
      ))}
    </List>
  );
}
