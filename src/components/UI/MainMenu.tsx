
interface MainMenuProps {
    isOpen: boolean
}

export const MainMenu = ({
    isOpen
}: MainMenuProps) => {
  return (
    <div 
        className={`absolute z-20 bg-black/90 duration-500 w-full h-full ${isOpen ? '-left-0':'-left-full'} top-0 -left-full flex justify-center items-center`} >
        <div className="text-center text-white font-bold">
            <h2 className="text-5xl mb-20">MENU</h2>
            <ul className="text-3xl flex flex-col gap-10">
                <li>Friends</li>
                <li>Suggestations</li>
                <li>Invitations</li>
            </ul>
        </div>
    </div>
  )
}
