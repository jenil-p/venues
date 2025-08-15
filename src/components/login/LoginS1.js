import React from 'react';
import { FaFacebook, FaApple, FaGoogle } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const LoginS1 = () => {
    return (
        <div className='max-w-md w-[600px]'>
            <h3 className='small-semibold-gray'>Login or Signup</h3>
            <div className='w-full my-10 rounded-xl p-4'>
                <div className="add-contact flex flex-col space-y-4">
                    
                    {/* phone number */}
                    <div className="flex border rounded-full overflow-hidden p-2 mb-4">
                        <select className="px-4 py-2 outline-none border-r text-[#484848] bg-transparent">
                            <option>UAE (+971)</option>
                            <option>India (+91)</option>
                            <option>USA (+1)</option>
                            <option>UK (+44)</option>
                        </select>
                        <input 
                            type="tel" 
                            placeholder="Enter Your Number" 
                            className="flex-1 px-4 py-2 outline-none"
                        />
                    </div>

                    <p className="text-xs text-[#9A9A9A] mb-4">
                        We'll call or text you to confirm your number. Standard message and data rates apply.
                    </p>

                    {/* submit button */}
                    <div className="flex flex-col space-y-3">
                        <button className="bg-[#9A9A9A] text-white rounded-full py-2 font-medium">
                            Continue
                        </button>
                        <button className="flex items-center justify-center gap-2 rounded-full py-2 font-medium text-[#484848]">
                            <MdEmail className="text-lg"/> Continue With Email
                        </button>
                    </div>

                    {/* another - options */}
                    <div className="flex items-center mb-8">
                        <div className="flex-1 h-px bg-[#9A9A9A]"></div>
                        <span className="px-3 text-sm text-[#9A9A9A]">Or Continue With</span>
                        <div className="flex-1 h-px bg-[#9A9A9A]"></div>
                    </div>

                    <div className="flex justify-between">
                        <button className="flex items-center gap-2 bg-[#E8EAEC] rounded-full px-6 py-3 text-md text-[#484848]">
                            <FaFacebook /> Facebook
                        </button>
                        <button className="flex items-center gap-2 bg-[#E8EAEC] rounded-full px-6 py-3 text-md text-[#484848]">
                            <FaApple /> Apple ID
                        </button>
                        <button className="flex items-center gap-2 bg-[#E8EAEC] rounded-full px-6 py-3 text-md text-[#484848]">
                            <FaGoogle /> Google
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginS1;
