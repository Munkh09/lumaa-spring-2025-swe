import { Link } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext';

const Navbar = () => {
    const { logout } = useLogout()
    const { user } = useAuthContext()

    const handleClick = () => {
        logout()
    }
    
    return (
        <nav>
            <Link to="/">
                <h3>Task Manager</h3>
            </Link>
            <div className="login-signup">
                {user && (
                    <div>
                        <span className="username">{user.username}</span>
                        <button onClick={handleClick}>Log out</button>
                    </div>
                )}
                {!user && (
                    <div>
                        <Link to="/login" className="login">Login</Link>
                        <Link to="/signup">Signup</Link>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar;