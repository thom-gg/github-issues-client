import { IssueObject } from "../../services/fetchIssues";
import { ResultItem } from "../ResultItem/ResultItem";
import './ResultsComponent.css'

interface Props {
    issueList: IssueObject[]
}


export const ResultsComponent: React.FC<Props> = ({ issueList }) => {



    return (
        <div className="resultsContainer">
            {issueList.map((issue) =>
                <ResultItem key={"resultItem" + issue.id} issue={issue} />
            )}
        </div>
    );
}