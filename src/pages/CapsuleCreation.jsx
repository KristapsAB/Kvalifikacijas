import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTrash, faComment } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function CapsuleCreation() {
    const steps = [
        'TITLE AND DESCRIPTION',
        'IMAGES',
        'TIME AND DATE',
        'IMAGE ADDONS',
        'VISION',
        'PRIVACY',
        'CAPSULE DESIGN'
    ];
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageComment, setImageComment] = useState('');

    const [completedSteps, setCompletedSteps] = useState({
        title: false,
        images: false,
        time: false,
        addons: false,
        vision: false,
        privacy: false,
        design: false
    });

    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        images: [],
        time: new Date(),
        addons: [],
        vision: '',
        privacy: '',
        design: ''
    });
    
    const token = localStorage.getItem('access_token');

    const handleImageSelection = (e) => {
        const files = Array.from(e.target.files);
        setFormData(prevState => ({
            ...prevState,
            images: [...prevState.images, ...files.map(file => ({ file, comment: '' }))]
        }));
    };

    const removeImage = (index) => {
        const updatedImages = formData.images.filter((_, i) => i !== index);
        setFormData({ ...formData, images: updatedImages });
    };
    const selectImage = (index) => {
        setSelectedImage(index);
        setImageComment(formData.images[index].comment || '');
    };
    
    const handleDateChange = (date) => {
        console.log('Date selected:', date);
        setFormData({
            ...formData,
            time: date,
        });
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const saveImageComment = () => {
        if (selectedImage !== null) {
            setFormData(prevState => ({
                ...prevState,
                images: prevState.images.map((img, index) => 
                    index === selectedImage ? { ...img, comment: imageComment } : img
                )
            }));
            console.log(`Saved comment for image ${selectedImage}:`, imageComment);
            setSelectedImage(null);
            setImageComment('');
        }
    };

    const handleNextStep = () => {
        if (currentStep === 0 && formData.title && formData.description) {
            setCompletedSteps({ ...completedSteps, title: true });
        } else if (currentStep === 1 && formData.images.length > 0) {
            setCompletedSteps({ ...completedSteps, images: true });
        } else if (currentStep === 2 && formData.time) {
            setCompletedSteps({ ...completedSteps, time: true });
            createCapsule();  // Only create capsule after time is set
        }
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const createCapsule = async () => {
        const imageFormData = new FormData();
    
        formData.images.forEach((image, index) => {
            imageFormData.append(`images[${index}]`, image.file);
            imageFormData.append(`image_comments[${index}]`, image.comment || '');
            console.log(`Appending comment for image ${index}:`, image.comment); 
        });
    
        imageFormData.append('title', formData.title);
        imageFormData.append('description', formData.description);
        imageFormData.append('time', formData.time.toISOString());
    
        console.log('FormData:', Object.fromEntries(imageFormData.entries()));

        try {
            const response = await fetch('http://127.0.0.1:8000/api/capsule/upload-images', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: imageFormData,
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            console.log('Capsule created successfully', data);
        } catch (error) {
            console.error('Error creating capsule:', error);
        }
    };

    const presetDates = [
        { label: '1 Month', value: new Date(new Date().setMonth(new Date().getMonth() + 1)) },
        { label: '6 Months', value: new Date(new Date().setMonth(new Date().getMonth() + 6)) },
        { label: '1 Year', value: new Date(new Date().setFullYear(new Date().getFullYear() + 1)) },
    ];

    return (
        <div className='w-screen min-h-screen bg-background flex justify-center items-center p-4 overflow-auto'>
            <div className='w-full max-w-6xl h-auto lg:h-[80vh] flex flex-col lg:flex-row bg-background rounded-xl shadow-custom'>
                <div className='w-full lg:w-4/12 h-full bg-transparent lg:border-r-accent lg:border-r-4 p-4'>
                    <h1 className='text-center flex text-[#FFD4F1] justify-center pt-6 lg:pt-12 text-3xl lg:text-4xl font-black font-lexend'>E-CAPSULE</h1>
                    <div className='flex flex-col justify-center text-left font-lexend text-text font-regular text-base lg:text-[20px] gap-y-2 lg:gap-y-4 m-4 mt-8 lg:mt-20'>
                        {steps.map((step, index) => (
                            <p key={index} onClick={() => setCurrentStep(index)} className="cursor-pointer flex items-center">
                                {step} {completedSteps[Object.keys(completedSteps)[index]] && <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 ml-2" />}
                            </p>
                        ))}
                    </div>
                </div>

                <div className='w-full lg:w-8/12 h-full bg-transparent font-lexend text-center relative p-4 lg:p-6'>
                    <h1 className='font-extrabold text-text pt-6 lg:pt-12 text-2xl lg:text-3xl mb-8'>{steps[currentStep]}</h1>
                    <div className='mb-16'>
                        {currentStep === 0 && (
                            <>
                                <p className='text-text font-regular text-xl lg:text-2xl mt-4 pb-4'>TITLE</p>
                                <input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className='mb-4 w-full max-w-md uppercase lg:p-2 shadow-secondary rounded-[100px] font-light font-lexend bg-background text-center text-text text-base border-[#A3688F] lg:text-xl border-2 focus:outline-none focus:ring-2 focus:ring-[#A3688F]'
                                />
                                <p className='text-text font-regular text-xl lg:text-2xl pb-4'>DESCRIPTION</p>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className='mb-4 w-full max-w-md lg:p-2 resize-none h-32 lg:h-[240px] shadow-secondary rounded-[10px] font-light font-lexend bg-background text-left text-text text-base border-[#A3688F] lg:text-lg border-2 focus:outline-none focus:ring-2 focus:ring-[#A3688F]'
                                ></textarea>
                            </>
                        )}
                        {currentStep === 1 && (
                            <>
                                <p className='text-text font-regular text-xl lg:text-2xl mt-8 pb-4 uppercase'>Upload Images</p>
                                <label
                                    htmlFor="images"
                                    className='w-full max-w-xs mx-auto flex justify-center items-center lg:p-2 py-2 px-4 shadow-secondary rounded-[100px] font-light font-lexend bg-background text-center text-text text-base lg:text-xl border-[#A3688F] border-2 cursor-pointer hover:bg-[#A3688F] hover:text-white transition duration-300'
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
                                />

                                <div className="mt-8 w-full max-w-md mx-auto">
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
                                <p className='text-text font-regular text-xl mt-4 mb-4'>Set Time and Date for Capsule Opening</p>
                                <div className="flex flex-col items-center">
                                    <DatePicker
                                        selected={formData.time}
                                        onChange={handleDateChange}
                                        showTimeSelect
                                        timeFormat="HH:mm"
                                        timeIntervals={15}
                                        timeCaption="Time"
                                        dateFormat="MMMM d, yyyy h:mm aa"
                                        className='mb-4 w-full max-w-md lg:p-2 shadow-secondary rounded-[100px] font-light font-lexend bg-background text-center text-text text-base border-[#A3688F] lg:text-xl border-2 focus:outline-none focus:ring-2 focus:ring-[#A3688F]'
                                    />
                                    <div className="flex justify-center gap-4 mt-4">
                                        {presetDates.map((preset, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleDateChange(preset.value)}
                                                className="px-4 py-2 bg-[#A3688F] text-white rounded-full hover:bg-[#8A4B6A] transition duration-300"
                                            >
                                                {preset.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

{currentStep === 3 && (
            <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
                    {formData.images.length > 0 ? (
                        formData.images.map((image, index) => (
                            <div key={index} className="relative group">
                                <img
                                    src={URL.createObjectURL(image.file)}
                                    alt={`Uploaded ${index}`}
                                    className="w-full h-auto rounded-lg shadow-lg cursor-pointer"
                                    onClick={() => {
                                        setSelectedImage(index);
                                        setImageComment(image.comment || '');
                                    }}
                                />
                                <button
                                    onClick={() => removeImage(index)}
                                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                                {image.comment && (
                                    <div className="absolute bottom-2 right-2 text-green-500">
                                        <FontAwesomeIcon icon={faComment} />
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="col-span-4 text-center text-text">No images uploaded yet.</p>
                    )}
                </div>
                {selectedImage !== null && (
                    <div className="mt-4">
                        <textarea
                            value={imageComment}
                            onChange={(e) => setImageComment(e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Add a comment to this image..."
                        />
                        <button
                            onClick={saveImageComment}
                            className="mt-2 px-4 py-2 bg-[#A3688F] text-white rounded-full hover:bg-[#8A4B6A] transition duration-300"
                        >
                            Save Comment
                        </button>
                    </div>
                )}
            </>
        )}
                      
                    </div>

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
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CapsuleCreation;