import Markdown from "react-markdown";
import { CommentObject } from "../../services/fetchComments";
import { GithubUser, IssueObject } from "../../services/fetchIssues";
import { ResultItem } from "../ResultItem/ResultItem";
import './UserInfos.css';

interface Props {
    user: GithubUser
}


export const UserInfos: React.FC<Props> = ({ user }) => {



    return (
        <div className="userInfos">
            <img className="userAvatar" src={user.avatar_url} />
            <p className="userLogin">{user.login}</p>
        </div>
    );
}