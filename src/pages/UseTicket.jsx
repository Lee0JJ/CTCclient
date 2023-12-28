import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';

import { useStateContext } from '../context';
import { CountBox, CustomButton, Loader } from '../components';
import { directoryToJSON, calculateBarPercentage, daysLeft, calTotalAvailableTickets, calLowestTicketPrice } from '../utils';
import { thirdweb } from '../assets';

import { Html5QrcodeScanner } from 'html5-qrcode';

const UseTicket = () => {
    const navigate = useNavigate();
    const { address, contract, useTicket, getUserCampaigns } = useStateContext();

    const [isLoading, setIsLoading] = useState(false);
    const [amount, setAmount] = useState('');

    const [uniqueId, setUniqueId] = useState('');
    const [ticket, setTicket] = useState([]);
    const [userConcert, setUserConcert] = useState();

    const [scanResult, setScanResult] = useState(null);

    const fetchConcert = async () => {
        setIsLoading(true);
        const data = await getUserCampaigns();
        setUserConcert(data);
        setIsLoading(false);
    }

    useEffect(() => {
        if (contract) {
            fetchConcert();
        }
    }, [contract, address]);


    const handleDonate = async () => {
        setIsLoading(true);

        await donate(state.pId, amount);

        navigate('/')
        setIsLoading(false);
    }

    const handleUsing = async (ticket) => {
        setIsLoading(true);
        try {
            const availableTickets = ticket.filter(t => !t.used);
            console.log("User Concert", userConcert.some(concert => concert.concertId === ticket.concertId));
            console.log("Available Tickets", availableTickets.length);

            if (availableTickets.length !== 0 && Boolean(userConcert.some(concert => concert.concertId === ticket.concertId))) {
                const ticketIds = availableTickets.map(t => t.ticketId);
                console.log(ticket[0].owner, ticketIds);
                console.log("User Concert", userConcert.some(concert => concert.concertId === ticket.concertId));
                await useTicket(ticket[0].owner, ticketIds);
                window.location.reload();
            } else {
                alert("Error occurred, might be\n1. All tickets are used\n2. Invalid QR code\n3. Invalid Client Account Please try again");
            }
        } catch (error) {
            alert(error.message);
        }
        // navigate('/')
        setIsLoading(false);
    }

    useEffect(() => {
        const scanner = new Html5QrcodeScanner("reader",
            { fps: 1, qrbox: 250 });

        scanner.render(onScanSuccess, error);

        function onScanSuccess(qrCodeMessage) {
            try {
                setScanResult(JSON.parse(qrCodeMessage));
                console.log(qrCodeMessage);
            } catch (error) {
                //console.error("Error parsing QR code message:", error);
            }
        }

        function error(errorMessage) {
            //console.error("QR Code not detected:", errorMessage);
        }

    }, []);

    return (
        <div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px] ">
            {isLoading && <Loader />}
            <p className="font-epilogue fount-medium text-[20px] leading-[30px] text-center text-[#808191]">
                QR TICKET SCANNER
            </p>
            <div className="mt-[30px]">
                <div className="flex justify-center items-center h-full text-center">
                    <div id="reader" style={{
                        width: '100%',
                        maxWidth: "500px",
                        alignSelf: "center",
                        color: "white"
                    }}></div>

                </div>

                {scanResult ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="my-[20px] p-4 bg-[#13131a] rounded-[10px]">
                            <h4 className="font-epilogue font-semibold text-[14px] leading-[22px] text-white">Make sure everything is correct !</h4>
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-white">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ticket
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Concert ID
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Owner
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Used
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {scanResult.map((item, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {item.ticketId}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            Time Purchased : {"\n"} {new Date(item.time * 1000).toLocaleString()}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{item.concertId}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{item.owner}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100${item.used ? 'bg-red-300 text-red-800' : 'bg-green-300 text-green-800'}`}>
                                                    {JSON.stringify(item.used)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {/* Add more rows here */}
                                </tbody>
                            </table>
                            <p className="mt-[20px] font-epilogue font-normal leading-[22px] text-[#808191]">Used ticket will not be use again</p>

                            <div className="flex justify-center items-center h-full text-center">
                                <CustomButton
                                    btnType="button"
                                    title="Confirm Use Ticket"
                                    styles="bg-[#8c6dfd] margin-top-[20px]"
                                    handleClick={() => handleUsing(scanResult)}
                                />
                            </div>
                        </div>

                    </div>
                ) : (
                    <div className="flex justify-center items-center h-full text-center">
                        <p className="mt-[20px] font-epilogue font-normal leading-[22px] text-[#808191]">Waiting for QR Code</p>
                    </div>
                )}





                {/* <input
                    type="number"
                    placeholder="Ticket Price"
                    step="0.01"
                    className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                /> */}



                {/* <input
                    type="number"
                    placeholder="Ticket Amount"
                    step="0.01"
                    className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                /> */}

                {/* <div className="my-[20px] p-4 bg-[#13131a] rounded-[10px]">
                    <h4 className="font-epilogue font-semibold text-[14px] leading-[22px] text-white">Back it because you believe in it.</h4>
                    <p className="mt-[20px] font-epilogue font-normal leading-[22px] text-[#808191]">Support the project for no reward, just because it speaks to you.</p>
                </div> */}

                {/* <CustomButton
                    btnType="button"
                    title="Fund Campaign"
                    styles="w-full bg-[#8c6dfd]"
                    handleClick={handleDonate}
                /> */}

            </div>
        </div>
    )
}

export default UseTicket