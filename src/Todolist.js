import { useState, useEffect } from "react";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";

export default function Todolist() {
    function getStoreTodos() {
        let data = localStorage.getItem("todos");
        let json = JSON.parse(data);
        if (json) {
            return json;
        }
        return [];
    }

    const [todos, setTodos] = useState(getStoreTodos());
    const [dueDate, setDueDate] = useState(null);
    const [permission, setPermission] = useState("default");
    const [notificationShown, setNotificationShown] = useState(false); 

    useEffect(() => {
        if (Notification.permission !== "granted") {
            Notification.requestPermission().then((permission) => {
                setPermission(permission);
            });
        } else {
            setPermission(Notification.permission);
        }
    }, []);

    useEffect(() => {
        const handleNotifications = () => {
            if (!notificationShown) {
                todos.forEach((todo) => {
                    if (todo.dueDate && !todo.completed) {
                        const dueDate = new Date(todo.dueDate);
                        if (dueDate.getTime() < Date.now() && permission === "granted") {
                            new Notification("You left me for a while, I am due now😒");
                            const newTodos = todos.map((item) => {
                                if (item === todo) {
                                    return { ...item, overdue: true };
                                }
                                return item;
                            });
                            setTodos(newTodos);
                            setNotificationShown(true);
                        }
                    }
                });
            }
        };

        handleNotifications();
    }, [todos, permission, notificationShown]);

    useEffect(() => {
        localStorage.setItem("todos", JSON.stringify(todos));
    }, [todos]);

    function handleSubmit(event) {
        event.preventDefault();

        let task = event.target.task.value;
        let category = event.target.category.value;

        if (!task) {
            alert("Please provide a valid task");
            return;
        }
        
        const newTodo = {
            id: todos.length + 1,
            task: task,
            dueDate: dueDate,
            completed: false,
            category: category,
            overdue: false
        };
        
        setTodos([...todos, newTodo]);

        event.target.reset();
        setDueDate("");
    }

    function changeTaskStatus(id) {
        const newTodos = todos.map((item) => {
            if (item.id === id) {
                return { ...item, completed: !item.completed };
            }
            return item;
        });
        setTodos(newTodos);
    }

    function deleteTask(id) {
        const newTodos = todos.filter((item) => item.id !== id);
        setTodos(newTodos);
    }

    function renderTasksByCategory(category) {
        const filteredTasks = todos.filter(todo => todo.category === category);
        return (
            <div>
                {filteredTasks.map((todo, index) => (
                    <div key={index} className={"rounded mt-4 p-2 d-flex " + (todo.overdue ? "bg-danger bg-gradient" : (todo.completed ? "bg-success bg-gradient p-2 text-white" : "bg-light bg-gradient bg-opacity-75"))}>
                        <div className="me-auto">
                            <strong>{todo.task}</strong>
                        </div>
                        <span>{todo.dueDate ? formatDueDate(todo.dueDate) : null}</span>
                        <div>
                            <i className={"h5 me-2 " + (todo.completed ? "bi bi-check-square" : "bi bi-square")}
                                style={{ cursor: "pointer" }} onClick={() => changeTaskStatus(todo.id)}></i>
                            <i className="bi bi-trash h5"
                                style={{ cursor: "pointer", color: todo.overdue ? "black" : "inherit" }} onClick={() => deleteTask(todo.id)}></i>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    function formatDueDate(date) {
        return date.toLocaleString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
        });
    }

    return (
        <div className="container my-5" style={{ backgroundImage: 'linear-gradient(to right,rgba(255,0, 0, 0), rgb(34, 88, 151)'}}>
            <div className="mx-auto rounded boarder p-4" style={{ width: "1000px", backgroundColor: "#08618d" }}>
                <h2 className="text-white text-center mb-5">To-Do Trove</h2>

                <form className="d-flex" onSubmit={handleSubmit}>
                    <input className="form-control me-2" placeholder="New Task" name="task" />
                    <select className="form-select me-2" name="category" style={{ width: "150px" }}>
                        <option value="personal">Personal</option>
                        <option value="work">Work</option>
                        <option value="others">Others</option>
                    </select>
                    <Datetime
                        className="react-datetime-picker"
                        inputProps={{
                            style: {
                                border: '1px solid #ced4da',
                                borderRadius: '0.25rem',
                                padding: '0.385rem 0.95rem',
                                fontSize: '1rem',
                                lineHeight: '1.5',
                                color: '#495057',
                                backgroundColor: '#fff',
                                backgroundClip: 'padding-box',
                                transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
                                width: '250px',
                            },
                            placeholder: "Date & Time"
                        }}
                        value={dueDate}
                        onChange={(value) => { setDueDate(value.toDate()) }}
                    />
                    <button className="btn btn-outline-light" type="submit" style={{ marginLeft: '10px' }}>Add</button>
                </form>
                
                {/* Display tasks based on categories */}
                <div className="mt-4">
                    <h3 className="text-white mb-3">Categories:</h3>
                    <div className="row">
                        <div className="col">
                            <h4 className="text-white">Personal</h4>
                            {renderTasksByCategory("personal")}
                        </div>
                        <div className="col">
                            <h4 className="text-white">Work</h4>
                            {renderTasksByCategory("work")}
                        </div>
                        <div className="col">
                            <h4 className="text-white">Others</h4>
                            {renderTasksByCategory("others")}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
