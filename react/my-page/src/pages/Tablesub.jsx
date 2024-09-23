import React, { useState, useEffect } from 'react';
import 'jquery-ui/ui/widgets/sortable';

const Tablesub = ({ setData }) => {
    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:8080/NomAlearn/getListOutput');
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);
    return null; 
};
export default Tablesub;