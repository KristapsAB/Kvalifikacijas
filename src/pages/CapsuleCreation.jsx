import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTrash, faComment, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CapsuleDesignSelector from '../components/profileComponents/CapsuleDesignSelector';
import CapsulePreview from '../components/capsuleCreationComponents/CapsulePreview';
import CapsuleSharing from '../components/capsuleCreationComponents/CapsuleSharing';
import { useNavigate } from 'react-router-dom';
import CustomCalendar from '../components/capsuleCreationComponents/CustomCalendar'

const validateStep = (step, formData) => {
    const errors = {};

    switch (step) {
        case 0: 
            if (!formData.title?.trim()) {
                errors.title = 'Title is required';
            } else if (formData.title.length > 255) {
                errors.title = 'Title must be less than 255 characters';
            }
            if (!formData.description?.trim()) {
                errors.description = 'Description is required';
            }
            break;

        case 1: 
            if (!formData.images || formData.images.length === 0) {
                errors.images = 'At least one image is required';
            }
            break;

        case 2: 
            if (!formData.time) {
                errors.time = 'Opening time is required';
            } else {
                const selectedTime = new Date(formData.time);
                const currentTime = new Date();
                if (selectedTime <= currentTime) {
                    errors.time = 'Opening time must be in the future';
                }
            }
            break;

        case 4: 
            if (!formData.vision?.trim()) {
                errors.vision = 'Vision is required';
            }
            break;

        case 5: 
            if (!formData.privacy || !['private', 'friends', 'public'].includes(formData.privacy)) {
                errors.privacy = 'Please select a privacy setting';
            }
            break;

        case 6:
            if (!formData.design) {
                errors.design = 'Please select a capsule design';
            }
            break;

        default:
            break;
    }

    return errors;
};

const ALLOWED_FILE_TYPES = {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/gif': ['.gif'],
    'video/mp4': ['.mp4']
};

const MAX_FILE_SIZE = 65536 * 1024; 

