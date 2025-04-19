import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../slices/userSlice';
import { setToken } from '../slices/authSlice';
import toast from 'react-hot-toast';

const ProfileMenu = () => {
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate(); 

    const logout = () => {
        dispatch(setUser(null));
        dispatch(setToken(null));
        localStorage.removeItem("token");
        toast.success("Logged Out Successfully");
        navigate('/');
    }

    return (
        <div className='text-black flex flex-col text-center gap-y-1.5 mx-auto'>
            <div>{user?.name}</div>
            <div>{user?.license}</div>
            <div>{user?.email}</div>
            <div>{user?.location}</div>
            <button className='bg-slateblue text-white p-2 rounded-md' onClick={logout}>Logout</button>
        </div>
    )
}

export default ProfileMenu
