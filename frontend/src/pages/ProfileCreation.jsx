import React, { useContext, useEffect } from 'react';
import './ProfileCreation.css'
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../Context/UserContext';
import { useForm} from "react-hook-form";

const ProfileCreation = () => {
  const navigate = useNavigate();
  const {user} = useContext(UserContext);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()  
  useEffect(() => {
    if (user?.name) {
      reset({
        fullName: user.name,
        age: '',
        country: '',
        zipCode: '',
        currency: '',
      });
    }
  }, [user, reset]);
  const onSubmit = (data) => {
    console.log("Profile Form Data:", data);
    
    navigate('/interestPage');
  };
  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Profile Creation</h2>
        <div className="profile-pic-placeholder"></div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="input-group">
            <input {...register("fullName",{required: "Full Name is required" })} type="text" id="full-name" placeholder='Full name'name="full-name" />
            {errors.fullName && <p>{errors.fullName.message}</p>}
          </div>

          <div className="input-group">
            <input {...register("age", {
                required: "Age is required",
                min: { value: 0, message: "Age must be positive" },
              })} type="number" id="age" placeholder='Age' name="age"/>
               {errors.age && <p>{errors.age.message}</p>}
          </div>

          <div className="input-group">
            <input {...register("country", { required: "Country is required" })} type="text" id="country" placeholder='Country of Residence'name="country"/>
            {errors.country && <p>{errors.country.message}</p>}
          </div>

          <div className="input-group">
            <input {...register("zipCode", { required: "Zip Code is required" })} type="text" id="zip-code" placeholder='Zip Code' name="zip-code"/>
            {errors.zipCode && <p>{errors.zipCode.message}</p>}
          </div>

          <div className="input-group">
            <input {...register("currency", { required: "Currency is required" })} type="text" id="currency" placeholder='Preferred Currency'name="currency"/>
            {errors.currency && <p>{errors.currency.message}</p>}
          </div>

          <button type="submit">Save</button>
        </form>
      </div>
    </div>
  );
};

export default ProfileCreation;
