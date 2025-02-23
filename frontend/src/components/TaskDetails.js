import { useTasksContext } from "../hooks/useTasksContext"
import { useAuthContext } from "../hooks/useAuthContext"
import { useState } from 'react'

const TaskDetails = ({ task }) => {
    const { dispatch } = useTasksContext()
    const { user } = useAuthContext()
    
    const [isEditing, setIsEditing] = useState(false) 
    const [title, setTitle] = useState(task.title)
    const [description, setDescription] = useState(task.description)
    const [isComplete, setIsComplete] = useState(task.isComplete)

    const handleDelete = async () => {
        if (!user) {
            return
        }
        
        const response = await fetch('http://localhost:4000/tasks/' + task.id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        
        if (response.ok) {
            const json = await response.json()
            dispatch({type: 'DELETE_TASK', payload: json.deletedTask})
        }
    }

    const handleUpdate = async () => {
        if (!user) {
            return
        }

        const updatedTask = {
            id: task.id, 
            title,
            description,
            isComplete
        }

        const response = await fetch('http://localhost:4000/tasks/' + task.id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify(updatedTask)
        })

        if (response.ok) {
            const json = await response.json();
            dispatch({ type: 'UPDATE_TASK', payload: json.updatedTask });
            setIsEditing(false);
        }
    }


    return (
        <div className="task-details">
        {isEditing ? (
            <div className="task-edit">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <label>
                    <input
                        type="checkbox"
                        checked={isComplete}
                        onChange={(e) => setIsComplete(e.target.checked)}
                    />
                    Completed
                </label>
                <button onClick={handleUpdate}>Save</button>
                <button onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
        ) : (
            <div className="task">
                <h4>{task.title}</h4>
                <p>Description: {task.description}</p>
                <p>Complete: {task.is_complete ? 'Completed' : 'Not Completed'}</p>
                <button onClick={handleDelete}>Delete</button>
                <button onClick={() => setIsEditing(true)}>Edit</button>
            </div>
        )}
    </div>
    )
}

export default TaskDetails