import { ClassAttributes, ImgHTMLAttributes, useState } from "react";
import './ResultItem.css'
import { IssueObject } from "../../services/fetchIssues";
import { CommentObject, fetchComments } from "../../services/fetchComments";
import Markdown from 'react-markdown';
import ReactMarkdown from "react-markdown";
import { JSX } from "react/jsx-runtime";
import { formatDate, getDateString } from "../../utils";
import { Comments } from "../Comments/Comments";
import { UserInfos } from "../UserInfos/UserInfos";


interface Props {
    issue: IssueObject
}


export const ResultItem: React.FC<Props> = ({ issue }) => {
    const [showComments, setShowComments] = useState<boolean>(false);

    const [comments, setComments] = useState<CommentObject[]>([]);

    // Fetch comments (we already have the endpoint url)
    function getComments() {
        fetchComments(issue.comments_url)
            .then((res) => {
                setComments(res);
            })
    }

    // Show / hide comments depending on the current value of the boolean showComments
    function handleShowClick() {
        if (!showComments) {
            // Only fetching if we do not already have, to avoid useless requests
            if (comments.length == 0) {
                getComments();
            }
            setShowComments(true);

        }
        else {
            setShowComments(false);
        }
    }



    return (
        <div className="singleIssue" key={"issueItem" + issue.id}>
            <UserInfos user={issue.user} />
            <div className="issueInfos">
                <p className="issueTitle">{issue.title} <span className={issue.state}>{issue.state.toUpperCase()}</span></p>
                <p className="issueDetails">Issue #{issue.number} - {getDateString(issue.created_at, issue.updated_at)}</p>

                {/* This components attribute is necessary to force the elements to fit in it's parent div */}
                <Markdown components={{
                    img: ({ node, ...props }) => <img style={{ maxWidth: '100%' }}{...props} />,
                    code: ({ node, ...props }) => <code style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxWidth: '100%' }}{...props} />
                }} className="issueBody" >
                    {issue.body}
                </Markdown>
                <p>👍 {issue.reactions_plus1} 👎 {issue.reactions_minus1} ❤️ {issue.reactions_heart} 🎉 {issue.reactions_hooray} 👀 {issue.reactions_eyes} 😄 {issue.reactions_laugh} 🚀 {issue.reactions_rocket} 😕 {issue.reactions_confused}</p>


                {issue.comments > 0 && !showComments ?
                    <p onClick={handleShowClick} className="commentsCount">Show {issue.comments} comments</p>
                    : <></>
                }

                {showComments ?
                    <>
                        <p onClick={handleShowClick} className="commentsCount">Hide {issue.comments} comments</p>
                        <Comments commentsList={comments} />
                    </>
                    : <></>
                }

            </div>

        </div >
    );
}