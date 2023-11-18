import React, { useState, useEffect } from 'react';
import { useStateContext } from '../context';
import { Loader } from '../components';

function ListOrganizer() {
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("All");
    const [organizers, setOrganizers] = useState([]);

    const { address, contract, getOrganizer, archiveOrganizer, setOrganizerStatus } = useStateContext();

    const fetchOrganizers = async () => {
        setIsLoading(true);
        const data = await getOrganizer(false, false);
        setOrganizers(data);
        setIsLoading(false);
    }

    useEffect(() => {
        if (contract) {
            fetchOrganizers();
        }
    }, [address, contract]);

    function handleTabClick(tabName) {
        setActiveTab(tabName);
    }



    return (
        <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
            {isLoading && <Loader />}
            <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
                <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">Organizer Management</h1>
            </div>
            <br />
            {organizers.length > 0 ? (
                <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                        <Tabs tabs={["All", "Pending", "Approved", "Reject"]} activeTab={activeTab} onTabClick={handleTabClick} />
                        <br />
                        <div className="sm:max-w-[1080px] overflow-x-auto">
                            <table className="w-full table-auto">
                                <thead>
                                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                        <th className="min-w-[180px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                                            Name
                                        </th>
                                        <th className="min-w-[190px] py-4 px-4 font-medium text-black dark:text-white">
                                            Document URL
                                        </th>
                                        <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                                            Status
                                        </th>
                                        <th className="py-4 px-4 font-medium text-black dark:text-white">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <TabContent tabName={activeTab} organizers={organizers} />
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex w-full border-l-6 border-warning bg-warning bg-opacity-[15%] px-7 py-8 shadow-md dark:bg-[#1B1B24] dark:bg-opacity-30 md:p-9">
                    <div className="mr-5 flex h-9 w-9 items-center justify-center rounded-lg bg-warning bg-opacity-30">
                        <svg
                            width="19"
                            height="16"
                            viewBox="0 0 19 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M1.50493 16H17.5023C18.6204 16 19.3413 14.9018 18.8354 13.9735L10.8367 0.770573C10.2852 -0.256858 8.70677 -0.256858 8.15528 0.770573L0.156617 13.9735C-0.334072 14.8998 0.386764 16 1.50493 16ZM10.7585 12.9298C10.7585 13.6155 10.2223 14.1433 9.45583 14.1433C8.6894 14.1433 8.15311 13.6155 8.15311 12.9298V12.9015C8.15311 12.2159 8.6894 11.688 9.45583 11.688C10.2223 11.688 10.7585 12.2159 10.7585 12.9015V12.9298ZM8.75236 4.01062H10.2548C10.6674 4.01062 10.9127 4.33826 10.8671 4.75288L10.2071 10.1186C10.1615 10.5049 9.88572 10.7455 9.50142 10.7455C9.11929 10.7455 8.84138 10.5028 8.79579 10.1186L8.13574 4.75288C8.09449 4.33826 8.33984 4.01062 8.75236 4.01062Z"
                                fill="#FBBF24"
                            ></path>
                        </svg>
                    </div>
                    <div className="w-full">
                        <h5 className="mb-3 text-lg font-semibold text-[#9D5425]">
                            No Organizer Found
                        </h5>
                        <p className="leading-relaxed text-[#D0915C]">
                            Waiting for application...
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

function Tabs({ tabs, activeTab, onTabClick }) {
    return (
        <div className="tabs">
            {tabs.map((tab) => (
                <button
                    key={tab}
                    onClick={() => onTabClick(tab)}
                    className={activeTab === tab ? "active" : ""}
                >
                    <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-strokedark xsm:flex-row">
                        <span className="font-semibold text-black dark:text-white">
                            {tab}
                        </span>
                    </div>
                </button>
            ))}
        </div>
    );
}

function TabContent({ tabName, organizers }) {
    const [isLoading, setIsLoading] = useState(false);
    const { archiveOrganizer, setOrganizerStatus } = useStateContext();


    const filteredOrganizers = organizers.filter((organizer) => {
        if (tabName === "All") {
            return true;
        } else if (tabName === "Pending" && !organizer.isVerified && !organizer.isArchived) {
            return true;
        } else if (tabName === "Approved" && organizer.isVerified && !organizer.isArchived) {
            return true;
        } else if (tabName === "Reject" && organizer.isArchived) {
            return true;
        }
        return false;
    });

    // Define the archive function within the component
    const archive = async (organizerId) => {
        try {
            setIsLoading(true);
            const data = await archiveOrganizer(organizerId);
            setIsLoading(false);
            //console.log("contract call success", data)
        } catch (error) {
            console.log("contract call failure", error);
        }
    }

    const setTrueStatus = async (organizerId) => {
        try {
            console.log("setTrueStatus", organizerId);
            setIsLoading(true);
            const data = await setOrganizerStatus(organizerId, true);
            setIsLoading(false);
            //console.log("contract call success", data)
        } catch (error) {
            console.log("contract call failure", error)
        }
    }



    const fetchImage = async (image) => {
        try {
            console.log("image", image);
            const response = await fetch(image);
            const data = await response.json();
            if (data) {
                //console.log("data", data);
                //setImageURL(data);
                console.log("imageURL", data);
                setImageURL(Object.values(data));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const [imageURL, setImageURL] = useState(null);


    return (
        <tbody>
            {filteredOrganizers.map((organizer) => (
                <tr key={organizer.oId}>
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                        <h5 className="font-medium text-black dark:text-white">
                            {organizer.name}
                        </h5>
                    </td>
                    <td className="py-5 px-4">

                        {fetchImage(organizer.documentUrl) && Array.isArray(imageURL) && imageURL.map((url, index) => (
                            <p className="text-black max-w-[190px] overflow-x-hidden dark:text-white">
                                <a href={url} target="_blank" rel="noopener noreferrer">{index + 1}. {url}</a>
                            </p>
                        ))}

                    </td>
                    <td className="py-5 px-4">
                        {organizer.isVerified === false && organizer.isArchived === false ? (
                            <p className="inline-flex rounded-full bg-warning bg-opacity-10 py-1 px-3 text-sm font-medium text-warning">
                                Pending
                            </p>
                        ) : organizer.isVerified === true && organizer.isArchived === false ? (
                            <p className="inline-flex rounded-full bg-success bg-opacity-10 py-1 px-3 text-sm font-medium text-warning">
                                Verified
                            </p>
                        ) : organizer.isArchived === true ? (
                            <p className="inline-flex rounded-full bg-danger bg-opacity-10 py-1 px-3 text-sm font-medium text-warning">
                                Rejected
                            </p>
                        ) : null}
                    </td>
                    <td className="py-5 px-4">
                        <div className="flex items-center space-x-3.5">
                            {/* <button className="hover:text-primary">
                                <svg
                                    className="fill-current"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 18 18"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z"
                                        fill=""
                                    />
                                    <path
                                        d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z"
                                        fill=""
                                    />
                                </svg>
                            </button> */}
                            <button onClick={
                                // call archive function to set this row organzerId to true
                                () => archive(organizer.oId)
                            } className="hover:text-primary">
                                <svg
                                    className="fill-current"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 18 18"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                                        fill=""
                                    />
                                    <path
                                        d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                                        fill=""
                                    />
                                    <path
                                        d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                                        fill=""
                                    />
                                    <path
                                        d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                                        fill=""
                                    />
                                </svg>
                            </button>
                            <button onClick={
                                () => setTrueStatus(organizer.oId)
                            }
                                className="hover:text-primary">
                                <svg
                                    className="fill-current"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 18 18"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M16.8754 11.6719C16.5379 11.6719 16.2285 11.9531 16.2285 12.3187V14.8219C16.2285 15.075 16.0316 15.2719 15.7785 15.2719H2.22227C1.96914 15.2719 1.77227 15.075 1.77227 14.8219V12.3187C1.77227 11.9812 1.49102 11.6719 1.12539 11.6719C0.759766 11.6719 0.478516 11.9531 0.478516 12.3187V14.8219C0.478516 15.7781 1.23789 16.5375 2.19414 16.5375H15.7785C16.7348 16.5375 17.4941 15.7781 17.4941 14.8219V12.3187C17.5223 11.9531 17.2129 11.6719 16.8754 11.6719Z"
                                        fill=""
                                    />
                                    <path
                                        d="M8.55074 12.3469C8.66324 12.4594 8.83199 12.5156 9.00074 12.5156C9.16949 12.5156 9.31012 12.4594 9.45074 12.3469L13.4726 8.43752C13.7257 8.1844 13.7257 7.79065 13.5007 7.53752C13.2476 7.2844 12.8539 7.2844 12.6007 7.5094L9.64762 10.4063V2.1094C9.64762 1.7719 9.36637 1.46252 9.00074 1.46252C8.66324 1.46252 8.35387 1.74377 8.35387 2.1094V10.4063L5.40074 7.53752C5.14762 7.2844 4.75387 7.31252 4.50074 7.53752C4.24762 7.79065 4.27574 8.1844 4.50074 8.43752L8.55074 12.3469Z"
                                        fill=""
                                    />
                                </svg>
                            </button>
                        </div>
                    </td>
                </tr>
            ))
            }
        </tbody >
    );
}

export default ListOrganizer;