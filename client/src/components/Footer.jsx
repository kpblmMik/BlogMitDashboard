import { Footer } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { BsGithub } from 'react-icons/bs';
import logo from "../images/logo_gross.svg";
import { useSelector } from "react-redux";

export default function FooterCom() {
  const { theme } = useSelector((state) => state.theme);

  return (
    <Footer container className='border-t-2 border-[#9bb0ddd3] rounded-none dark:bg-[#090d1c] bg-[#f7f7fa]'>
      <div className='w-full max-w-7xl mx-auto'>
        <div className='flex justify-between items-center py-5'>
          <Link to="/" className='flex items-center'>
            <img src={logo} alt="Logo" className={`h-11 ${theme === 'dark' ? 'filter invert' : ''}`} />
          </Link>
          <div className='flex items-center gap-4'>
            <span className='text-lg font-semibold'>Lerne uns kennen:</span>
            <Link to='/about' className='text-lg text-blue-500 hover:underline'>
              Über uns
            </Link>
            <a href='https://github.com/Ki-Blog/BlogMitDashboard/' target='_blank' rel='noopener noreferrer'>
              <BsGithub className='text-2xl' />
            </a>
          </div>
        </div>
        <Footer.Divider />
        <div className='w-full flex justify-between items-center py-4'>
          <Footer.Copyright href='#' by="AI Quantum " year={new Date().getFullYear()} />
        </div>
      </div>
    </Footer>
  );
}
