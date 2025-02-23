import { useState } from 'react'
import { useSignup } from '../hooks/useSignup'

const Signup = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const { signup, error, isLoading } = useSignup()

    const handleSubmit = async (e) => {
        e.preventDefault()

        await signup(username, password)
    }

    return (
        <div className="signup-page">
            <form onSubmit={handleSubmit}>
                <h3>Register</h3>
                <div className='username-signup'>
                    <label>Username:</label>
                    <input
                        type="text"
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                    />
                </div>
                <div className='password-signup'>
                    <label>Password:</label>
                    <input
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />
                </div>
                <button disabled={isLoading}>Register</button>
                {error && <div className="error">{error}</div>}
            </form>
        </div>
    )

}

export default Signup