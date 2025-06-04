import { appleImg, bagImg, searchImg} from "../utils"
import { navLists } from "../constants"


const Navbar = () => {
  return (
    <header className="w-full py-5 sm:px-10 px-5 flex justify-between items-center">
        <nav className="flex w-full screen-max-width">
            <img src = {appleImg} alt="apple" width={20} className="cursor-pointer"/>
            <div className="flex flex-1 justify-center max-sm:hidden">
              {navLists.map((items) => (
                <div key={items} className="px-5 text-sm cursor-pointer text-gray hover:text-white">
                  {items}
                </div>
              ))}
            </div>
            <div className="flex items-baseline gap-7 max-sm:justify-end max-sm:flex-1 cursor-pointer">
              <img src={searchImg} alt="searchimg" width={20} height ={20}/>
              <img src={bagImg} alt="bagimg" width = {20} height={20} />
            </div>
        </nav>
    </header>
  )
}

export default Navbar
