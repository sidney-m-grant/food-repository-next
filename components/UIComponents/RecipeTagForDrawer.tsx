import React from "react";
import { Button, ListItem } from "@mui/material";

interface Props {
  tag: string;
  setSelectedTag: React.Dispatch<React.SetStateAction<string>>;
  handleToggleDrawer: () => void;
}

const RecipeTagForDrawer: React.FC<Props> = ({
  tag,
  setSelectedTag,
  handleToggleDrawer,
}) => {
  const handleSetSelectedTag = () => {
    setSelectedTag(tag);
    handleToggleDrawer();
  };

  return (
    <ListItem>
      <Button onClick={handleSetSelectedTag}>{tag}</Button>
    </ListItem>
  );
};

export default RecipeTagForDrawer;
