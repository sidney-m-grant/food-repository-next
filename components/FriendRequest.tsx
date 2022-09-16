import React from 'react'

interface Props {
    request: string
    key: number
    acceptFriendRequest: (friend: string) => Promise<void>;
}

const FriendRequest: React.FC<Props> = ({ request, acceptFriendRequest }) => {
  return (
    <>
        <h5>{request}</h5>
        <button onClick={() => acceptFriendRequest(request)}>Accept Request</button>
    </>
  )
}

export default FriendRequest