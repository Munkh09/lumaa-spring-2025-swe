import { useAuthContext } from "./useAuthContext"
import { useTasksContext } from "./useTasksContext"

export const useLogout = () => {
    const { dispatch } = useAuthContext()
    const { dispatch: tasksDispatch } = useTasksContext()

    const logout = () => {
        // 1. remove user from storage
        localStorage.removeItem('user')
        
        // 2. dispatch logout action
        dispatch({type: 'LOGOUT'})
        tasksDispatch({type: 'SET_TASKS', payload: null})
    }

    return { logout }

}