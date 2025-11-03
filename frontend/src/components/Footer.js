import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const FooterDiv = () => {
  return (
    <>
      <div className='bg-[#E8EAEC] mt-20 px-20 py-16 flex flex-col'>
        {/* Top Section */}
        <div className='flex flex-wrap justify-between gap-10'>

          {/* Logo & Text */}
          <div className='w-96'>
            <h2 className='text-4xl font-bold mb-4 text-[#484848]'>LOGO</h2>
            <p className='text-[#9A9A9A] mb-6'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h3 className='font-bold text-lg mb-4 text-[#484848]'>COMPANY</h3>
            <ul className='space-y-2 text-[#484848]'>
              <li>About Us</li>
              <li>Legal Information</li>
              <li>Contact Us</li>
              <li>Blogs</li>
            </ul>
          </div>

          {/* Help Center */}
          <div>
            <h3 className='font-bold text-lg mb-4 text-[#484848]'>HELP CENTER</h3>
            <ul className='space-y-2 text-[#484848]'>
              <li>Find a Property</li>
              <li>How To Host?</li>
              <li>Why Us?</li>
              <li>FAQs</li>
              <li>Rental Guides</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className='font-bold text-lg mb-4 text-[#484848]'>CONTACT INFO</h3>
            <ul className='space-y-2 text-[#484848]'>
              <li>Phone: 1234567890</li>
              <li>Email: company@email.com</li>
              <li>Location: 100 Smart Street, LA, USA</li>
            </ul>
            <div className='flex gap-4 mt-4 text-[#484848] text-xl'>
              <FaFacebookF />
              <FaTwitter />
              <FaInstagram />
              <FaLinkedinIn />
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className='border-t mt-48 pt-5 flex flex-col md:flex-row justify-between text-[#484848] text-sm'>
          <p>© 2025 Jenish Sakariya | All rights reserved</p>
          <p>Created by <span className='font-semibold'>Jenish Sakariya{/*Add portfolio Link here*/}</span></p>
        </div>
      </div>
    </>
  );
};

export default FooterDiv;
