import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';

import axios from 'axios';

import './../Modal.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faPlus, faEraser, faTrash, faCheck } from '@fortawesome/free-solid-svg-icons';

import { apiUrl } from '../../config.ts';

type FormData = {
   name: string;
   manufacturer: string;
   article: string;
   photos: string[] | null;
   price: number;
   status: boolean;
   description: string;
};

const AddKnifeModal = ({ show, handleClose, onKnifeUpdated }) => {
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);

   const [status, setStatus] = useState(Boolean);
   const [formData, setFormData] = useState<FormData>({
      name: "",
      manufacturer: "",
      article: "",
      photos: null,
      price: 0,
      status: false,
      description: ""
   });

   useEffect(() => {
      if (!show) {
         handleClear();
      }
   }, [show]);

   const handleClear = () => {
      setFormData({
         name: "",
         manufacturer: "",
         article: "",
         photos: null,
         price: 0,
         status: false,
         description: ""
      });
      setError(null);
   };

   const handleConfirm = async () => {
      setLoading(true);

      try {
         const data = {
            name: formData.name,
            manufacturer: formData.manufacturer,
            article: formData.article,
            photos: formData.photos,
            price: formData.price,
            status: formData.status,
            description: formData.description
         };

         const params = new URLSearchParams();
         params.append('name', data.name);
         params.append('manufacturer', data.manufacturer);
         params.append('article', data.article);
         params.append('price', data.price.toString());
         params.append('status', data.status.toString());
         params.append('description', data.description);
         data.photos?.forEach((photo) => {
            if (photo) {
               params.append(`photos`, photo);
            }
         });

         const response = await axios.post(`${apiUrl}/add_knife`, params, {
            headers: {
               'Content-Type': 'application/x-www-form-urlencoded',
            },
         });

         if (onKnifeUpdated) {
            onKnifeUpdated(response.data);
         }

         handleClear();
         handleClose();
      } catch (error) {
         console.error("Error adding knife:", error);
      } finally {
         setLoading(false);
      }
   };

   const handleInputChange = (e) => {
      const { name, value } = e.target;

      if (name === "author" && /\d/.test(value)) {
         return;
      }

      if (name === "year" && value !== "" && !/^\d*$/.test(value)) {
         return;
      }

      if (name === "year" && value.length > 4) {
         return;
      }

      if (name === "genre" && /\d/.test(value)) {
         return;
      }

      setFormData((prev) => ({
         ...prev,
         [name]: value.trimStart(),
      }));
   };

   const handleStatusChange = () => {
      setStatus(!status);
   };

   const handleAddPhoto = () => {
      setFormData((prevFormData) => ({
         ...prevFormData,
         photos: prevFormData.photos ? [...prevFormData.photos, ""] : [""],
      }));
   };

   const handleRemovePhoto = (index: number) => {
      setFormData((prevFormData) => ({
         ...prevFormData,
         photos: prevFormData.photos?.filter((_, i) => i !== index) || null,
      }));
   };

   const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
      const { value } = e.target;

      setFormData((prevFormData) => {
         const updatedPhotos = prevFormData.photos ? [...prevFormData.photos] : [];
         updatedPhotos[index] = value;
         return {
            ...prevFormData,
            photos: updatedPhotos,
         };
      });
   };

   return (
      <Modal
         show={show} onHide={handleClose} centered size="lg" backdrop="static"
         style={{
            backgroundColor: "rgba(33, 37, 41, 0.525)"
         }}
      >
         <Modal.Header
            closeButton
            className='Dark'
            style={{
               borderBottom: "2px rgb(23, 25, 27) solid",
               justifyContent: "space-between"
            }}
         >
            <Modal.Title>Add knife</Modal.Title>
            <FontAwesomeIcon
               icon={faXmark}
               onClick={handleClose}
               style={{
                  cursor: "pointer",
                  fontSize: "160%"
               }}
            />
         </Modal.Header>
         <Modal.Body className='Dark'>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form>
               <Form.Group className="mb-3 d-flex">
                  <Form.Label className="me-2">Name:</Form.Label>
                  <Form.Control
                     type="text"
                     name="name"
                     value={formData.name}
                     onChange={handleInputChange}
                     placeholder="Enter name"
                  />
               </Form.Group>
               <Form.Group className="mb-3 d-flex">
                  <Form.Label className="me-2">Manufacturer:</Form.Label>
                  <Form.Control
                     type="text"
                     name="manufacturer"
                     value={formData.manufacturer}
                     onChange={handleInputChange}
                     placeholder="Enter manufacturer"
                  />
               </Form.Group>
               <Form.Group className="mb-3 d-flex">
                  <Form.Label className="me-2">Article:</Form.Label>
                  <Form.Control
                     type="text"
                     name="article"
                     value={formData.article}
                     onChange={handleInputChange}
                     placeholder="Enter article"
                  />
               </Form.Group>
               <Form.Group className="mb-3">
                  <Form.Label>Photos:</Form.Label>
                  {(formData.photos || []).map((photo, index) => (
                     <div key={index} className="d-flex align-items-center mb-2" style={{ marginTop: "8px" }}>
                        <Form.Control
                           type="text"
                           value={photo}
                           onChange={(e) => handlePhotoChange(e, index)}
                           placeholder={`Enter photo URL ${index + 1}`}
                           style={{ marginRight: '10px' }}
                        />
                        <Button variant="danger" onClick={() => handleRemovePhoto(index)}>
                           <FontAwesomeIcon icon={faTrash} />
                        </Button>
                     </div>
                  ))}
                  {(!formData.photos || formData.photos.length < 3) && (
                     <Button variant="dark" onClick={handleAddPhoto}>
                        <FontAwesomeIcon icon={faPlus} />
                     </Button>
                  )}
               </Form.Group>
               <Form.Group className="mb-3 d-flex">
                  <Form.Label className="me-2">Price:</Form.Label>
                  <Form.Control
                     type="text"
                     name="price"
                     value={formData.price}
                     onChange={handleInputChange}
                     placeholder="Enter price"
                  />
               </Form.Group>
               <Form.Group className="mb-3 d-flex">
                  <Form.Label className="me-2">Status:</Form.Label>
                  <Button
                     variant={status ? "success" : "danger"}
                     onClick={handleStatusChange}
                  >
                     {status ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faXmark} />}
                  </Button>
               </Form.Group>
               <Form.Group className="mb-3 d-flex">
                  <Form.Label className="me-2">Description:</Form.Label>
                  <Form.Control
                     type="text"
                     name="description"
                     value={formData.description}
                     onChange={handleInputChange}
                     placeholder="Enter description"
                  />
               </Form.Group>
            </Form>
         </Modal.Body>
         <Modal.Footer
            className='Dark'
            style={{
               borderTop: "2px rgb(23, 25, 27) solid"
            }}
         >
            <Button
               variant="success"
               style={{ marginRight: "8px" }}
               onClick={handleConfirm}
            >
               {loading ? <Spinner animation="border" style={{ width: '18px', height: '18px' }} /> : <><FontAwesomeIcon icon={faPlus} /> Add</>}
            </Button>
            <Button variant="dark" onClick={handleClear}><FontAwesomeIcon icon={faEraser} /></Button>
         </Modal.Footer>
      </Modal>
   );
};

export default AddKnifeModal;
