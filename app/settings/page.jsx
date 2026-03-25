"use client"
import React from 'react'
import { motion } from 'framer-motion';
import ThemeToggle from '../components/ThemeMode'
import { useGetMeQuery, useUpdateMeMutation } from '../features/userSlice';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { useEffect } from 'react';
import Cookies from 'js-cookie';

const countries = [
  {value: 'egypt', label: 'Egypt'},
  {value: 'saudi arabia', label: 'Saudi Arabia'},
  {value: 'uae', label: 'UAE'},
  {value: 'qatar', label: 'Qatar'},
  {value: 'american', label: 'American'},
  {value: 'british', label: 'British'},
  {value: 'yemen', label: 'Yemen'},
  {value: 'syria', label: 'Syria'},
  {value: 'lebanon', label: 'Lebanon'},
  {value: 'jordan', label: 'Jordan'},
  {value: 'palestine', label: 'Palestine'},
  {value: 'iraq', label: 'Iraq'},
  {value: 'morocco', label: 'Morocco'},
  {value: 'algeria', label: 'Algeria'},
  {value: 'tunisia', label: 'Tunisia'},
  {value: 'libya', label: 'Libya'},
  {value: 'sudan', label: 'Sudan'},
  {value: 'somalia', label: 'Somalia'},
  {value: 'djibouti', label: 'Djibouti'},
  {value: 'comoros', label: 'Comoros'},
  {value: 'other', label: 'Other'}
];


