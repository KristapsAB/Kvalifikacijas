import React, { useEffect } from "react";

function Register() {
    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    return (
        <div className="h-screen w-screen flex bg-background overflow-hidden justify-center items-center">
            <div className="flex w-11/12 h-full">
                <div className="relative flex bg-background w-[60%] p-10 h-full">
                    <h1 className="absolute inset-0 flex justify-center items-center text-[#FFD4F1] font-lexend font-bold text-[4.4em]">
                        E-CAPSULE
                    </h1>
                    <img
                        src={`${process.env.PUBLIC_URL}/images/LoginImage.jpg`}
                        alt="Register Visual"
                        className="w-full h-full object-cover rounded-[90px]"
                    />
                </div>

                <div className="flex bg-background w-[40%] h-full">
                    <div className="flex flex-col items-center space-y-1 w-full px-8 pt-40">
                        <h1 className="text-4xl font-extralight font-lexend tracking-wider text-text">NEVERFORGET.</h1>
                        <p className="text-xl text-[#FFD4F1] tracking-wide font-lexend font-bold">E-CAPSULE</p>
                        <div className="flex flex-col pt-10 space-y-8 w-full max-w-md items-center justify-center text-text">
                            <input
                                type="email"
                                placeholder="EMAIL"
                                className="p-5 w-full shadow-secondary rounded-[100px] font-light font-lexend bg-background text-center text-text text-xl border-2 border-[#A3688F] outline-none placeholder-white placeholder-opacity-30"
                            />
                            <input
                                type="text"
                                placeholder="USERNAME"
                                className="p-5 w-full shadow-secondary rounded-[100px] font-light font-lexend bg-background text-center text-text text-xl border-2 border-[#A3688F] outline-none placeholder-white placeholder-opacity-30"
                            />
                            <input
                                type="password"
                                placeholder="PASSWORD"
                                className="p-5 w-full shadow-secondary rounded-[100px] font-light tracking-wide font-lexend bg-background text-center text-text text-xl border-2 border-[#A3688F] outline-none placeholder-white placeholder-opacity-30"
                            />
                            <button className="font-lexend text-text font-extralight text-sm tracking-widest relative group">
                                REGISTER
                                <span className="absolute left-0 right-0 bottom-[-5px] h-[2px] w-0 bg-[#A3688F] transition-all duration-300 group-hover:w-full"></span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
