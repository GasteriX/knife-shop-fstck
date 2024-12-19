import React, { FC, useState, useEffect } from 'react';
import {
   KnivesHeaderContainer,
   KnivesSortContainer
} from './MainPage.ts';
import {
   PageWrapper,
   PageContainer
} from '../Page.styled.ts';
import './MainPage.css';
import axios from 'axios';

import { Spinner, Form, Pagination } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import KnifeCard from "../../elements/KnifeCard/KnifeCard.tsx";

import { apiUrl } from '../../config.ts';

interface MainPageProps { }

type Knife = {
   id: number;
   name: string;
   manufacturer: string;
   article: string;
   photos: string[];
   price: number;
   status: boolean;
   description: string;
};

const MainPage: FC<MainPageProps> = () => {
   const [knives, setKnives] = useState<Knife[]>([]);
   const [filter, setFilter] = useState("");

   const [loading, setLoading] = useState(false);

   const fetchKnives = async () => {
      setLoading(true);

      try {
         const token = localStorage.getItem("token");
         const response = await axios.get<Knife[]>(`${apiUrl}/all_knives/`, {
            headers: {
               "Authorization": `Bearer ${token}`
            }
         });

         setKnives(response.data);
      } catch (error) {
         console.error('Error fetching knives:', error);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchKnives();
   }, []);

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilter(e.target.value);
   };

   const sortedAndFilteredKnives = knives
      .filter((knife) => {
         const lowerCaseFilter = filter.toLowerCase();
         return knife.name.toLowerCase().includes(lowerCaseFilter);
      })

   const [currentPage, setCurrentPage] = useState<number>(1);

   const indexOfLastKnife = currentPage * 12;
   const indexOfFirstKnife = indexOfLastKnife - 12;
   const currentKnives = sortedAndFilteredKnives.slice(indexOfFirstKnife, indexOfLastKnife);

   const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

   const pageNumbers: number[] = [];
   for (let i = 1; i <= Math.ceil(sortedAndFilteredKnives.length / 12); i++) {
      pageNumbers.push(i);
   }

   return (
      <PageWrapper>
         <PageContainer>
            <KnivesHeaderContainer>
               <KnivesSortContainer>
                  <Form.Group>
                     <Form.Control
                        type="text"
                        placeholder="Search..."
                        value={filter}
                        onChange={handleInputChange}
                        style={{ maxWidth: '300px' }}
                     />
                  </Form.Group>
               </KnivesSortContainer>
            </KnivesHeaderContainer>
            {loading ? (
               <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
                  <Spinner animation="border" style={{ color: "white" }} />
               </div>
            ) : (
               <div>
                  <div className="row">
                     {currentKnives.map((knife) => (
                        <div className="col-3" key={knife.id}>
                           <KnifeCard knife={knife} />
                        </div>
                     ))}
                  </div>

                  <div className="d-flex justify-content-center">
                     <Pagination>
                        {currentPage > 1 && (
                           <Pagination.Prev onClick={() => paginate(currentPage - 1)} />
                        )}

                        {pageNumbers.map((number) => (
                           <Pagination.Item
                              key={number}
                              active={currentPage === number}
                              onClick={() => paginate(number)}
                           >
                              {number}
                           </Pagination.Item>
                        ))}

                        {currentPage < pageNumbers.length && (
                           <Pagination.Next onClick={() => paginate(currentPage + 1)} />
                        )}
                     </Pagination>
                  </div>
               </div>
            )}
         </PageContainer>
      </PageWrapper >
   );
};

export default MainPage;