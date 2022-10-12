import { ListItem, Button } from "@mui/material";
import React from "react";

interface Props {
  collection: string;
  setSelectedCollection: React.Dispatch<React.SetStateAction<string>>;
  handleToggleDrawer: () => void;
}

const RecipeCollectionForDrawer: React.FC<Props> = ({
  collection,
  setSelectedCollection,
  handleToggleDrawer,
}) => {
  const handleSetSelectedCollection = () => {
    setSelectedCollection(collection);
    handleToggleDrawer();
  };

  return (
    <ListItem>
      <Button onClick={handleSetSelectedCollection}>{collection}</Button>
    </ListItem>
  );
};

export default RecipeCollectionForDrawer;
