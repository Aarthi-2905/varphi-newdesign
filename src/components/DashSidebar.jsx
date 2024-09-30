import { Sidebar, Modal, Button } from 'flowbite-react';
import { HiUser,HiArrowSmRight,HiOutlineUserGroup,HiAnnotation,HiOutlineExclamationCircle} from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaRobot } from 'react-icons/fa';
import { logout, setStatus } from "../utils/Auth";
import {Flowbite} from 'flowbite-react'

const customTheme = {  
    sidebar: {    
        root: {      
            base: "h-full",      
            inner: "h-full overflow-y-auto overflow-x-hidden bg-[rgb(31,41,55)] py-12 pl-12 text-white "    
        }  
    }
};

export default function DashSidebar() {
    const [tab, setTab] = useState('');
    const [showSignOutModal, setShowSignOutModal] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const userrole = useState(localStorage.getItem('role'));
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        const fetchUser = async () => {
            const requestOptions = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
            };
            const response = await fetch('http://127.0.0.1:8000/login', requestOptions);
            const data = await response.json();
            if (data) {
                localStorage.setItem("token", token);
                localStorage.setItem("role", data['role']);
                return true;
            } else {
                console.log("Token verification failed");
                setToken(null);
                navigate('/');
                return null;
            }
        };
        fetchUser();
    }, [token]);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');
        if (tabFromUrl) {
            setTab(tabFromUrl);
        }
    }, [location.search]);

    const handleSignOut = () => {
        logout();
        setShowSignOutModal(false);
        navigate('/');
        setStatus('Signout Successfully');
    };

    // const activeStyle = 'bg-gray-600 font-semibold text-white hover:bg-gray-100 hover:text-black'; // Active tab style
    // const inactiveStyle = 'hover:bg-gray-100 hover:text-black text-white'; // Inactive tab hover style

    const activeStyle = 'bg-gradient-to-r from-[rgba(31,41,55,0)] to-[rgba(168,224,255,1)] hover:font-semibold font-semibold text-white hover:bg-gray-100 hover:text-black  w-full pr-0 rounded-none'; // Active tab style
    const inactiveStyle = 'hover:bg-gradient-to-r hover:from-[rgba(31,41,55,0)] hover:font-semibold hover:to-[rgba(168,224,255,1)] hover:text-black text-white rounded-none'; // Inactive tab hover style


    return (
        <>
            <Flowbite theme={{ theme: customTheme }}>
                <Sidebar className='w-80 h-full bg-gray-800 '>
                    <Sidebar.Items className='flex flex-col h-full '>
                        <Sidebar.ItemGroup className='flex flex-col gap-1 text-white'>
                            <Link to='/dashboard?tab=dash'>
                                <Sidebar.Item className={`${tab === 'dash' || !tab ? activeStyle : inactiveStyle}`}
                                    icon={() => <FaRobot style={{ color: 'rgb(168,224,255)', fontSize: '24px'}} />} as='div'>
                                    Chat Interface
                                </Sidebar.Item>
                            </Link>
                            {localStorage.getItem('role') === 'super_admin' && (
                                <>
                                    <Link to='/dashboard?tab=users'>
                                        <Sidebar.Item className={`${tab === 'users' ? activeStyle : inactiveStyle}`}
                                            icon={() => <HiOutlineUserGroup  style={{ color: 'rgb(168,224,255)', fontSize: '24px'}} />} as='div'>
                                            User Management
                                        </Sidebar.Item>
                                    </Link>
                                    <Link to='/dashboard?tab=requests'>
                                        <Sidebar.Item className={`${tab === 'requests' ? activeStyle : inactiveStyle}`}
                                            icon={() => <HiAnnotation  style={{ color: 'rgb(168,224,255)', fontSize: '24px'}} />} as='div'>
                                            Requested Files
                                        </Sidebar.Item>
                                    </Link>
                                    <Link to='/dashboard?tab=profile'>
                                        <Sidebar.Item  className={`${tab === 'profile' ? activeStyle : inactiveStyle}`}
                                            icon={() => <HiUser  style={{ color: 'rgb(168,224,255)', fontSize: '28px'}} />} >
                                        <div className="flex items-center justify-between w-full ">                            
                                                    <span>Profile</span>                            
                                                    <span className="px-2 py-1 mr-16 text-xs font-medium bg-gray-700 hover:text-white rounded">
                                                        {userrole}
                                                    </span>                        
                                                </div>
                                        </Sidebar.Item>
                                    </Link>
                                    <Sidebar.Item icon={() => <HiArrowSmRight  style={{ color: 'rgb(168,224,255)', fontSize: '28px'}} />} 
                                    className={`${tab === '#' ? activeStyle : inactiveStyle}  `}
                                        onClick={() => setShowSignOutModal(true)}>
                                        Sign Out
                                    </Sidebar.Item>
                                </>
                            )}
                            {/* <div className='fixed bottom-3'>
                                <Link to='/dashboard?tab=profile'>
                                    <Sidebar.Item  className={`${tab === 'profile' ? activeStyle : inactiveStyle}`}
                                        icon={() => <HiUser  style={{ color: 'rgb(168,224,255)', fontSize: '24px'}} />} label={userrole} labelColor='dark' as='div'>
                                        Profile
                                    </Sidebar.Item>
                                </Link>
                                <Sidebar.Item icon={() => <HiArrowSmRight  style={{ color: 'rgb(168,224,255)', fontSize: '24px'}} />} 
                                className='cursor-pointer text-white hover:text-black'
                                    onClick={() => setShowSignOutModal(true)}>
                                    Sign Out
                                </Sidebar.Item>
                            </div>  */}
                        </Sidebar.ItemGroup>
                    </Sidebar.Items>
                </Sidebar>

                <Modal show={showSignOutModal} onClose={() => setShowSignOutModal(false)} popup size='md'>
                    <Modal.Header />
                    <Modal.Body>
                        <div className='text-center'>
                            <HiOutlineExclamationCircle className='h-14 w-14  text-gray-200 mb-4 mx-auto' />
                            <h3 className='mb-5 text-lg  text-gray-400'>
                                Are you sure you want to sign out?
                            </h3>
                            <div className='flex justify-center gap-4'>
                                <Button color='failure' onClick={handleSignOut}>
                                    Yes, Sign Out
                                </Button>
                                <Button color='gray' onClick={() => setShowSignOutModal(false)}>
                                    No, Stay
                                </Button>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            </Flowbite>
        </>
    );
}

