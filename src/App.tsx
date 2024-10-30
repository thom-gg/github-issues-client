import React, { useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { SearchBar } from './components/SearchBar/SearchBar';
import { fetchIssues, IssueObject } from './services/fetchIssues';
import { ResultsComponent } from './components/ResultsComponent/ResultsComponent';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

function App() {

  const [page, setPage] = useState<number>(1);
  const [url, setUrl] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [issueList, setIssueList] = useState<IssueObject[]>([]);
  const [pageMax, setPageMax] = useState<number>(1);

  function search() {
    // Scroll back to top (useful for when navigating between pages)
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }
    fetchIssues(url, page).then((res) => {
      setIssueList(res.issueList);
      setPageMax(res.totalPages);
      setErrorMessage("");


    })
      .catch(error => {
        setErrorMessage(error.message)
      });



  }

  function changePage(newPage: number) {
    if (newPage <= 0 || newPage > pageMax) {
      return;
    }
    // In this function, we simply change the value of the state variable page, and the useEffect below will
    // execute it's code on the variable modification, and will call the function search
    setPage(newPage);
  }

  useEffect(() => {
    if (url == "") {
      // To avoid doing anything on mount
      return;
    }
    search()
  }, [page])

  // This array pageIndexes, computed in the useEffect below, stores which indexes to show at the bottom of the site
  const [pageIndexes, setPageIndexes] = useState<number[]>([]);
  useEffect(() => {
    let res = [];
    if (pageMax <= 5) {
      // If the number of page is small, we display all indexes
      for (let i = 1; i <= pageMax; i++) {
        res.push(i);
      }
      setPageIndexes(res);
    }
    else {
      res.push(1);
      if (page <= 2) {
        // If current page is at the beginning, we only display beginning and end of indexes
        res.push(2);
        res.push(3);
        res.push(-1); // Will be replaced with "..." to symbolize more pages
        res.push(pageMax);
      }
      else if (page >= (pageMax - 1)) {
        // If current page is at the end, we only display beginning and end of indexes
        res.push(2);
        res.push(-1);
        res.push(pageMax - 2);
        res.push(pageMax - 1);
        res.push(pageMax);

      }
      else {
        // If current page is neither at the end nor at the beginning, we display beginning, currentPage, and end of indexes
        res.push(-1);
        res.push(page);
        res.push(-1);
        res.push(pageMax);
      }
      setPageIndexes(res);
    }
  }, [page, pageMax]);

  const topRef = useRef<HTMLDivElement>(null);

  return (
    <div className="App">
      <h1>GitHub issues of a given repository</h1>
      <p>Enter a link of GitHub repository ({"https://github.com/<owner>/<repo>/..."}), then press enter or click the icon</p>
      <div ref={topRef} className='searchBarContainer'>
        <SearchBar setUrl={setUrl} searchFunction={search} />
      </div>
      <p className="errorMessage">{errorMessage}</p>
      <ResultsComponent issueList={issueList} />
      {/* Ternary condition so we don't display the page indexes before loading data */}
      {issueList.length > 0 ?
        <div className="pageManagement">
          <FaAngleLeft className="pageButton" onClick={() => changePage(page - 1)} />
          {pageIndexes.map((i, index) =>
            <span onClick={() => changePage(i)} className={`pageIndexButton ${i == page ? 'currentPage' : ''}`} key={"index" + i + index}>
              {i == -1 ? '..' : i}
            </span>
          )}
          <FaAngleRight className="pageButton" onClick={() => changePage(page + 1)} />
        </div>
        : <></>}
    </div>
  );
}

export default App;
