import React from 'react'
import { footerLinks } from '../constants'

const Footer = () => {
  return (
    <footer className="py-5 sm:px-10 px-5 bg-black">
      <div className="screen-max-width">
        <div>
          <p className="font-semibold text-gray-400 text-xs">
            More ways to shop:{' '}
            <span className="underline text-blue-400 hover:cursor-pointer hover:text-blue">Find an Apple Store</span> or{' '}
            <span className="underline text-blue-400 hover:cursor-pointer hover:text-blue">other retailer</span> near you.
          </p>
          <p className="font-semibold text-gray-400 text-xs">
            Or call 000800-040-1966
          </p>
          <div className="text-gray-500 text-xs mt-2">Made by Suhas 🫶</div>
        </div>

        <div className="bg-neutral-700 my-5 h-[1px] w-full" />

        <div className="flex md:flex-row flex-col md:items-center justify-between gap-2">
          <p className="font-semibold text-gray-400 text-xs">
            © 2024 Apple Inc. All rights reserved.
          </p>
          <div className="flex flex-wrap hover:cursor-pointer">
            {footerLinks.map((link, i) => (
              <p key={link} className="font-semibold text-gray-400 text-xs hover:text-blue">
                {link}
                {i !== footerLinks.length - 1 && <span className="mx-2">|</span>}
              </p>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
