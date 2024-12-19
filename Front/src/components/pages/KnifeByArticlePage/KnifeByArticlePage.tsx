import React, { FC, useState, useEffect } from 'react';
import {
   InfoContainer,
   KnifeContainer,
   KnifeName,
   KnifeStatus,
   KnifePrice,
   KnifeArticle,
   KnifeManufacturer,
   KnifeDescription
} from './KnifeByArticlePage.ts';
import {
   PageWrapper,
   PageContainer
} from '../Page.styled.ts';
import "./KnifeByArticlePage.css"
import axios from 'axios';
import { useParams } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'

import { Spinner, Carousel, Button, InputGroup, FormControl } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

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
   const { id } = useParams();

   const [knife, setKnife] = useState<Knife>();
   const [loading, setLoading] = useState(false);

   const fetchKnife = async () => {
      setLoading(true);

      try {
         const response = await axios.get<Knife>(`${apiUrl}/knives_by_article`, {
            params: {
               article: id,
            },
         });

         setKnife(response.data);
      } catch (error) {
         console.error('Error fetching knife:', error);
      } finally {
         setLoading(false);
      }
   };

   const [quantity, setQuantity] = useState(1);

   const handleIncrease = () => {
      setQuantity(quantity + 1);
   };

   const handleDecrease = () => {
      if (quantity > 1) {
         setQuantity(quantity - 1);
      }
   };

   useEffect(() => {
      fetchKnife();
   }, []);

   return (
      <PageWrapper>
         <PageContainer>
            {loading ? (
               <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
                  <Spinner animation="border" style={{ color: "white" }} />
               </div>
            ) : (
               <KnifeContainer>
                  <Carousel
                     style={{
                        width: "500px",
                        margin: "0"
                     }}
                     data-bs-theme="dark"
                  >
                     {knife?.photos.map((photo, index) => (
                        <Carousel.Item key={index}>
                           <img
                              className="d-block"
                              src={photo}
                              alt={`Slide ${index + 1}`}
                              style={{
                                 width: "100%",
                                 maxHeight: "500px",
                                 objectFit: "contain"
                              }}
                           />
                        </Carousel.Item>
                     ))}
                  </Carousel>
                  <InfoContainer style={{ flexDirection: "column", marginLeft: "24px" }}>
                     <KnifeName>{knife?.name}</KnifeName>
                     <InfoContainer style={{ justifyContent: "space-between" }}>
                        <div>
                           <KnifeStatus>
                              {knife?.status ? (
                                 <>
                                    <FontAwesomeIcon icon={faCheck} /> In stock
                                 </>
                              ) : (
                                 <>
                                    <FontAwesomeIcon icon={faXmark} /> Out of stock
                                 </>
                              )}
                           </KnifeStatus>
                           <KnifePrice>{knife?.price} UAH</KnifePrice>
                        </div>
                        <KnifeArticle><span style={{ color: "lightgray" }}>Article:</span> {knife?.article}</KnifeArticle>
                     </InfoContainer>
                     <KnifeManufacturer><span style={{ color: "lightgray" }}>Manufacturer:</span> {knife?.manufacturer}</KnifeManufacturer>
                     <InfoContainer>
                        <InputGroup style={{ width: '110px' }}>
                           <Button variant="outline-secondary" onClick={handleDecrease}>
                              -
                           </Button>
                           <FormControl
                              aria-label="Quantity"
                              value={quantity}
                              readOnly
                              style={{ textAlign: 'center', width: '20px' }}
                           />
                           <Button variant="outline-secondary" onClick={handleIncrease}>
                              +
                           </Button>
                        </InputGroup>
                        <Button
                           variant="success"
                           style={{
                              width: "190px",
                              marginLeft: "24px"
                           }}
                        >
                           <FontAwesomeIcon icon={faCartShopping} /> Buy
                        </Button>
                     </InfoContainer>
                     <KnifeDescription>{knife?.description}</KnifeDescription>
                  </InfoContainer>
               </KnifeContainer>
            )}
         </PageContainer>
      </PageWrapper >
   );
};

export default KnivesPage;