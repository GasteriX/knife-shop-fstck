import React, { FC, useState, useEffect } from 'react';
import {
   CardWrapper,
   KnifeName,
   KnifeStatus,
   KnifePrice
} from './KnifeCard.styled.ts';
import "./KnifeCard.css";
import { useNavigate } from 'react-router-dom';

import { Button } from "react-bootstrap";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping, faCheck, faXmark, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

import 'bootstrap/dist/css/bootstrap.min.css';

const KnifeCard = ({ knife }) => {
   const navigate = useNavigate();

   const [hovered, setHovered] = useState(false);

   const handleNavigate = () => {
      navigate(`/Knife/${knife?.article}`);
   };

   return (
      <CardWrapper>
         <div
            className="image-container"
            style={{ position: 'relative', width: '100%', maxHeight: '300px' }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={handleNavigate}
         >
            {knife.photos && knife.photos.length > 0 && (
               <img
                  className="d-block"
                  src={knife.photos[0]}
                  alt="Slide 1"
                  style={{
                     width: '100%',
                     maxHeight: '300px',
                     objectFit: 'contain',
                     opacity: hovered ? 0.7 : 1,
                     transition: 'opacity 0.3s',
                  }}
               />
            )}
            <div
               style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  opacity: hovered ? 1 : 0,
                  transition: 'opacity 0.3s',
                  zIndex: 1,
                  height: "248px",
                  borderRadius: "8px",
                  cursor: "pointer"
               }}
            >
               <FontAwesomeIcon icon={faMagnifyingGlass} style={{ color: 'white', fontSize: '2rem' }} />
            </div>
         </div>
         <KnifeName>{knife.name}</KnifeName>
         <KnifeStatus>
            {knife.status ? (
               <>
                  <FontAwesomeIcon icon={faCheck} /> In stock
               </>
            ) : (
               <>
                  <FontAwesomeIcon icon={faXmark} /> Out of stock
               </>
            )}
         </KnifeStatus>
         <KnifePrice>{knife.price} UAH</KnifePrice>
         <Button
            variant="success"
            style={{
               width: "190px"
            }}
            onClick={handleNavigate}
         >
            <FontAwesomeIcon icon={faCartShopping} /> Buy
         </Button>
      </CardWrapper>
   );
};

export default KnifeCard;