function CapsuleCreation() {
    const steps = [
        'TITLE AND DESCRIPTION',
        'IMAGES',
        'TIME AND DATE',
        'IMAGE ADDONS',
        'VISION',
        'PRIVACY',
        'CAPSULE DESIGN',
        'PREVIEW',
        'SHARING'
    ];

    const [currentStep, setCurrentStep] = useState(0);
    const [stepErrors, setStepErrors] = useState({});
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        images: [],
        time: new Date(),
        vision: '',
        privacy: 'private',
        design: 'default',
        sharedWith: []
    });
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageComment, setImageComment] = useState('');
    const [attemptedNext, setAttemptedNext] = useState(false);

    const token = localStorage.getItem('access_token');

    useEffect(() => {
        if (attemptedNext) {
            const errors = validateStep(currentStep, formData);
            setStepErrors(errors);
        }
    }, [formData, currentStep, attemptedNext]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const validateFile = (file) => {
        if (!Object.keys(ALLOWED_FILE_TYPES).includes(file.type)) {
            return `File type not supported. Allowed types: ${Object.values(ALLOWED_FILE_TYPES).flat().join(', ')}`;
        }
        if (file.size > MAX_FILE_SIZE) {
            return `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`;
        }
        return null;
    };

    const handleImageSelection = (e) => {
        const files = Array.from(e.target.files);
        const fileErrors = [];
        const validFiles = [];

        files.forEach(file => {
            const error = validateFile(file);
            if (error) {
                fileErrors.push({ file: file.name, error });
            } else {
                validFiles.push({ file, comment: '' });
            }
        });

        if (fileErrors.length > 0) {
            setStepErrors({ images: fileErrors.map(f => `${f.file}: ${f.error}`).join(', ') });
            return;
        }

        setFormData(prevState => ({
            ...prevState,
            images: [...prevState.images, ...validFiles]
        }));
        setStepErrors({});
    };

    const removeImage = (index) => {
        const updatedImages = formData.images.filter((_, i) => i !== index);
        setFormData({ ...formData, images: updatedImages });
    };

    const selectImage = (index) => {
        setSelectedImage(index);
        setImageComment(formData.images[index].comment || '');
    };

    const saveImageComment = () => {
        if (selectedImage !== null) {
            setFormData(prevState => ({
                ...prevState,
                images: prevState.images.map((img, index) => 
                    index === selectedImage ? { ...img, comment: imageComment } : img
                )
            }));
            setSelectedImage(null);
            setImageComment('');
        }
    };

    const handleDateChange = (date) => {
        setFormData({
            ...formData,
            time: date,
        });
    };

    const handleNextStep = () => {
        setAttemptedNext(true);
        const errors = validateStep(currentStep, formData);
        setStepErrors(errors);

        if (Object.keys(errors).length === 0) {
            setCurrentStep(currentStep + 1);
            setAttemptedNext(false);
        }
    };

    const handlePrevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
            setAttemptedNext(false);
        }
    };

    const createCapsule = async () => {
        const errors = validateStep(currentStep, formData);
        if (Object.keys(errors).length > 0) {
            setStepErrors(errors);
            return;
        }

        const capsuleData = new FormData();
        formData.sharedWith.forEach((userId, index) => {
            capsuleData.append(`shared_with[${index}]`, userId);
        });
    
        formData.images.forEach((image, index) => {
            capsuleData.append(`images[${index}]`, image.file);
            capsuleData.append(`image_comments[${index}]`, image.comment || '');
        });
    
        capsuleData.append('title', formData.title);
        capsuleData.append('description', formData.description);
        capsuleData.append('time', formData.time.toISOString());
        capsuleData.append('vision', formData.vision);
        capsuleData.append('privacy', formData.privacy);
        capsuleData.append('design', formData.design);
    
        try {
            const response = await fetch('http://127.0.0.1:8000/api/capsule/create', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: capsuleData,
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            console.log('Capsule created successfully', data);
            navigate('/profile'); 
        } catch (error) {
            console.error('Error creating capsule:', error);
            setStepErrors({ submit: 'Failed to create capsule. Please try again.' });
        }
    };

    const renderError = (error) => {
        if (!error) return null;
        return (
            <div className="text-red-500 text-sm mt-2 flex items-center justify-center">
                <FontAwesomeIcon icon={faExclamationCircle} className="mr-2" />
                <span>{error}</span>
            </div>
        );
    };

    return (
        <div className='min-h-screen bg-background flex justify-center items-center p-2 sm:p-4 overflow-auto'>
        <div className='w-full max-w-6xl min-h-[600px] h-auto lg:h-[80vh] flex flex-col lg:flex-row bg-background rounded-xl shadow-custom'>
            <div className='hidden lg:block lg:w-4/12 h-full bg-transparent lg:border-r-accent lg:border-r-4 p-2 sm:p-4'>
                <h1 className='text-center flex text-[#FFD4F1] justify-center pt-12 text-4xl font-black font-lexend'>
                    E-CAPSULE
                </h1>
                <div className='flex flex-col justify-center text-left font-lexend text-text font-regular text-[20px] gap-y-4 m-4 mt-20'>
                    {steps.map((step, index) => (
                        <div key={index} className="flex items-center">
                            <p 
                                onClick={() => setCurrentStep(index)} 
                                className={`cursor-pointer flex-grow transition-all duration-200 hover:opacity-80 ${currentStep === index ? 'font-bold' : ''}`}
                            >
                                {step}
                            </p>
                            {index < currentStep && (
                                <FontAwesomeIcon 
                                    icon={faCheckCircle} 
                                    className="text-green-500 ml-2"
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className='lg:hidden w-full bg-transparent px-4 py-2'>
                <h1 className='text-center text-[#FFD4F1] text-2xl font-black font-lexend mb-2'>
                    E-CAPSULE
                </h1>
                <div className='flex items-center justify-center gap-1'>
                    {steps.map((_, index) => (
                        <div 
                            key={index}
                            className={`h-1 rounded-full transition-all duration-200 ${
                                index === currentStep 
                                    ? 'w-4 bg-[#A3688F]' 
                                    : 'w-1 bg-gray-300'
                            }`}
                        />
                    ))}
                </div>
            </div>
    
            <div className='w-full lg:w-8/12 h-auto lg:h-full bg-transparent font-lexend text-center relative p-2 sm:p-4 lg:p-6'>
                <h1 className='font-extrabold text-text pt-2 lg:pt-12 text-xl sm:text-2xl lg:text-3xl mb-4 sm:mb-8'>
                    {steps[currentStep]}
                </h1>
                    <div className='mb-16'>
                       {currentStep === 0 && (
                        <>
                            <p className='text-text font-regular text-lg sm:text-xl lg:text-2xl mt-2 sm:mt-4 pb-2 sm:pb-4'>
                                TITLE
                            </p>
                            <input
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className={`mb-4 w-full max-w-md uppercase p-1.5 sm:p-2 shadow-secondary rounded-[100px] font-light font-lexend bg-background text-center text-text text-sm sm:text-base lg:text-xl focus:outline-none focus:ring-2 ${
                                    stepErrors.title ? 'border-red-500' : 'border-[#A3688F]'
                                } border-2`}
                            />
                            {renderError(stepErrors.title)}
                            
                            <p className='text-text font-regular text-lg sm:text-xl lg:text-2xl pb-2 sm:pb-4'>
                                DESCRIPTION
                            </p>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className={`mb-4 w-full max-w-md p-1.5 sm:p-2 resize-none h-24 sm:h-32 lg:h-[240px] shadow-secondary rounded-[10px] font-light font-lexend bg-background text-left text-text text-sm sm:text-base lg:text-lg focus:outline-none focus:ring-2 ${
                                    stepErrors.description ? 'border-red-500' : 'border-[#A3688F]'
                                } border-2`}
                            ></textarea>
                            {renderError(stepErrors.description)}
                        </>
                    )}
    
                        {currentStep === 1 && (
                            <>
                                <p className='text-text font-regular text-lg sm:text-xl lg:text-2xl mt-4 sm:mt-8 pb-2 sm:pb-4 uppercase'>
                                    Upload Images
                                </p>
                                <label
                                    htmlFor="images"
                                    className={`w-full max-w-xs mx-auto flex justify-center items-center p-1.5 sm:p-2 shadow-secondary rounded-[100px] font-light font-lexend bg-background text-center text-text text-sm sm:text-base lg:text-xl border-2 cursor-pointer hover:bg-[#A3688F] hover:text-white transition duration-300 ${
                                        stepErrors.images ? 'border-red-500' : 'border-[#A3688F]'
                                    }`}
                                >
                                    Choose Images
                                </label>
                                <input
                                    id="images"
                                    type="file"
                                    name="images"
                                    multiple
                                    onChange={handleImageSelection}
                                    className='hidden'
                                    accept={Object.values(ALLOWED_FILE_TYPES).flat().join(',')}
                                />
                                {renderError(stepErrors.images)}
    
                                <div className="mt-4 sm:mt-8 w-full max-w-md mx-auto">
                                    <table className="w-full text-left text-sm sm:text-base">
                                        <tbody>
                                            {formData.images.map((image, index) => (
                                                <tr key={index} className="border-t border-[#A3688F] text-text">
                                                    <td className="p-1.5 sm:p-2">{image.file.name}</td>
                                                    <td className="p-1.5 sm:p-2">
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
                                <p className='text-text font-regular text-lg sm:text-xl mt-2 sm:mt-4 mb-2 sm:mb-4'>
                                    Set Time and Date for Capsule Opening
                                </p>
                                <div className="flex flex-col items-center">
                                    <CustomCalendar
                                        selectedDate={formData.time}
                                        onDateChange={handleDateChange}
                                    />
                                    {renderError(stepErrors.time)}
                                </div>
                            </>
                        )}
    
                        {currentStep === 3 && (
                            <>
                                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 mt-4 sm:mt-8">
                                    {formData.images.map((image, index) => (
                                        <div 
                                            key={index} 
                                            className="relative group aspect-square w-full"
                                        >
                                            <div className="w-full h-full relative">
                                                <img
                                                    src={URL.createObjectURL(image.file)}
                                                    alt={`Uploaded ${index}`}
                                                    className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-lg cursor-pointer hover:opacity-90 transition-opacity duration-300"
                                                    onClick={() => selectImage(index)}
                                                />
                                                {image.comment && (
                                                    <div 
                                                        className="absolute bottom-2 right-2 text-green-500 bg-white bg-opacity-75 rounded-full p-1.5 sm:p-2 cursor-pointer hover:bg-opacity-100"
                                                        onClick={() => selectImage(index)}
                                                    >
                                                        <FontAwesomeIcon icon={faComment} className="text-sm sm:text-base" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
    
                                {selectedImage !== null && (
                                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
                                        <div className="bg-background rounded-lg p-3 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                                            <div className="flex justify-between items-center mb-2 sm:mb-4">
                                                <h3 className="text-lg sm:text-xl font-bold text-text">Add Comment to Image</h3>
                                                <button 
                                                    onClick={() => {
                                                        setSelectedImage(null);
                                                        setImageComment('');
                                                    }}
                                                    className="text-text hover:text-[#A3688F]"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                            
                                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                                                <div className="w-full sm:w-1/2">
                                                    <div className="aspect-square w-full relative">
                                                        <img
                                                            src={URL.createObjectURL(formData.images[selectedImage].file)}
                                                            alt="Selected for comment"
                                                            className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-lg"
                                                        />
                                                    </div>
                                                </div>
    
                                                <div className="w-full sm:w-1/2 flex flex-col">
                                                    <textarea
                                                        value={imageComment}
                                                        onChange={(e) => setImageComment(e.target.value)}
                                                        className="flex-grow p-2 sm:p-3 border rounded-lg border-[#A3688F] focus:outline-none focus:ring-2 focus:ring-[#A3688F] bg-background text-text resize-none mb-2 sm:mb-4 text-sm sm:text-base"
                                                        placeholder="Add your comment here..."
                                                        rows={6}
                                                    />
                                                    
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedImage(null);
                                                                setImageComment('');
                                                            }}
                                                            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-[#A3688F] text-text hover:bg-[#A3688F] hover:text-white transition duration-300 text-sm sm:text-base"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            onClick={saveImageComment}
                                                            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#A3688F] text-white rounded-full hover:bg-[#8A4B6A] transition duration-300 text-sm sm:text-base"
                                                        >
                                                            Save Comment
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
    
                        {currentStep === 4 && (
                            <>
                                <p className='text-text font-regular text-lg sm:text-xl lg:text-2xl pb-2 sm:pb-4'>
                                    VISION
                                </p>
                                <textarea
                                    name="vision"
                                    value={formData.vision}
                                    onChange={handleInputChange}
                                    placeholder="Share your thoughts, expectations, or considerations for this time capsule..."
                                    className={`mb-4 w-full max-w-md p-1.5 sm:p-2 resize-none h-24 sm:h-32 lg:h-[240px] shadow-secondary rounded-[10px] font-light font-lexend bg-background text-left text-text text-sm sm:text-base lg:text-lg border-2 focus:outline-none focus:ring-2 ${
                                        stepErrors.vision ? 'border-red-500' : 'border-[#A3688F]'
                                    }`}
                                ></textarea>
                                {renderError(stepErrors.vision)}
                            </>
                        )}
    
                        {currentStep === 5 && (
                            <>
                                <p className='text-text font-regular text-lg sm:text-xl lg:text-2xl pb-2 sm:pb-4'>
                                    PRIVACY SETTINGS
                                </p>
                                <select
                                    name="privacy"
                                    value={formData.privacy}
                                    onChange={handleInputChange}
                                    className={`mb-4 w-full max-w-md p-1.5 sm:p-2 shadow-secondary rounded-[100px] font-light font-lexend bg-background text-center text-text text-sm sm:text-base lg:text-xl border-2 focus:outline-none focus:ring-2 ${
                                        stepErrors.privacy ? 'border-red-500' : 'border-[#A3688F]'
                                    }`}
                                >
                                    <option value="private">Private</option>
                                    <option value="friends">Friends Only</option>
                                    <option value="public">Public</option>
                                </select>
                                {renderError(stepErrors.privacy)}
                            </>
                        )}
    
                        {currentStep === 6 && (
                            <div className="h-full flex flex-col">
                                <div className="flex-1 overflow-hidden">
                                    <CapsuleDesignSelector
                                        value={formData.design}
                                        onChange={handleInputChange}
                                        error={stepErrors.design}
                                    />
                                    {renderError(stepErrors.design)}
                                </div>
                            </div>
                        )}
    
                        {currentStep === 7 && (
                            <>
                                <CapsulePreview formData={formData} />
                            </>
                        )}
    
                        {currentStep === 8 && (
                            <>
                                <CapsuleSharing 
                                    onShareSelectionChange={(selectedFriends) => 
                                        setFormData(prev => ({ ...prev, sharedWith: selectedFriends }))
                                    }
                                />
                                {renderError(stepErrors.submit)}
                        </>
                    )}
                </div>

                <div className="absolute bottom-2 sm:bottom-4 left-0 right-0 flex justify-center space-x-2 sm:space-x-4">
                    {currentStep > 0 && (
                        <button 
                            className="font-lexend text-text font-extralight text-base sm:text-lg tracking-widest relative group px-2 sm:px-4"
                            onClick={handlePrevStep}
                        >
                            Previous
                            <span className="absolute left-0 right-0 bottom-[-5px] h-[2px] w-0 bg-[#A3688F] transition-all group-hover:w-full"></span>
                        </button>
                    )}
                    {currentStep < steps.length - 1 && (
                        <button 
                            className="font-lexend text-text font-extralight text-base sm:text-lg tracking-widest relative group px-2 sm:px-4"
                            onClick={handleNextStep}
                        >
                            Next
                            <span className="absolute left-0 right-0 bottom-[-5px] h-[2px] w-0 bg-[#A3688F] transition-all group-hover:w-full"></span>
                        </button>
                    )}
                    {currentStep === steps.length - 1 && (
                        <button 
                            className="font-lexend text-white font-bold text-base sm:text-lg tracking-widest relative group bg-[#A3688F] px-4 sm:px-6 py-1.5 sm:py-2 rounded-full hover:bg-[#8A4B6A] transition duration-300"
                            onClick={createCapsule}
                        >
                            Save Capsule
                        </button>
                    )}
                </div>
            </div>
        </div>
    </div>
);
}

export default CapsuleCreation;