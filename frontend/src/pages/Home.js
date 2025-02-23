import { useEffect } from 'react' 
import { useTasksContext } from '../hooks/useTasksContext'
import { useAuthContext } from '../hooks/useAuthContext'

import TaskDetails from '../components/TaskDetails'
import TasksForm from '../components/TasksForm'

const Home = () => {
    // Whenever the global state of tasks changes,
    // all the components that use it will be re-rendered
    const {tasks, dispatch} = useTasksContext()
    const {user} = useAuthContext()

    useEffect(() => {
        const fetchTasks = async () => {
            const response = await fetch('http://localhost:4000/tasks', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()
            
            if (response.ok) {
                dispatch({type: 'SET_TASKS', payload: json})
            }
        }

        if (user) {
            fetchTasks()
        }

    }, [])

    return (
        <main className="home">
            <section className="tasks">
                {tasks && tasks.map((task) => (
                    <TaskDetails key={task.id} task={task}/>
                ))}
            </section>
            <TasksForm />
        </main>
    )
}

export default Home;