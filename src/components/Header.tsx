import RobotIcon from "../icons/Robot";
import ExpandIcon from "../icons/Expand";
import CloseIcon from "../icons/Close";
import {useLocation, useNavigate} from "react-router-dom";
import ArrowRight from "../icons/ArrowRight";
import MinimizeIcon from "../icons/Minimize";
import { ChatContext } from "./ChatContext";
import { useContext } from "react";

type HeaderProps = {
    expanded: boolean,
    setExpanded: () => void,
    close: () => void,
}

function Header(
    {
        expanded,
        setExpanded,
        close
    }: HeaderProps,
) {

    const location = useLocation();
    const navigate = useNavigate();
    const chatContext = useContext(ChatContext);
    const { setInput } = chatContext;

    const handleBack = () => {
        setInput(''); 
        navigate('/', { replace: true }); 
    };

    return <div id={'header'} className={'min-h-16 h-16 bg-accent-900 flex justify-between items-center px-5'}>
        {location.pathname === '/' && <div className={'flex items-center justify-center'}>
            <RobotIcon width={30} height={30} fill={'white'}/>
            <div className={'px-3 text-white'}>
                <div>My name is Svardaga</div>
                <div>I am your personal AI-assitant</div>
            </div>
        </div>}
        {location.pathname === '/chat' && <div className={'flex items-center justify-center'}>
            <ArrowRight width={30} height={30} fill={'white'} className={'rotate-180 hover:cursor-pointer'}
                        onClick={handleBack}/>
            <div className={'px-3 text-white'}>
                <div>Back</div>
            </div>
        </div>}
        <div className={'flex'}>
            {expanded ? <MinimizeIcon width={26} height={26} fill={'white'} className={"mx-2 hover:cursor-pointer"} onClick={setExpanded}/> :
                <ExpandIcon width={26} height={26} fill={'white'} className={'mx-2 hover:cursor-pointer'} onClick={setExpanded}/>
            }
            <CloseIcon width={26} height={26} fill={'white'} className={'mx-2 hover:cursor-pointer'} onClick={close}/>
        </div>
    </div>
}

export default Header;