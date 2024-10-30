import { ChangeEvent, useState } from 'react';
import './SearchBar.css';
import { FaSearch } from "react-icons/fa";


interface Props {
    setUrl: any;
    searchFunction: any;
}


export const SearchBar: React.FC<Props> = ({ setUrl, searchFunction }) => {

    // we store the last key pressed, to avoid spamming requests if user keeps the key ENTER pressed
    // This way, we will only send request if last key pressed was different than ENTER
    const [lastKeyPressed, setLastKeyPressed] = useState<string>("");

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        setUrl(event.target.value);
    }

    // To search when ENTER key is pressed
    function handleKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.code == "Enter" && lastKeyPressed != "Enter") {
            searchFunction();
        }
        setLastKeyPressed(event.code);
    }

    return (
        <div className="searchBarWrapper">
            <FaSearch id="searchButton" onClick={searchFunction} />
            <input onChange={handleChange} onKeyDown={handleKeyPress} placeholder="Enter github repository link" />
        </div>
    );
}