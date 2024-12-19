import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner, Carousel } from "react-bootstrap";
import axios from "axios";

import "./../Modal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faXmark,
  faPenToSquare,
  faTrash,
  faPlus
} from "@fortawesome/free-solid-svg-icons";

import { apiUrl } from "../../config.ts";

type FormData = {
  name: string;
  manufacturer: string;
  article: string;
  photos: string[] | null;
  price: number;
  status: boolean;
  description: string;
};

const KnifeModal = ({ show, handleClose, knife, onKnifeUpdated }) => {
  const [loading, setLoading] = useState(false);
  const [currentState, setCurrentState] = useState("default");

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
    if (show && knife) {
      setFormData({
        name: knife.name,
        manufacturer: knife.manufacturer,
        article: knife.article,
        photos: knife.photos,
        price: knife.photo,
        status: knife.status,
        description: knife.description
      });
    }
  }, [show, knife]);

  if (!knife) return null;

  const handleEdit = () => {
    setCurrentState("edit");
  };

  const handleDelete = () => {
    setCurrentState("delete");
  };

  const handleCancel = () => {
    setCurrentState("default");
  };

  const handleConfirm = async () => {
    setLoading(true);

    const token = localStorage.getItem("token");
    try {
      if (currentState === "edit") {
        const data = {
          name: formData.name,
          manufacturer: formData.manufacturer,
          article: formData.article,
          photos: formData.photos,
          price: formData.price,
          status: formData.status,
          description: formData.description
        };

        await axios.put(`${apiUrl}/edit_knife/${knife.id}`, data, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        });

        onKnifeUpdated();
        handleClose();
      } else if (currentState === "delete") {
        await axios.delete(`${apiUrl}/delete_knife/${knife.id}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        onKnifeUpdated();
        handleClose();
      }
    } catch (error) {
      console.error(`Error ${currentState === "edit" ? "updating" : "deleting"} knife:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
      show={show}
      onHide={handleClose}
      centered
      size="lg"
      backdrop="static"
      style={{
        backgroundColor: "rgba(33, 37, 41, 0.525)",
      }}
    >
      <Modal.Header
        closeButton
        className="Dark"
        style={{
          borderBottom: "2px rgb(23, 25, 27) solid",
          justifyContent: "space-between",
        }}
      >
        <Modal.Title>Knife details</Modal.Title>
        <FontAwesomeIcon
          icon={faXmark}
          onClick={handleClose}
          style={{
            cursor: "pointer",
            fontSize: "160%",
          }}
        />
      </Modal.Header>
      {currentState === "edit" ? (
        <Modal.Body className="Dark">
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
      ) : (
        <Modal.Body className="Dark">
          <h5 style={{ marginBottom: "18px" }}>Name: {knife?.name}</h5>
          <p>
            <strong>Manufacturer:</strong> {knife?.manufacturer}
          </p>
          <p>
            <strong>Article:</strong> {knife?.article}
          </p>
          <p style={{ marginBottom: "8px" }}>
            <strong>Photos:</strong>
          </p>
          <Carousel
            style={{
              maxWidth: "300px",
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
                    maxHeight: "300px",
                    objectFit: "contain"
                  }}
                />
              </Carousel.Item>
            ))}
          </Carousel>
          <p>
            <strong>Price:</strong> {knife?.price}
          </p>
          <p><strong style={{ marginRight: "8px" }}>Status:</strong>
            {knife?.status ? (
              <FontAwesomeIcon icon={faCheck} />
            ) : (
              <FontAwesomeIcon icon={faXmark} />
            )}
          </p>
          <p>
            <strong>Description:</strong> {knife?.description}
          </p>
        </Modal.Body>
      )}
      <Modal.Footer
        className="Dark"
        style={{
          borderTop: "2px rgb(23, 25, 27) solid",
          justifyContent: "space-between",
        }}
      >
        <span>
          {currentState === "delete"
            ? "Deleting..."
            : currentState === "edit"
              ? "Editing..."
              : ""}
        </span>
        {currentState === "default" ? (
          <div>
            <Button
              variant="dark"
              onClick={handleEdit}
              style={{ marginRight: "8px" }}
            >
              <FontAwesomeIcon icon={faPenToSquare} /> Edit
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              <FontAwesomeIcon icon={faTrash} /> Delete
            </Button>
          </div>
        ) : (
          <div>
            <Button
              variant={currentState === "delete" ? "danger" : "success"}
              disabled={loading}
              style={{ marginRight: "8px" }}
              onClick={handleConfirm}
            >
              {loading ? (
                <Spinner
                  animation="border"
                  style={{ width: "18px", height: "18px" }}
                />
              ) : (
                <>
                  <FontAwesomeIcon icon={faCheck} /> Confirm
                </>
              )}
            </Button>
            <Button variant="dark" onClick={handleCancel}>
              <FontAwesomeIcon icon={faXmark} />
            </Button>
          </div>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default KnifeModal;
