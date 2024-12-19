import React, { FC, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
   PageHeaderWrapper,
   HeaderContainer
} from './PageHeader.styled.ts';
import { useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightToBracket, faRightFromBracket, faPenToSquare, faScissors } from '@fortawesome/free-solid-svg-icons'

import { Container, Navbar, Nav, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

interface PageHeaderProps { }

const PageHeader: FC<PageHeaderProps> = () => {
   const [nickname, setNickname] = useState<string | null>(null);
   const navigate = useNavigate();

   useEffect(() => {
      const handleLoginUpdate = () => {
         const token = localStorage.getItem("token");
         setNickname(token);
      };

      handleLoginUpdate();

      window.addEventListener("loggedIn", handleLoginUpdate);
   }, []);

   const handleLogOut = () => {
      localStorage.removeItem("token");
      setNickname(null);
      navigate('/');
   };

   return (
      <PageHeaderWrapper>
         <HeaderContainer>
            <Navbar bg="dark" data-bs-theme="dark" style={{ width: "100%", borderRadius: "12px" }}>
               <Container>
                  <div>
                     <Link to="/" style={{ textDecoration: 'none' }}>
                        <Navbar.Brand style={{ cursor: 'pointer' }}>
                           <FontAwesomeIcon icon={faScissors} /> Knifes shop
                        </Navbar.Brand>
                     </Link>
                  </div>
                  <Nav className="me-auto">
                     {!nickname && (
                        <Nav.Link as={Link} to="/Login" style={{ paddingRight: "22px" }}><FontAwesomeIcon icon={faRightToBracket} /> Log in</Nav.Link>
                     )}
                     {nickname && (
                        <Nav.Link as={Link} to="/Edit" style={{ paddingRight: "22px" }}><FontAwesomeIcon icon={faPenToSquare} /> Edit knifes</Nav.Link>
                     )}
                  </Nav>
                  {nickname && (
                     <Navbar.Collapse className="justify-content-end">
                        <Dropdown align="end" style={{ marginRight: "18px" }}>
                           <Dropdown.Toggle
                              as="div"
                              style={{
                                 cursor: "pointer",
                                 color: "white",
                                 display: "inline-block",
                                 width: "60px",
                                 padding: "4px 14px",
                                 position: "absolute",
                                 left: "-28px",
                                 top: "-2px"
                              }}
                           >
                           </Dropdown.Toggle>
                           <span style={{ color: "white", }}>{nickname}</span>
                           <Dropdown.Menu
                              variant="dark"
                              style={{
                                 padding: "4px",
                                 marginTop: "-33px",
                                 right: "-11.5px",
                              }}>
                              <p
                                 style={{
                                    paddingRight: "6px",
                                    textAlign: "end",
                                    paddingTop: "4px"
                                 }}>
                                 Logged in as: <span style={{ fontWeight: "700" }}>{nickname}</span>
                              </p>
                              <Dropdown.Item
                                 style={{ borderRadius: "4px", paddingRight: "6px", textAlign: "end" }}
                                 onClick={() => handleLogOut()}
                              >
                                 Sign out <FontAwesomeIcon style={{ marginLeft: "4px" }} icon={faRightFromBracket} />
                              </Dropdown.Item>
                           </Dropdown.Menu>
                        </Dropdown>
                     </Navbar.Collapse>
                  )}
               </Container>
            </Navbar>
         </HeaderContainer>
      </PageHeaderWrapper>
   );
};

export default PageHeader;
