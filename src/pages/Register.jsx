import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faFacebookF, faInstagram, faDiscord } from '@fortawesome/free-brands-svg-icons';
import { faExclamationCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

function Register() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setValidationErrors({});
        setSuccess('');

        try {
            const response = await fetch('http://localhost:8000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({ email, name, password }),
                credentials: 'include',
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.errors) {
                    setValidationErrors(data.errors);
                } else {
                    throw new Error(data.message || 'An error occurred during registration');
                }
                return;
            }

            setSuccess('Registration successful!');

            localStorage.setItem('access_token', data.access_token);  
            localStorage.setItem('user', JSON.stringify(data.user));  

            navigate('/profile');
        } catch (err) {
            setError(err.message || 'An error occurred during registration');
        }
    };

    return (
        <div className="h-screen w-screen flex bg-background overflow-hidden justify-center items-center">
            <div className="flex w-11/12 h-full flex-col md:flex-row">
                <div className="relative flex bg-background w-full md:w-[60%] p-4 md:p-10 h-1/3 md:h-full">
                    <h1 className="absolute inset-0 flex justify-center items-center text-[#FFD4F1] font-lexend font-bold text-3xl md:text-[4.4em] z-10">
                        E-CAPSULE
                    </h1>
                    <img
                        src={`${process.env.PUBLIC_URL}/images/LoginImage.jpg`}
                        alt="Register Visual"
                        className="w-full h-full object-cover rounded-[45px] md:rounded-[90px]"
                    />
                </div>

                <div className="flex bg-background w-full md:w-[40%] h-2/3 md:h-full">
                    <div className="flex flex-col items-center space-y-1 w-full px-4 md:px-8 pt-8 md:pt-40">
                        <h1 className="text-2xl md:text-4xl font-extralight font-lexend tracking-wider text-text">NEVERFORGET.</h1>
                        <p className="text-lg md:text-xl text-[#FFD4F1] tracking-wide font-lexend font-bold">E-CAPSULE</p>
                        
                        <form onSubmit={handleSubmit} className="flex flex-col pt-6 md:pt-10 space-y-4 md:space-y-6 w-full max-w-md items-center justify-center text-text">
                            
                            {error && (
                                <div className="flex items-center bg-red-100 text-red-700 p-3 rounded-lg w-full mb-4">
                                    <FontAwesomeIcon icon={faExclamationCircle} className="mr-2 text-xl" />
                                    <p className="text-sm">{error}</p>
                                </div>
                            )}
                            
                            {success && (
                                <div className="flex items-center bg-green-100 text-green-700 p-3 rounded-lg w-full mb-4">
                                    <FontAwesomeIcon icon={faCheckCircle} className="mr-2 text-xl" />
                                    <p className="text-sm">{success}</p>
                                </div>
                            )}

                            <input
                                type="email"
                                placeholder="EMAIL"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="p-3 md:p-4 w-full shadow-secondary rounded-[100px] font-light font-lexend bg-background text-center text-text text-base md:text-lg border-2 border-[#A3688F] outline-none placeholder-white placeholder-opacity-30"
                            />
                            {validationErrors.email && (
                                <p className="text-red-500 text-xs mt-1">{validationErrors.email[0]}</p>
                            )}

                            <input
                                type="text"
                                placeholder="NAME"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="p-3 md:p-4 w-full shadow-secondary rounded-[100px] font-light font-lexend bg-background text-center text-text text-base md:text-lg border-2 border-[#A3688F] outline-none placeholder-white placeholder-opacity-30"
                            />
                            {validationErrors.name && (
                                <p className="text-red-500 text-xs mt-1">{validationErrors.name[0]}</p>
                            )}

                            <input
                                type="password"
                                placeholder="PASSWORD"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="p-3 md:p-4 w-full shadow-secondary rounded-[100px] font-light tracking-wide font-lexend bg-background text-center text-text text-base md:text-lg border-2 border-[#A3688F] outline-none placeholder-white placeholder-opacity-30"
                            />
                            {validationErrors.password && (
                                <p className="text-red-500 text-xs mt-1">{validationErrors.password[0]}</p>
                            )}

                            <button type="submit" className="font-lexend text-text font-extralight text-sm tracking-widest relative group">
                                REGISTER
                                <span className="absolute left-0 right-0 bottom-[-5px] h-[2px] w-0 bg-[#A3688F] transition-all duration-300 group-hover:w-full"></span>
                            </button>
                        </form>

                        {/* Social login options */}
                        <div className="w-full pt-4">
                            <p className="text-text text-center mb-4 font-lexend text-sm md:text-base">Or register with</p>
                            <div className="flex justify-center space-x-6">
                                <FontAwesomeIcon icon={faGoogle} className="text-xl md:text-2xl text-text hover:text-[#A3688F] transition-all duration-300" />
                                <FontAwesomeIcon icon={faFacebookF} className="text-xl md:text-2xl text-text hover:text-[#A3688F] transition-all duration-300" />
                                <FontAwesomeIcon icon={faInstagram} className="text-xl md:text-2xl text-text hover:text-[#A3688F] transition-all duration-300" />
                                <FontAwesomeIcon icon={faDiscord} className="text-xl md:text-2xl text-text hover:text-[#A3688F] transition-all duration-300" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
