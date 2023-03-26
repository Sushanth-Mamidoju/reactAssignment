import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Todo = ({
  todo,
  index,
  completeTodo,
  removeTodo,
  updateTodo,
  bucketNames,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedText, setUpdatedText] = useState(todo.text);
  const [updatedUrl, setUpdatedUrl] = useState(todo.url);
  const [updatedBucket, setUpdatedBucket] = useState(todo.bucketName);

  const handleUpdate = (e) => {
    e.preventDefault();
    updateTodo({
      index: index,
      updatedText: updatedText,
      updatedUrl: updatedUrl,
      updatedBucket: updatedBucket,
    });
    setIsEditing(false);
  };

  const handleButtonClick = (e) => {
    e.stopPropagation(); // stop event from propagating up the DOM tree
  };

  if (isEditing) {
    return (
      <div className="card text-align-center justify-content-center m-3">
        <form onSubmit={handleUpdate} className="p-2">
          <input
            className="form-control me-2"
            type="text"
            value={updatedText}
            onChange={(e) => setUpdatedText(e.target.value)}
          />
          <br />
          <input
            className="form-control me-2"
            type="text"
            value={updatedUrl}
            onChange={(e) => setUpdatedUrl(e.target.value)}
          />
          <br />

          <label className="form-label">Select Bucket</label>
          <select
            className="form-select"
            name="bucketName"
            defaultValue={updatedBucket}
            onChange={(e) => {
              setUpdatedBucket(e.target.value);
            }}
            required
          >
            <option value="" disabled>
              choose an option
            </option>
            {bucketNames.map((name) => (
              <>
                <option key={name} value={name}>
                  {name}
                </option>
              </>
            ))}
          </select>
          <button className="btn btn-primary me-1 mt-2" type="submit">
            Update
          </button>
        </form>
      </div>
    );
  } else {
    return (
      <div className={`todo ${todo.isCompleted ? "completed" : ""}`}>
        <div
          className="card mx-3 my-2"
          onClick={() => completeTodo(index)}
          style={{ minWidth: "18rem" }}
        >
          <div className="card-body">
            <div className="d-flex">
              <div>
                <h3 className="card-title">{todo.text}</h3>
                <p>{todo.url}</p>
              </div>
              <div
                className="mb-2 ms-auto me-0"
                style={{ float: "right" }}
                onClick={handleButtonClick}
              >
                <button
                  className="btn btn-primary me-3"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => removeTodo(index)}
                >
                  Delete
                </button>
              </div>
            </div>

            {todo.isCompleted && (
              <div>
                <iframe
                  src={todo.url}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  title="iframe"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
};

const TodoForm = ({ addTodo, addBuckets }) => {
  const [value, setValue] = useState("");
  const [url, setUrl] = useState("");
  const [bucketName, setBucketName] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [newBucketName, setNewBucketName] = useState("");

  const [bucketNames, setBucketNames] = useState(JSON.parse(sessionStorage.getItem("bucketNames")) || ["Entertainment"]);
  const [showBucketInput, setShowBucketInput] = useState(false);



  useEffect(() => {
    
    addBuckets(bucketNames);
  }, [addBuckets, bucketNames]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value) return;
    addTodo({
      text: value,
      isCompleted: false,
      url: url,
      bucketName: bucketName,
    });

    setValue("");
    setUrl("");
    setBucketName("");
    setShowForm(!showForm);
  };

  const addNewBucket = (event) => {
    event.preventDefault();
    setBucketNames([...bucketNames, newBucketName]);
    addBuckets([...bucketNames, newBucketName]);
    setNewBucketName("");
    setShowBucketInput(!showBucketInput);
  };

  return (
    <div className="container-fluid p-0 pt-2">
      <button
        className="btn btn-secondary m-2"
        onClick={() => {
          setShowForm(!showForm);
        }}
      >
        + Add New Card
      </button>

      <button
        className="btn btn-secondary m-2"
        onClick={() => {
          setShowBucketInput(!showBucketInput);
        }}
      >
        + Add New Bucket
      </button>

      <Link
        className="me-2"
        style={{ float: "right" }}
        to={{
          pathname: "/history",
          state: { id: 1 },
        }}
      >
        History Page {">>"}
      </Link>

      {/* <a href="/history">History Page {'>>'}</a> */}

      {showBucketInput && (
        <form onSubmit={addNewBucket} className=" mx-2">
          <input
            type="text"
            className="form-control"
            placeholder="Enter new Bucket name"
            onChange={(e) => {
              setNewBucketName(e.target.value);
            }}
          />
          <button className="btn btn-success my-2" type="submit">
            Add
          </button>
        </form>
      )}

      {showForm && (
        <div className="card m-2 mb-5">
          <form onSubmit={handleSubmit} className="p-2">
            <input
              className="form-control  me-2"
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Name..."
              required
            />
            <br />
            <input
              className="form-control me-2"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Video/mp3 link..."
              required
            />
            <br />
            <label className="form-label">Select Bucket</label>
            <select
              className="form-select"
              name="bucketName"
              defaultValue=""
              onChange={(e) => {
                setBucketName(e.target.value);
              }}
              required
            >
              <option value="" disabled>
                choose an option
              </option>
              {bucketNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <button className="btn btn-success me-1 mt-2" type="submit">
              Submit
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

const CardsPage = () => {
  const [todos, setTodos] = useState([]);
  const [bucketlist, setBucketList] = useState([]);

  useEffect(() => {
    if (sessionStorage.getItem("cardsData")) {
      setTodos(JSON.parse(sessionStorage.getItem("cardsData")));
    }
    
  }, []);

  const addTodo = (todo) => {
    const newTodos = [...todos, todo];
    setTodos(newTodos);
    sessionStorage.setItem("cardsData", JSON.stringify(newTodos));
  };
  const addBuckets = (data) => {
    //const newData = [...bucketlist, data];
    setBucketList(data);
    sessionStorage.setItem("bucketNames", JSON.stringify(data))
  };

  const completeTodo = (index) => {
    let newTodos = [...todos];
    newTodos[index].isCompleted = !newTodos[index].isCompleted;
    setTodos(newTodos);
    let k = newTodos[index];
    k["time"] = new Date().toLocaleDateString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    if (newTodos[index].isCompleted) {
      if (sessionStorage.getItem("history")) {
        let arr = JSON.parse(sessionStorage.getItem("history"));
        arr = [...arr, k];
        sessionStorage.setItem("history", JSON.stringify(arr));
      } else {
        let arr = [];
        arr.push(k);
        sessionStorage.setItem("history", JSON.stringify(arr));
      }
    }
  };

  const removeTodo = (index) => {
    console.log("deleted", todos);
    let newTodos = [...todos];
    newTodos.splice(index, 1);
    console.log(newTodos);
    setTodos(newTodos);
    sessionStorage.setItem("cardsData", JSON.stringify(newTodos));
  };

  const updateTodo = (update) => {
    const newTodos = [...todos];
    newTodos[update.index].text = update.updatedText;
    newTodos[update.index].url = update.updatedUrl;
    newTodos[update.index].bucketName = update.updatedBucket;
    setTodos(newTodos);
    sessionStorage.setItem("cardsData", JSON.stringify(newTodos));
  };

  return (
    <div className="container-fluid ">
      <div className="text-center">
        {" "}
        <i>
          <h1>Convin Frontend Assignment</h1>
        </i>
      </div>
      <TodoForm addTodo={addTodo} addBuckets={addBuckets} />
      {todos.length > 0 && (
        <div className="todo-list m-2">
          {bucketlist.map((bucketname) => (
            <>
              <h3 key={bucketname}>{bucketname}</h3>
              {todos.map((todo, index) => (
                <>
                  {todo.bucketName === bucketname && (
                    <Todo
                      key={JSON.stringify(todo.text)}
                      index={index}
                      todo={todo}
                      completeTodo={completeTodo}
                      removeTodo={removeTodo}
                      updateTodo={updateTodo}
                      bucketNames={bucketlist}
                    />
                  )}
                </>
              ))}
            </>
          ))}
        </div>
      )}
    </div>
  );
};

export default CardsPage;
