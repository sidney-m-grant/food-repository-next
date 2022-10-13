import React from "react";
import { useState as useStateHookstate } from "@hookstate/core";
import { dummyRecipe, store } from "../store";

interface Props {
  friend: string;
  setSelectedOption: React.Dispatch<React.SetStateAction<string>>;
}

const RadioOption: React.FC<Props> = ({ friend, setSelectedOption }) => {
  const state = useStateHookstate(store);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(e.target.value);
    state.currentRecipe.set(dummyRecipe);
  };

  return (
    <label>
      <input
        type="radio"
        value={friend}
        name="friend-radio"
        onChange={handleChange}
      />
      {friend} <br></br>
    </label>
  );
};

export default RadioOption;
