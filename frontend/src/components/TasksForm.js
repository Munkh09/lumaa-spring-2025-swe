import { useState } from "react"
import { useTasksContext } from '../hooks/useTasksContext'
import { useAuthContext } from '../hooks/useAuthContext'

const TasksForm = () => {
    const { dispatch } = useTasksContext()
    const { user } = useAuthContext()

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [isComplete, setIsComplete] = useState(false)
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!user) {
            setError('Access denied: not logged in')
            return
        }

        const task = { title, description, isComplete }

        const response = await fetch('http://localhost:4000/tasks', {
            method: 'POST',
            body: JSON.stringify(task),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })

        const json = await response.json()

        if (!response.ok) {
            setError(json.error)
        }

        if (response.ok) {
            setTitle('')
            setDescription('')
            setIsComplete(false)
            setError(null)
            console.log('new task added', json.addedTask.rows[0])
            dispatch({ type: 'CREATE_TASK', payload: json.addedTask.rows[0] })
        }

    }


    return (
        <div className="task-form">
            <form className="create" onSubmit={handleSubmit}>
                <h3>Add a new task</h3>
                <div className="title">
                    <label>Title:</label>
                    <input
                        type="text"
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                    />
                </div>

                <div className="description">
                    <label>Description:</label>
                    <input
                        type="text"
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                    />
                </div>

                <div className="complete-status">
                    <label>Completed:</label>
                    <input
                        type="checkbox"
                        checked={isComplete}
                        onChange={() => setIsComplete(!isComplete)}
                    />
                </div>
                <button onClick={handleSubmit}>Add Task</button>
                {error && <div className="error">{error}</div>}
            </form>
        </div>
    )
}


export default TasksForm