import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTrash } from '@fortawesome/free-solid-svg-icons';

function CapsuleCreation() {
    const steps = [
        'TITLE AND DESCRIPTION',
        'IMAGES',
        'IMAGE ADDONS',
        'VISION',
        'PRIVACY',
        'TIME AND DATE',
        'CAPSULE DESIGN'
    ];

    const [completedSteps, setCompletedSteps] = useState({
        title: false,
        images: false,
        time: false,
        voicemail: false,
        vision: false,
        privacy: false,
        design: false
    });

    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        images: [],
        time: '',
        voicemail: '',
        vision: '',
        privacy: '',
        design: ''
    });

    // Handle file upload
    const handleImageUpload = (e) => {
        const uploadedFiles = Array.from(e.target.files); // Convert FileList to Array
        setFormData({
            ...formData,
            images: [...formData.images, ...uploadedFiles], // Append new files
        });
    };

    // Handle removing a specific image
    const removeImage = (index) => {
        const updatedImages = formData.images.filter((_, i) => i !== index);
        setFormData({ ...formData, images: updatedImages });
    };

    const handleNextStep = () => {
        if (currentStep === 0 && formData.title && formData.description) {
            setCompletedSteps({ ...completedSteps, title: true });
        } else if (currentStep === 1 && formData.images.length > 0) {
            setCompletedSteps({ ...completedSteps, images: true });
        } else if (currentStep === 2 && formData.time) {
            setCompletedSteps({ ...completedSteps, time: true });
        }
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePreviousStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className='w-screen h-screen bg-background flex justify-center '>
            <div className='w-[70%] h-[70%] flex bg-background rounded-xl shadow-custom mt-24'>
                <div className='w-8/12 h-full bg-transparent border-r-text border-r-4'>
                    <h1 className='text-center flex text-[#FFD4F1] justify-center pt-12 text-4xl font-black font-lexend'>E-CAPSULE</h1>
                    <div className='flex flex-col justify-center text-left font-lexend text-text font-regular text-[20px] gap-y-4 m-4 mt-20'>
                        <p onClick={() => setCurrentStep(0)}>
                            TITLE AND DESCRIPTION {completedSteps.title && <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 ml-2" />}
                        </p>
                        <p onClick={() => setCurrentStep(1)}>
                            IMAGES {completedSteps.images && <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 ml-2" />}
                        </p>
                        <p onClick={() => setCurrentStep(2)}>
                            IMAGE ADDONS {completedSteps.time && <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 ml-2" />}
                        </p>
                        <p onClick={() => setCurrentStep(3)}>
                            VISION {completedSteps.voicemail && <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 ml-2" />}
                        </p>
                        <p onClick={() => setCurrentStep(4)}>
                            PRIVACY {completedSteps.vision && <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 ml-2" />}
                        </p>
                        <p onClick={() => setCurrentStep(5)}>
                            TIME AND DATE {completedSteps.privacy && <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 ml-2" />}
                        </p>
                        <p onClick={() => setCurrentStep(6)}>
                            CAPSULE DESIGN {completedSteps.design && <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 ml-2" />}
                        </p>
                    </div>
                </div>

                <div className='w-full h-full bg-transparent font-lexend text-center relative'>
                    <h1 className='font-extrabold text-text pt-12 text-3xl h-[20%]'>{steps[currentStep]}</h1>
                    <div className=''>
                        {currentStep === 0 && (
                            <>
                                <p className='text-text font-regular text-2xl mt-4 pb-4'>TITLE</p>
                                <input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className='mb-4 w-10/12 uppercase md:p-2 shadow-secondary rounded-[100px] font-light font-lexend bg-background text-center text-text text-base border-[#A3688F] md:text-xl border-2 focus:outline-none focus:ring-2 focus:ring-[#A3688F]'
                                />
                                <p className='text-text font-regular text-2xl pb-4'>DESCRIPTION</p>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className='mb-4 w-10/12 md:p-2 resize-none h-[240px] shadow-secondary rounded-[10px] font-light font-lexend bg-background text-left text-text text-base border-[#A3688F] md:text-lg border-2 focus:outline-none focus:ring-2 focus:ring-[#A3688F]'
                                ></textarea>
                            </>
                        )}
                        {currentStep === 1 && (
                            <>
                                <p className='text-text font-regular text-2xl mt-8 pb-4 uppercase'>Upload Images</p>
                                <label
                                    htmlFor="images"
                                    className='w-4/6 m-auto flex justify-center items-center md:p-2 py-2 px-4 shadow-secondary rounded-[100px] font-light font-lexend bg-background text-center text-text text-base md:text-xl border-[#A3688F] border-2 cursor-pointer hover:bg-[#A3688F] hover:text-white transition duration-300'
                                >
                                    Choose Images
                                </label>
                                <input
                                    id="images"
                                    type="file"
                                    name="images"
                                    multiple
                                    onChange={handleImageUpload}
                                    className='hidden'
                                />

                                {/* Display uploaded images */}
                                <div className="mt-8 w-10/12 m-auto">
                                    <table className="w-full text-left">
                                     
                                        <tbody>
                                            {formData.images.map((image, index) => (
                                                <tr key={index} className="border-t border-[#A3688F] text-text">
                                                    <td className="p-2">{image.name}</td>
                                                    <td className="p-2">
                                                        <button
                                                            onClick={() => removeImage(index)}
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            <FontAwesomeIcon icon={faTrash} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                        {currentStep === 2 && (
                            <>
                                <p className='text-text font-regular text-xl mt-4'>Set Time and Date</p>
                                <input
                                    type="datetime-local"
                                    name="time"
                                    value={formData.time}
                                    onChange={handleInputChange}
                                    className='mb-4 w-10/12 md:p-2 shadow-secondary rounded-[100px] font-light font-lexend bg-background text-center text-text text-base border-[#A3688F] md:text-xl border-2'
                                />
                            </>
                        )}
                    </div>

                    {/* Button at the bottom */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                        {currentStep < steps.length - 1 && (
                            <button 
                                className="font-lexend text-text font-extralight text-lg tracking-widest relative group"
                                onClick={handleNextStep}
                            >
                                Next
                                <span className="absolute left-0 right-0 bottom-[-5px] h-[2px] w-0 bg-[#A3688F] transition-all group-hover:w-full"></span>
                            </button>
                        )}
                        {/* {currentStep > 0 && (
                            <button
                                className="font-lexend text-text font-extralight text-lg tracking-widest relative group ml-8"
                                onClick={handlePreviousStep}
                            >
                                Previous
                                <span className="absolute left-0 right-0 bottom-[-5px] h-[2px] w-0 bg-[#A3688F] transition-all group-hover:w-full"></span>
                            </button>
                        )} */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CapsuleCreation;
