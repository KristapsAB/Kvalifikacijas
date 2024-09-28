import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faFacebookF, faInstagram, faDiscord } from '@fortawesome/free-brands-svg-icons';
import { faCheckCircle, faExclamationCircle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState('');
    const [touched, setTouched] = useState({ email: false, password: false });

    const navigate = useNavigate(); 

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const validateEmail = (email) => {
        if (!email.trim()) return "Email field cannot be empty.";
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(String(email).toLowerCase())) return "Please enter a valid email address.";
        if (email.length > 255) return "Email must not exceed 255 characters.";
        return "";
    };

    const validatePassword = (password) => {
        if (!password.trim()) return "Password field cannot be empty.";
        if (password.length < 8) return "Password must be at least 8 characters long.";
        return "";
    };

    const handleBlur = (field) => {
        setTouched({ ...touched, [field]: true });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrors({});
        setSuccess('');

        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);

        if (emailError || passwordError) {
            setErrors({
                email: emailError,
                password: passwordError
            });
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 422) {
                    setErrors(data.errors);
                } else if (response.status === 401) {
                    setErrors({ general: data.message });
                } else {
                    setErrors({ general: 'An unexpected error occurred. Please try again.' });
                }
                return;
            }

            setSuccess('Login successful!');
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('user', JSON.stringify(data.user));

            navigate('/profile'); 
        } catch (err) {
            setErrors({ general: 'An unexpected error occurred. Please try again.' });
        }
    };

    return (
        <div className="h-screen w-screen flex bg-background overflow-hidden justify-center items-center">
            <div className="flex w-11/12 h-full flex-col md:flex-row">
                <div className="relative flex bg-background w-full md:w-[60%] p-4 md:p-10 h-1/3 md:h-full">
                    <h1 className="absolute inset-0 flex justify-center items-center text-[#FFD4F1] font-lexend font-bold text-3xl md:text-[4.4em] text-center max-w-full px-4 md:px-10 leading-tight">
                        E-CAPSULE
                    </h1>
                    <img
                        src={`${process.env.PUBLIC_URL}/images/LoginImage.jpg`}
                        alt="Login Visual"
                        className="w-full h-full object-cover rounded-[45px] md:rounded-[90px]"
                    />
                </div>
                <div className="flex bg-background w-full md:w-[40%] h-2/3 md:h-full">
                    <div className="flex flex-col items-center space-y-1 w-full px-4 md:px-8 pt-8 md:pt-40">
                        <h1 className="text-2xl md:text-4xl font-extralight font-lexend tracking-wider text-text">NEVERFORGET.</h1>
                        <p className="text-lg md:text-xl text-[#FFD4F1] tracking-wide font-lexend font-bold">E-CAPSULE</p>
                        <form onSubmit={handleLogin} className="flex flex-col pt-6 md:pt-10 space-y-4 md:space-y-6 w-full max-w-md items-center justify-center text-text">
                            {errors.general && (
                                <div className="w-full bg-red-900 border-l-4 border-red-500 text-red-100 p-4 rounded-r-lg shadow-md mb-4">
                                    <div className="flex items-center">
                                        <FontAwesomeIcon icon={faExclamationCircle} className="text-red-300 mr-2" />
                                        <p className="font-bold">{errors.general}</p>
                                    </div>
                                </div>
                            )}
                            
                            {success && (
                                <div className="w-full bg-green-900 border-l-4 border-green-500 text-green-100 p-4 rounded-r-lg shadow-md mb-4">
                                    <div className="flex items-center">
                                        <FontAwesomeIcon icon={faCheckCircle} className="text-green-300 mr-2" />
                                        <p className="font-bold">{success}</p>
                                    </div>
                                </div>
                            )}
                            
                            <div className="w-full relative">
                                <input
                                    type="email"
                                    placeholder="EMAIL"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onBlur={() => handleBlur('email')}
                                    className={`p-3 md:p-5 w-full shadow-secondary rounded-[100px] font-light font-lexend bg-background text-center text-text text-base border-[#A3688F] md:text-xl border-2 ${
                                        touched.email && (errors.email ? 'border-red-500' : email.trim() && !errors.email ? 'border-green-500' : 'border-[#A3688F]')
                                    } outline-none placeholder-white placeholder-opacity-30 transition-all duration-300`}
                                />
                                {touched.email && errors.email && (
                                    <div className="absolute -bottom-6 left-0 w-full text-center text-red-500 font-lexend text-sm">
                                        <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                                        {errors.email}
                                    </div>
                                )}
                            </div>

                            <div className="w-full relative">
                                <input
                                    type="password"
                                    placeholder="PASSWORD"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onBlur={() => handleBlur('password')}
                                    className={`p-3 md:p-5 w-full shadow-secondary rounded-[100px] font-light tracking-wide font-lexend bg-background text-center text-text text-base border-[#A3688F] md:text-xl border-2  ${
                                        touched.password && (errors.password ? 'border-red-500' : password.trim() && !errors.password ? 'border-green-500' : 'border-[#A3688F]')
                                    } outline-none placeholder-white placeholder-opacity-30 transition-all duration-300`}
                                />
                                {touched.password && errors.password && (
                                    <div className="absolute -bottom-6 left-0 w-full text-center text-red-500 text-sm font-lexend">
                                        <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                                        {errors.password}
                                    </div>
                                )}
                            </div>
                            <button 
                                type="submit" 
                                className="font-lexend text-text font-extralight text-sm tracking-widest relative group mt-8">
                                LOGIN
                                <span className="absolute left-0 right-0 bottom-[-5px] h-[2px] w-0 bg-[#A3688F] transition-all duration-300 group-hover:w-full"></span>
                            </button>
                        </form>
                        
                        <div className="w-full pt-4">
                            <p className="text-text text-center mb-4 font-lexend text-sm md:text-base">Or login with</p>
                            <div className="flex justify-center space-x-6">
                                <FontAwesomeIcon icon={faGoogle} className="text-xl md:text-2xl cursor-pointer text-text" />
                                <FontAwesomeIcon icon={faFacebookF} className="text-xl md:text-2xl cursor-pointer text-text" />
                                <FontAwesomeIcon icon={faInstagram} className="text-xl md:text-2xl cursor-pointer text-text" />
                                <FontAwesomeIcon icon={faDiscord} className="text-xl md:text-2xl cursor-pointer text-text" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
