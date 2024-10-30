import Markdown from "react-markdown";
import { CommentObject } from "../../services/fetchComments";
import { IssueObject } from "../../services/fetchIssues";
import { ResultItem } from "../ResultItem/ResultItem";
import { UserInfos } from "../UserInfos/UserInfos";

import './SingleComment.css';
import { getDateString } from "../../utils";

interface Props {
    comment: CommentObject
}


export const SingleComment: React.FC<Props> = ({ comment }) => {



    return (
        <div className="singleComment">
            <UserInfos user={comment.user} />
            <div className="commentInfos">
                <p>{getDateString(comment.created_at, comment.updated_at)}</p>

                {/* The markdown components renders markdown raw text into our page. */}
                <Markdown components={{
                    img: ({ node, ...props }) => <img style={{ maxWidth: '100%' }}{...props} />,
                    code: ({ node, ...props }) => <code style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxWidth: '100%' }}{...props} />
                }}
                    className="commentBody">
                    {comment.body}
                </Markdown>
                <p>👍 {comment.reactions_plus1} 👎 {comment.reactions_minus1} ❤️ {comment.reactions_heart} 🎉 {comment.reactions_hooray} 👀 {comment.reactions_eyes} 😄 {comment.reactions_laugh} 🚀 {comment.reactions_rocket} 😕 {comment.reactions_confused}</p>

            </div>


        </div>
    );
}