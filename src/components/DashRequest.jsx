
import React, { useState,useEffect  } from 'react';
import { useTable, usePagination, useGlobalFilter } from 'react-table';
import { Modal, Table, Button, TextInput } from 'flowbite-react';
import { HiOutlineExclamationCircle, HiSearch, HiX,HiXCircle,HiCheckCircle   } from 'react-icons/hi';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { approveFile, fetchFiles, rejectFile } from '../fetch/DashRequest';
import approveImage from '../assets/approve.png';
import rejectImage from '../assets/reject.png';

export function SearchBar({ globalFilter, setGlobalFilter }) {
    return (
        <div className="flex max-w-xs rounded-lg shadow-custom-bottom">
        <TextInput id="search" type="search" placeholder="Search files" value={globalFilter || ''}
            onChange={(e) => setGlobalFilter(e.target.value || undefined)} required icon={HiSearch}
        />
        </div>
    );
}

export default function DashRequest() {
    // const dummyRequests = [
    //     { file_name: 'testingword.docx',  email: 'user1' },
    //     { file_name: 'Task details.xlsx',  email: 'user2' },
    //     { file_name: 'varphi final logo.pdf',  email: 'user3' },
    //     { file_name: 'abc.txt',  email: 'user4' },
    //     { file_name: 'Task details.xlsx',  email: 'user2' },
    //     { file_name: 'varphi final logo.pdf',  email: 'user3' },
    //     { file_name: 'abc.txt',  email: 'user4' },
    // ];
    
    const [data, setData] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
    const [isEditConfirmModalOpen, setIsEditConfirmModalOpen] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });

    //Loads user data and displays success messages from localStorage on component mount.
    useEffect(() => {
        async function loadData() {
            try {
                const data = await fetchFiles(); 
                if (!data) {
                    throw new Error('Network response was not ok');
             
                }
                setData(data['detail']);
                // const data = dummyRequests;
                // setData(data);
            } catch (error) {
                setToast({
                    show: true,
                    message:'Failed to fetch details',
                    type: 'error'
                });
                autoCloseToast();
                console.error("Failed to fetch users:", error);
            }
        }
        loadData();
    }, []);

    const handleFileClick = async (file) => {
        setSelectedFile(file.file_name);
        try {
            const urlValue = `http://localhost:5173/user_uploads/${file.file_name}`;
            // Fetch the file as a Blob
            fetch(urlValue)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.blob();
                })
                .then(blob => {
                    const blobURL = window.URL.createObjectURL(blob);
                    const fileName = file.file_name;
        
                    const anchorTag = document.createElement('a');
                    anchorTag.href = blobURL;
                    anchorTag.download = fileName;
                    document.body.appendChild(anchorTag);
                    anchorTag.click();
                    document.body.removeChild(anchorTag);
                    window.URL.revokeObjectURL(blobURL);
                })
                .catch(error => {
                    console.error("Failed to download file:", error);
                });
    
            setIsModalOpen(true);
        } catch (error) {
            console.error("Failed to download file:", error);
        }
    };
    
    const handleApprove = async (selectedFile) => {
        console.log(selectedFile);
        try {
            const response = await approveFile(selectedFile);
            if (!response) {
                throw new Error('Network response was not ok');
            }
            setToast({
                show: true,
                message: response.detail || 'File approved successfully.',
                type: 'success'
            });
            autoCloseToast();
            window.location.reload();
        } catch (error) {
            setToast({
                show: true,
                message:  'Error approving the file.',
                type: 'error'
            });
            autoCloseToast();
        }
        setIsModalOpen(false);
    };

    const handleReject = async (selectedFile) => {
        console.log(selectedFile)
        try {
            const response = await rejectFile(selectedFile);
            if (!response) {
                throw new Error('Network response was not ok');
            }
            setToast({
                show: true,
                message: response.detail || 'File Removed successfully.',
                type: 'success'
            });
            autoCloseToast();
            window.location.reload();
        } catch (error) {
            setToast({
                show: true,
                message: 'Error Removing the file.',
                type: 'error'
            });
            autoCloseToast();
        }
        setIsModalOpen(false);
    };

    const openConfirmModal = (file) => {
         setSelectedFile(file); // Set the file to be rejected
        setIsDeleteConfirmModalOpen(true); // Open confirmation modal
    };

    const closeConfirmModal = () => {
        setIsDeleteConfirmModalOpen(false); // Close confirmation modal
    };

    const openEditConfirmModal = (file) => {
        setSelectedFile(file); 
        setIsEditConfirmModalOpen(true); // Open confirmation modal
    };

    const closeEditConfirmModal = () => {
        setIsEditConfirmModalOpen(false); // Close confirmation modal
    };

    const columns = React.useMemo(
        () => [
            {
                Header: 'Requested Files',
                accessor: 'file_name',
                Cell: ({ row }) => (
                <span
                    className="cursor-pointer text-blue-500 hover:underline"
                    onClick={() => handleFileClick(row.original)}
                >
                    {row.original.file_name}
                </span>
                ),
            },
            {
                Header: 'User Name',
                Cell: ({ row }) => (
                    <span>
                        {row.original.email}
                    </span>
                ),
            },
            {
                Header: 'Approve',
                Cell: ({ row }) => (
                    <Button
                        className="bg-customGreen hover:bg-customGreen text-white cursor-pointer h-9 w-15 p-0 m-0" // Use custom green
                        // onClick={() => handleApprove(row.original.file_name)}
                        onClick={() => openEditConfirmModal(row.original.file_name)}
                    >
                        Approve
                    </Button>
                ),
            },
            {
                Header: 'Reject',
                Cell: ({ row }) => (
                    <Button
                        className="bg-customRed text-white cursor-pointer hover:bg-customRed h-9 w-15 p-0 m-0"
                         // Use custom red
                        // onClick={() => handleReject(row.original.file_name)}
                        onClick={() => openConfirmModal(row.original.file_name)}
                    >
                        Reject
                    </Button>
                ),
            },
        ],
        []
    );

    const { getTableProps, getTableBodyProps, prepareRow,
        page, canPreviousPage, canNextPage, pageOptions,
        state: { pageIndex, globalFilter }, setGlobalFilter,nextPage, previousPage,
    } = useTable(
        {
            columns,data, initialState: { pageIndex: 0 },
        },
        useGlobalFilter,
        usePagination
    );

    const autoCloseToast = () => {
        setTimeout(() => {
            setToast({ show: false, message: '', type: '' });
        }, 4000); // Auto-close after 10 seconds (10000ms)
    };
    const renderToast = () => {
        if (!toast.show) return null;
        const alertStyle = toast.type === 'success'
            ? 'bg-green-100 text-green-600 border-t-4 border-green-400 shadow-lg'
            : 'bg-red-100 text-red-600 border-t-4 border-red-400 shadow-lg';
        return (
            <div className={`fixed top-5 left-1/2 transform -translate-x-1/2 z-50 flex p-4 rounded-lg ${alertStyle} mt-5 max-w-lg w-full`}
                role="alert" style={{ zIndex: 9999 }} >
                <div className="ml-3 text-sm font-medium">
                    {toast.message}
                </div>
                <button type="button" aria-label="Close"
                    className="ml-auto -mx-1.5 -my-1.5 text-red-600 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex h-8 w-8"
                    onClick={() => setToast({ show: false, message: '', type: '' })}    
                >
                    <span className="sr-only">Close</span>
                    <HiX className="w-5 h-5" />
                </button>
            </div>
        );
    };
    
    return (
        <div className='table-auto w-[50vw] items-center justify-center md:mx-auto p-3 scrollbar
          scrollbar-track-slate-700 scrollbar-thumb-slate-500 mb-10'>
            <div className='flex justify-between mb-4 mt-5 float-end'>
                <SearchBar globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
            </div>
            <div className='justify-centre items-center mb-4'>
                {renderToast()}
            </div>
            <Table hoverable className='shadow-custom-bottom rounded-lg' {...getTableProps()}>
                <Table.Head>
                    <Table.HeadCell className=' bg-gray-700 text-white'>Requested files</Table.HeadCell>
                    <Table.HeadCell className=' bg-gray-700 text-white'>User Name</Table.HeadCell>
                    <Table.HeadCell className=' bg-gray-700 text-white'>Approve</Table.HeadCell>
                    <Table.HeadCell className=' bg-gray-700 text-white'>Reject</Table.HeadCell>
                </Table.Head>
                <Table.Body {...getTableBodyProps()} className="divide-y">
                    {page.map((row) => {
                        prepareRow(row);
                        return (
                        <Table.Row key={row.id} className=" text-white  border-gray-700 bg-gray-800 
                        hover:bg-[rgb(168,224,255,1)] hover:text-black">
                            {row.cells.map((cell) => {
                                const { key, ...cellProps } = cell.getCellProps(); // Destructure to remove the key
                                return (
                                    <Table.Cell key={cell.column.id} {...cellProps}>
                                    {cell.render('Cell')}
                                    </Table.Cell>
                                );
                            })}
                        </Table.Row>
                        );
                    })}
                </Table.Body>
            </Table>
            <div className='flex justify-end items-center mt-4 gap-3 text-white'>
                <Button onClick={() => previousPage()} disabled={!canPreviousPage} 
                    gradientDuoTone="purpleToBlue" outline>
                    Previous
                </Button>
                <span> Page {pageIndex + 1} of {pageOptions.length} </span>
                <Button onClick={() => nextPage()} disabled={!canNextPage}
                 gradientDuoTone="purpleToBlue" outline>
                    Next
                </Button>
            </div>

            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} popup size='md'>
                <Modal.Header />
                <Modal.Body>
                    {selectedFile && (
                        <div className='text-center'>
                            <HiOutlineExclamationCircle className='h-14 w-14  text-black mb-4 mx-auto' />
                            <h3 className='mb-2 text-lg  text-black m-5 mb-8'>{selectedFile}</h3>
                            <div className='flex justify-center gap-4'>
                                <Button className="text-white bg-customGreen
                             to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none
                              focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg
                               text-sm px-2  text-center "
                                 onClick={() =>handleApprove(selectedFile)}>
                                    Approve
                                </Button>
                                <Button class="text-white bg-gradient-to-r from-red-400 via-red-500
                             to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none
                              focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg 
                              text-sm px-3  text-center" onClick={() =>handleReject(selectedFile)}>
                                    Decline
                                </Button>
                            </div>
                        </div>  
                    )}
                </Modal.Body>
            </Modal>
            
            <Modal show={isDeleteConfirmModalOpen} onClose={closeConfirmModal} popup size="lg">
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <h1 className='text-black font-bold text-xl'>Delete File</h1>
                        <h3 className="mb-5 text-lg  text-black m-9 mt-5 font-semibold">
                            Are you sure you want to Reject this user?
                        </h3>
                        <img 
                            src={rejectImage} // Path to the image
                            alt="Reject Icon"
                            className="mx-auto mb-5 h-20 w-20 object-contain" // Adjusting the image size
                        />
                        <div className="flex justify-center gap-4 m-5 mt-5">
                            <Button 
                            class="text-white bg-gradient-to-r from-red-400 via-red-500
                            to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none
                             focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg 
                             text-sm px-4  text-center" 
                             onClick={()=>handleReject(selectedFile)}>
                                Yes, I'm sure
                            </Button>
                            <Button color="gray" onClick={closeConfirmModal}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            <Modal show={isEditConfirmModalOpen} onClose={closeEditConfirmModal} popup size="lg">
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <h1 className='text-black font-bold text-xl'>Approve File</h1>
                        <h3 className="mb-5 text-lg  text-black m-9 mt-5 font-semibold">
                            Are you sure you want to Approve this user?
                        </h3>
                        <img 
                            src={approveImage} // Path to the image
                            alt="Approval Icon"
                            className="mx-auto mb-5 h-20 w-20 object-contain" // Adjusting the image size
                        />


                        <div className="flex justify-center gap-4 m-5">
                            <Button className="text-white bg-customGreen
                             to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none
                              focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg
                               text-sm px-2  text-center "
                             onClick={() => handleApprove(selectedFile)}>
                                Yes, I'm sure
                            </Button>
                            <Button color="gray"
                              onClick={closeEditConfirmModal}>
                                No, Cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}