function Settings() {

  const isAuthenticated = Cookies.get('accessToken') ? true : false;
  const { data: meData } = useGetMeQuery();
  const [updateMe] = useUpdateMeMutation();

    const toDateInput = (d) => {
    if (!d) return "";
    const date = new Date(d);
    if (Number.isNaN(date.getTime())) return "";
    return date.toISOString().slice(0, 10);
  };

  const [firstName, setFirstName] = useState(meData?.data?.firstName || "");
  const [lastName, setLastName] = useState(meData?.data?.lastName || "");
  const [email, setEmail] = useState(meData?.data?.email || "");
  const [phone, setPhone] = useState(meData?.data?.phone || "");
  const [country, setCountry] = useState(meData?.data?.country || "egypt");
  const [birthDate, setBirthDate] = useState(toDateInput(meData?.data?.birthDate));
  const [gender, setGender] = useState(meData?.data?.gender || "male");

  useEffect(() => {

    async function fetchMe() {
      try {
        
        setFirstName(meData?.data?.firstName || "");
        setLastName(meData?.data?.lastName || "");
        setEmail(meData?.data?.email || "");
        setPhone(meData?.data?.phone || "");
        setCountry(meData?.data?.country || "");
        setBirthDate(toDateInput(meData?.data?.birthDate) || "");
        setGender(meData?.data?.gender || "");
      } catch (error) {
        const msg =
          error?.response?.data?.message ||
          error?.message ||
          "Error on Fetch Me";

        toast.error(msg);
      }
    }
    fetchMe();
  }, [ isAuthenticated, meData]);


  const handleUpdate = async () => {
    try {
      const res = await updateMe({
        firstName,
        lastName,
        email,
        phone,
        country,
        birthDate,
        gender,
      });
      setFirstName(res.data.data.firstName);
      setLastName(res.data.data.lastName);
      setEmail(res.data.data.email);
      setPhone(res.data.data.phone);
      setCountry(res.data.data.country);
      setBirthDate(toDateInput(res.data.data.birthDate));
      setGender(res.data.data.gender);
      toast.success("Profile updated successfully!");
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Error on Update Profile";
      toast.error(msg);
    }
  };

  return (
    <div className='flex-1 overflow-auto relative z-10 hide-scrollbar'>
      <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        <motion.div className='bg-primary backdrop-blur-md shadow-lg rounded-xl p-4 md:p-6 border border-border-primary mx-2 md:mx-0 mb-8'
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{delay: 0.2, duration: 0.5}}
        >
          <div className='flex flex-col justify-between mb-6 gap-4'>
            <h2 className='text-lg md:text-xl font-semibold text-text-secondary text-center md:text-left'>Settings</h2>
            <div className='sm:pt-7 sm:px-8 sm:pb-8 border-b border-gray-700 last:border-b-0 mb-8 last:mb-0 md:mb-0 sm:hidden'>
              <div className='flex items-center justify-between mb-5'>
                <p className='text-text-secondary'>Theme Mode</p>
                <ThemeToggle />
              </div>
            </div>
            <div className='flex-1 overflow-auto hide-scrollbar'>
                <div className="sm:pt-7 sm:px-8 sm:pb-8 border-b border-gray-700 last:border-b-0 mb-8 last:mb-0 md:mb-0">
                  <h2 className="text-[17px] font-semibold text-text-secondary mb-5">Contact Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <div className="form-field">
                      <label className='block mb-1.5 text-[13px] font-medium text-text-secondary'>Email</label>
                      <input className='w-full px-2.5 py-3.5 border border-gray-700 rounded-[8px] text-[14px] text-text-secondary bg-transparent outline-none transition-all duration-200 focus:border-[#1d8cdc]' type="email" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div className="form-field">
                      <label className='block mb-1.5 text-[13px] font-medium text-text-secondary'>Phone Number</label>
                      <input className='w-full px-2.5 py-3.5 border border-gray-700 rounded-[8px] text-[14px] text-text-secondary bg-transparent outline-none transition-all duration-200 focus:border-[#1d8cdc]' type="tel" value={phone} onChange={e => setPhone(e.target.value)} />
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="sm:pt-7 sm:px-8 sm:pb-8 border-b border-gray-700 last:border-b-0 mb-8 last:mb-0 md:mb-0">
                  <h2 className="text-[17px] font-semibold text-text-secondary mb-5">Personal Information</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <div className="form-field">
                      <label className='block mb-1.5 text-[13px] font-medium text-text-secondary'>First Name</label>
                      <input className='w-full px-2.5 py-3.5 border border-gray-700 rounded-[8px] text-[14px] text-text-secondary bg-transparent outline-none transition-all duration-200 focus:border-[#1d8cdc]'  value={firstName} onChange={e => setFirstName(e.target.value)} />
                    </div>
                    <div className="form-field">
                      <label className='block mb-1.5 text-[13px] font-medium text-text-secondary'>Last Name</label>
                      <input className='w-full px-2.5 py-3.5 border border-gray-700 rounded-[8px] text-[14px] text-text-secondary bg-transparent outline-none transition-all duration-200 focus:border-[#1d8cdc]' value={lastName} onChange={e => setLastName(e.target.value)} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <div className="form-field">
                      <label className='block mb-1.5 text-[13px] font-medium text-text-secondary'>Country</label>
                      <select className='w-full px-2.5 py-3.5 border border-gray-700 rounded-[8px] text-[14px] text-text-secondary bg-primary outline-none transition-all duration-200 focus:border-[#1d8cdc] cursor-pointer' value={country} onChange={e => setCountry(e.target.value)}>
                        {countries.map(n => (
                          <option key={n.value} value={n.value}>{n.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-field relative">
                      <label className='block mb-1.5 text-[13px] font-medium text-text-secondary'>Birth Date</label>
                      <svg
                        className="absolute left-3 top-2/3 -translate-y-1/2 pointer-events-none text-text-secondary"
                        width="16" height="16"
                        fill="none" stroke="currentColor" strokeWidth="1.8"
                        viewBox="0 0 24 24"
                      >
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8"  y1="2" x2="8"  y2="6" />
                        <line x1="3"  y1="10" x2="21" y2="10" />
                      </svg>
                      <input className='w-full px-2.5 pl-9.5 py-3.5 border border-gray-700 rounded-[8px] text-[14px] text-text-secondary bg-transparent outline-none transition-all duration-200 focus:border-[#1d8cdc]' type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} />
                    </div>
                  </div>

                  <div className="mb-8">
                    <span className="block mb-2.5 text-[13px] font-medium text-text-secondary">Gender</span>
                    <div className="flex gap-7">
                      {['male', 'female'].map(g => (
                        <label key={g} className="flex items-center gap-2 cursor-pointer text-[14px] text-text-secondary" onClick={() => setGender(g)}>
                          <div className={`w-4.5 h-4.5 rounded-full border-2 border-gray-700 flex items-center justify-center transition-all duration-200 shrink-0 ${gender === g ? 'border-[#1d8cdc]' : ''}`}>
                            {gender === g && <div className="w-2 h-2 rounded-full bg-[#1d8cdc]" />}
                          </div>
                          {g.charAt(0).toUpperCase() + g.slice(1)}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button className="bg-secondary border border-gray-700 px-8 py-3 rounded-lg text-text-secondary text-[14px] font-semibold cursor-pointer hover:bg-primary hover:text-text-primary transition-colors" onClick={handleUpdate}>
                      Update Profile
                    </button>
                  </div>
                </div>
              </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

export default Settings