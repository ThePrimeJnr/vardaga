import RobotIcon from "../icons/Robot";
import ExpandIcon from "../icons/Expand";
import CloseIcon from "../icons/Close";
import ClearIcon from "../icons/Clear";
import {useLocation, useNavigate} from "react-router-dom";
import ArrowRight from "../icons/ArrowRight";
import MinimizeIcon from "../icons/Minimize";
import { ChatContext } from "./ChatContext";
import { useContext } from "react";
import { getIntentName } from '../utils/intentUtils';

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
    const { setInput, currentIntent, clearChatHistory } = chatContext;

    const handleBack = () => {
        setInput(''); 
        navigate('/', { replace: true }); 
    };

    const handleClear = () => {
        clearChatHistory();
    };

    return <div id={'header'} className={'min-h-16 h-24 bg-accent-900 flex justify-between items-center px-5'}>
        {location.pathname === '/' && <div className={'flex items-center justify-center'}>
            <RobotIcon width={30} height={30} fill={'white'}/>
            <div className={'px-3 text-white text-sm'}>
                <div>Jag heter Svardaga.</div>
                <div>Jag är din personliga AI-Assistent.</div>
            </div>
        </div>}
        {location.pathname === '/chat' && <div className={'flex items-center justify-center'}>
            <ArrowRight width={30} height={30} fill={'white'} className={'rotate-180 hover:cursor-pointer'}
                        onClick={handleBack}/>
            <div className={'px-3 text-white'}>
                <div>{getIntentName(currentIntent)}</div>
            </div>
        </div>}
        <div className={'flex'}>
            {location.pathname === '/chat' && (
                <ClearIcon 
                    width={26} 
                    height={26} 
                    fill={'white'} 
                    className={'mx-2 hover:cursor-pointer hover:scale-110 transition-transform'} 
                    onClick={handleClear}
                />
            )}
            {expanded ? <MinimizeIcon width={26} height={26} fill={'white'} className={"mx-2 hover:cursor-pointer"} onClick={setExpanded}/> :
                <ExpandIcon width={26} height={26} fill={'white'} className={'mx-2 hover:cursor-pointer'} onClick={setExpanded}/>
            }
            <CloseIcon width={26} height={26} fill={'white'} className={'mx-2 hover:cursor-pointer'} onClick={close}/>
        </div>
    </div>
}

export default Header;