import React, { FC, useState, useEffect } from 'react';
import {
   ButtonsContainer,
   KnivesHeaderContainer,
   KnivesSortContainer
} from './KnivesPage.ts';
import {
   PageWrapper,
   PageContainer
} from '../Page.styled.ts';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowsRotate, faPlus, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'

import { Table, Button, Spinner,  Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import KnifeModal from '../../modals/KnifeModal/KnifeModal.tsx';
import AddKnifeModal from '../../modals/AddKnifeModal/AddKnifeModal.tsx';

import { apiUrl } from '../../config.ts';

interface KnivesPageProps { }

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

const KnivesPage: FC<KnivesPageProps> = () => {
   const [knives, setKnives] = useState<Knife[]>([]);
   const [selectedKnife, setSelectedKnife] = useState(null);

   const [filter, setFilter] = useState("");

   const [loading, setLoading] = useState(false);

   const [showEditModal, setShowEditModal] = useState(false);
   const [showAddModal, setShowAddModal] = useState(false);

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

   const updateKnifeList = () => {
      fetchKnives();
   };

   const handleRowClick = (knife) => {
      setSelectedKnife(knife);
      setShowEditModal(true);
   };

   const handleCloseEditModal = () => {
      setSelectedKnife(null);
      setShowEditModal(false);
   };

   const handleCloseAddModal = () => {
      setShowAddModal(false);
   };

   const handleAddModal = () => {
      setShowAddModal(true);
   };

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilter(e.target.value);
   };

   const sortedAndFilteredKnives = knives
      .filter((knife) => {
         const lowerCaseFilter = filter.toLowerCase();
         return knife.name.toLowerCase().includes(lowerCaseFilter);
      })
      .sort((a, b) => a.name.localeCompare(b.name));

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
               <ButtonsContainer>
                  <Button variant="success" onClick={handleAddModal} style={{ marginRight: "12px" }}><FontAwesomeIcon icon={faPlus} /></Button>
                  <Button variant="dark" onClick={fetchKnives}><FontAwesomeIcon icon={faArrowsRotate} /></Button>
               </ButtonsContainer>
            </KnivesHeaderContainer>
            {loading ? (
               <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
                  <Spinner animation="border" style={{ color: "white" }} />
               </div>
            ) : (
               <Table
                  bordered hover responsive
                  variant="dark"
                  style={{
                     borderColor: 'rgb(23, 25, 27)',
                     width: "1120px"
                  }}
               >
                  <thead>
                     <tr>
                        <th>Name</th>
                        <th>Manufacturer</th>
                        <th>Article</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Description</th>
                     </tr>
                  </thead>
                  <tbody>
                     {sortedAndFilteredKnives.map((knife) => (
                        <tr
                           key={knife.id}
                           onClick={() => handleRowClick(knife)}
                           style={{
                              cursor: 'pointer',
                           }}
                        >
                           <td>{knife.name}</td>
                           <td>{knife.manufacturer}</td>
                           <td>{knife.article}</td>
                           <td>{knife.price}</td>
                           <td style={{ textAlign: 'center' }}>
                              {knife.status ? (
                                 <FontAwesomeIcon icon={faCheck} />
                              ) : (
                                 <FontAwesomeIcon icon={faXmark} />
                              )}
                           </td>
                           <td style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "340px" }}>{knife.description}</td>
                        </tr>
                     ))}
                  </tbody>
               </Table>
            )}
            <KnifeModal
               show={showEditModal}
               handleClose={handleCloseEditModal}
               knife={selectedKnife}
               onKnifeUpdated={updateKnifeList}
            />
            <AddKnifeModal
               show={showAddModal}
               handleClose={handleCloseAddModal}
               onKnifeUpdated={updateKnifeList}
            />
         </PageContainer>
      </PageWrapper >
   );
};

export default KnivesPage;