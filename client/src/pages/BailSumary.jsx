import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const BailSumary = () => {
    const topics = ['Case No', 'Other Cases', 'Ipc Number', 'odbfjnm'];
    const [topic, setTopic] = React.useState(0);


    const data = {
        caseNo: "wfgidfjk",
        otherCases: "wfgidfjk",
        ipcNumber: "wfgidfjk",
        odbfjnm: "wfgidfjk"
    };


    const descriptions = [
        `Case No: ${data.caseNo}`,
        `Other Cases: ${data.otherCases}`,
        `IPC Number: ${data.ipcNumber}`,
        `odbfjnm: ${data.odbfjnm}`
    ];

    return (
        <div className=''>
            <Navbar />
            <div className='text-black h-max p-4'>
                <div className='gap-y-5 w-[60%] h-[400px] border border-black p-4 mx-auto'>
                    <div className='flex flex-row gap-4 justify-items-start'>
                        {
                            topics.map((top, index) => (
                                <button
                                    key={index}
                                    onClick={() => setTopic(index)}
                                    className={`border-0 ${topic === index ? 'text-black border border-black border-b' : 'text-[#808080]'}`}
                                >
                                    {top}
                                </button>
                            ))
                        }
                    </div>
                    <div className='text-lg mt-7'>
                        {descriptions[topic]}
                    </div>
                </div>
            </div>
            <div className='absolute w-full bottom-0'>
            </div>
                <Footer />
        </div>
    );
}

export default BailSumary;
