import { useState } from "react";

const usePagination = (data, defaultItemsPerPage = 1000) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage ] = useState(defaultItemsPerPage)

    const maxPage = data ? Math.ceil(data.length / itemsPerPage) : 0;

    const currentData = data.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const next = () => {
        setCurrentPage((currentPage) => Math.min(currentPage + 1, maxPage));
    };
    const prev = () => {
        setCurrentPage((currentPage) => Math.max(currentPage - 1, 1));
    };
    const jump = (page) => {
        const pageNumber = Math.max(1, page);
        setCurrentPage((currentPage) => Math.min(pageNumber, maxPage));
    };

    return { data: currentData, itemsPerPage, setItemsPerPage, nextPage: next, prevPage: prev, jumpToPage: jump, page: currentPage, setPage: setCurrentPage, maxPage };
}

export default usePagination;