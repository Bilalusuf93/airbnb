"use client";
import { useMemo, useState } from 'react';
import Modal from './Modal'
import useRentModal from '@/app/hooks/useRentModal'
import Heading from '../Heading';
import { categories } from '../navbar/Categories';
import CategoryInput from '../inputs/CategoryInput';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import CountrySelect from '../inputs/CountrySelect';
import dynamic from 'next/dynamic';
import Counter from '../inputs/Counter';
import ImageUpload from '../inputs/ImageUpload';
import Input from '../inputs/input';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
enum STEPS {
    CATEGORY = 0,
    LOCATION = 1,
    INFO = 2,
    IMAGES = 3,
    DESCRIPTION = 4,
    PRICE = 5
}

const RentModal = () => {
    const router = useRouter();
    const rentModal = useRentModal();

    const [step, setStep] = useState(STEPS.CATEGORY);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: {
            errors
        },
        reset
    } = useForm<FieldValues>({
        defaultValues: {
            category: '',
            location: null,
            guestCount: 1,
            roomCount: 1,
            bathroomCount: 1,
            imageSrc: '',
            price: 1,
            title: '',
            description: ''
        }
    });
    const category = watch('category');
    const location = watch('location');
    const guestCount = watch('guestCount');
    const roomCount = watch('roomCount');
    const bathroomCount = watch('bathroomCount');
    const imageSrc = watch('imageSrc');

    const Map = useMemo(() => dynamic(() => import('../Map'), {
        ssr: false
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }), [location])

    const setCustomValue = (id: string, value: any) => {
        setValue(id, value, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true
        })
    }
    const onBack = () => {
        setStep((value) => value - 1);
    }
    const onNext = () => {
        setStep((value) => value + 1);
    }

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        if (step !== STEPS.PRICE) {
            return onNext();
        }

        setIsLoading(true);
        axios.post('/api/listings', data)
            .then(() => {
                toast.success('Listing Created');
                router.refresh();
                reset();
                setStep(STEPS.CATEGORY);
                rentModal.onClose();
            })
            .catch(() => {
                toast.error('Something went wrong')
            })
            .finally(() => setIsLoading(false))

    }
    const actionLabel = useMemo(() => {
        if (step === STEPS.PRICE) {
            return 'Create'
        }
        return 'Next'
    }, [step]);

    const secondaryActionLabel = useMemo(() => {
        if (step === STEPS.CATEGORY) {
            return undefined
        }
        return 'Back'
    }, [step]);

    const handleCountrySelect = () => {

    }

    let bodyContent = (
        <div className="flex flex-col gap-8">
            <Heading
                title='Which of these best describes your place?'
                subTitle='Pick a category'
            />
            <div className="
                    grid
                    grid-cols-1max-h-[50vh]
                    overflow-y-auto
                    md:grid-cols-2
                    gap-3

            ">
                {categories?.map((item) => (
                    <div key={item.label} className='col-span-1'>
                        <CategoryInput
                            onClick={(category) =>
                                setCustomValue('category', category)}
                            selected={category === item.label}
                            label={item.label}
                            icon={item.icon}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
    if (step === STEPS.LOCATION) {
        console.log('location', location);
        bodyContent = (
            <div className='flex flex-col gap-8'>
                <Heading
                    title='Where is your place located'
                    subTitle='Help guests find you!'
                />
                <CountrySelect
                    value={location}
                    onChange={(value) => setCustomValue('location', value)}
                />
                <Map
                    center={location?.latlng}
                />
            </div>
        )
    }
    if (step === STEPS.INFO) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title='Share some basic abour your place'
                    subTitle='What amenities do you have?'
                />
                <Counter
                    title='Guests'
                    subTitle='How many guests do you allow?'
                    onChange={(value) => setCustomValue('guestCount', value)}
                    value={guestCount}
                />
                <hr />
                <Counter
                    title='Rooms'
                    subTitle='How many rooms do you have?'
                    onChange={(value) => setCustomValue('roomCount', value)}
                    value={roomCount}
                />
                <hr />
                <Counter
                    title='Bathrooms'
                    subTitle='How many bathromms do you have?'
                    onChange={(value) => setCustomValue('bathroomCount', value)}
                    value={bathroomCount}
                />
            </div>
        )
    }
    if (step === STEPS.IMAGES) {
        bodyContent = (
            <div className='flex flex-col gap-8'>
                <Heading
                    title='Add a photo of your choice'
                    subTitle='Show guests how your place looks like!'
                />
                <ImageUpload
                    onChange={(value) => { setCustomValue('imageSrc', value) }}
                    value={imageSrc}
                />
            </div>
        )
    }
    if (step === STEPS.DESCRIPTION) {
        bodyContent = (
            <div className='flex flex-col gap-8'>
                <Heading
                    title='How would you describe your place'
                    subTitle='Short and sweet works best!'
                />
                <Input
                    id='title'
                    label='Title'
                    disbaled={isLoading}
                    register={register}
                    errors={errors}
                    required
                />
                <Input
                    id='description'
                    label='Description'
                    disbaled={isLoading}
                    register={register}
                    errors={errors}
                    required
                />
            </div>
        )
    }
    if (step === STEPS.PRICE) {
        bodyContent = (
            <div className='flex flex-col gap-8'>
                <Heading
                    title='Now, set your price'
                    subTitle='How much do you charge per night?'
                />
                <Input
                    id='price'
                    label='Price'
                    formatPrice
                    type='number'
                    disbaled={isLoading}
                    errors={errors}
                    register={register}
                    required
                />
            </div>
        )
    }
    return (
        <Modal
            isOpen={rentModal.isOpen}
            onClose={rentModal.onClose}
            actionLabel={actionLabel}
            secondaryActionLabel={secondaryActionLabel}
            secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
            onSubmit={handleSubmit(onSubmit)}
            title='Air bnb your home'
            body={bodyContent}
        />
    )
}

export default RentModal