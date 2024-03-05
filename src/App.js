import { useState } from "react";

let initialFriendList = [
  {
    id: "01",
    name: "abhishek",
    image: "https://i.pravatar.cc/150?img=56",
    balance: 15,
  },
  {
    id: "02",
    name: "shrinet",
    image: "https://i.pravatar.cc/150?img=68",
    balance: 10,
  },
  {
    id: "03",
    name: "sachan",
    image: "https://i.pravatar.cc/150?img=54",
    balance: 0,
  },
];
function Button({ children, onClick, type }) {
  return (
    <button className="button" onClick={onClick} type={type}>
      {children}
    </button>
  );
}
function App() {
  const [friendsList, setFriendsList] = useState(initialFriendList);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
  }

  function handleAddFriend(friend) {
    setFriendsList((friends) => [...friends, friend]);
  }

  function handleSelectedFriend(friend) {
    setSelectedFriend((current) => (current?.id === friend.id ? null : friend));
  }

  function handleSplitBill(value) {
    setFriendsList((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friendsList}
          onSelection={handleSelectedFriend}
          selectedFriend={selectedFriend}
        />
        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
        <Button onClick={handleShowAddFriend}>
          {!showAddFriend ? "Add Friend" : "Close"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}
function FriendList({ friends, onSelection, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedFriend }) {
  return (
    <li className={selectedFriend?.id === friend.id ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You own {friend.name} {Math.abs(friend.balance)}Rs.
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} own you {Math.abs(friend.balance)}Rs.
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even.</p>}
      <Button onClick={() => onSelection(friend)}>
        {selectedFriend?.id === friend.id ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/150?img=");

  function handleSubmit(e) {
    e.preventDefault();
    const id = Math.floor(Math.random() * 90 + 10);
    const friend = {
      id: id,
      name,
      image: `${image}${id}`,
      balance: 0,
    };
    onAddFriend(friend);
  }
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>Friend Name :</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>Image URL :</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button type="submit">Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [amtPaidByMe, setAmtPaidByMe] = useState("");
  const FriendExpense = bill ? bill - amtPaidByMe : "";
  const [whoPaidTheBill, setWhoPaidTheBill] = useState("me");

  function handleFormSplitBill(e) {
    e.preventDefault();
    if (!bill || !amtPaidByMe) return;
    onSplitBill(whoPaidTheBill === "me" ? FriendExpense : -amtPaidByMe);
  }
  return (
    <form className="form-split-bill" onSubmit={handleFormSplitBill}>
      <h2>Split bill with {selectedFriend.name}</h2>
      <label>Bill amount</label>
      <input
        type="number"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <label>Your Expense</label>
      <input
        type="number"
        value={amtPaidByMe}
        onChange={(e) =>
          setAmtPaidByMe(
            Number(e.target.value) > bill ? amtPaidByMe : Number(e.target.value)
          )
        }
      />
      <label>{selectedFriend.name}'s Expense</label>
      <input type="number" value={FriendExpense} disabled />
      <label>Bill Paid by </label>
      <select
        value={whoPaidTheBill}
        onChange={(e) => setWhoPaidTheBill(e.target.value)}
      >
        <option value="me">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button type="submit">Split Bill</Button>
    </form>
  );
}
export default App;
