import { createContext, useReducer } from "react";


export const TasksContext = createContext()

export const tasksReducer = (state, action) => {
    switch (action.type) {
        case 'SET_TASKS': 
            return {
                tasks: action.payload
            }
        case 'CREATE_TASK':
            return {
                tasks: [action.payload, ...state.tasks]
            }
        case 'DELETE_TASK':
            return {
                tasks: state.tasks.filter((task) => task.id !== action.payload.id)
            }
        case 'UPDATE_TASK':
            return {
                tasks: state.tasks.map((task) => task.id === action.payload.id ? action.payload : task)
            }
        default:
            return state
    }
}

export const TasksContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(tasksReducer, {
        tasks: null
    })

    return (
        // we're providing the state and the ability to change this state 
        // to all of the components 
        <TasksContext.Provider value={{ ...state, dispatch }}>
            { children } 
        </TasksContext.Provider>
    )
}