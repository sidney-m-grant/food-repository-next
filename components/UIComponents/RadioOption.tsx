import React from 'react'

interface Props {
    friend: string,
    setSelectedOption: React.Dispatch<React.SetStateAction<string>>
}

const RadioOption: React.FC<Props> = ({ friend, setSelectedOption }) => {
  return (
    <label>
        <input type="radio" value={friend} name="friend-radio" onChange={(e) => setSelectedOption(e.target.value)}/> 
        {friend} <br></br>
    </label>
  )
}

export default RadioOption