import { isEmpty, size } from "lodash";
import React, { useState, useEffect } from "react";
//import shortid from "shortid";
import { addDocument, deleteDocument, getCollection, updateDocument } from "./actions";

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [id, setId] = useState("");
  const [error, setError] = useState(false)
  
  useEffect(()=>{
    (async () => {
      const result = await getCollection("tasks")
      if (result.statusResponse){
        setTasks(result.data)
      }
    })()
  }, [])

  const validForn = () =>  {
  let isValid = true
  setError(null)

  if (isEmpty(task)) {
    setError("Debes ingresar una task")
    isValid=false
  }
  return isValid
  }

  const addTask = async(e) => {
    e.preventDefault();

    if(!validForn()){
    return
    }

    const result = await addDocument("tasks", {name: task})
    if (!result.statusResponse){
      setError(result.error)
      return
    }
    //const newTask = {
      //id: shortid.generate(),
      //name: task,
    //};

    setTasks([...tasks, { id: result.data.id, name: task }]);
    setTask("");
  };

  const deleteTask = async(id) => {
    const result = await deleteDocument("tasks", id)
    if (!result.statusResponse){
      setError(result.error)
      return
    }

    const filteredTasks = tasks.filter((task) => task.id !== id);

    setTasks(filteredTasks);
    setEditMode(false)
  };

  const editTask = (theTask) => {
    setTask(theTask.name);
    setEditMode(true);
    setId(theTask.id);
  };

  const saveTask = async(e) => {
    e.preventDefault();
    if(!validForn()){
      return
      }
    
    const result = await updateDocument("tasks", id, {name: task})
    if (!result.statusResponse){
      setError(result.error)
      return
    }

    const editedTask = tasks.map((item) => item.id === id ? { id, name: task } : item
    );
    setTasks(editedTask);
    setEditMode(false);
    setTask("");
    setId("");
  };

  return (
    <div className="container mt-5">
      <h1>Tareas</h1>
      <hr />
      <div className="row">
        <div className="col-8">
          <h4 className="text-center">Lista de Tareas</h4>
          {size(tasks) > 0 ? (
            <ul className="list-group">
              {tasks.map((task) => (
                <li className="list-group-item" key={task.id}>
                  <span className="lead">{task.name}</span>
                  <button
                    className="btn btn-danger btn-sm float-right mx-2"
                    onClick={() => deleteTask(task.id)}
                  >
                    Eliminar
                  </button>
                  <button
                    className="btn btn-warning btn-sm float-right mx-2"
                    onClick={() => editTask(task)}
                  >
                    Editar
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <li className="list-group-item">No hay tareas</li>
          )}
        </div>
        <div className="col-4">
          <h4 className="text-center">
            {editMode ? "Modificar Tarea" : "Agregar Tarea"}
          </h4>
          <form onSubmit={editMode ? saveTask : addTask}>
            {
              error && <span className="text-danger">{error}</span>
            }
            
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Ingrese la tarea..."
              onChange={(text) => setTask(text.target.value)}
              value={task}
            />
            <button
              className={
                editMode
                  ? "btn btn-warning btn-block"
                  : "btn btn-dark btn-block"
              }
              type="submit"
            >
              {editMode ? "Guardar" : "Agregar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
