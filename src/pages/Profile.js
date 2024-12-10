import { useContext, useState } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import UserContext from "../UserContext";
import { Navigate } from "react-router-dom";

export default function Profile() {
  const { user, setUser } = useContext(UserContext);

  // States to store profile information
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // On form submit, update user profile
  function updateProfile(e) {
    e.preventDefault();

    // Validate passwords
    if (password && password !== confirmPassword) {
      Swal.fire({
        title: "Password Mismatch",
        text: "The passwords do not match. Please try again.",
        icon: "error",
      });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        title: "Unauthorized",
        text: "Please login to update your profile.",
        icon: "error",
      });
      return;
    }

    // Prepare data to send to the backend
    const updatedData = {
      firstName,
      middleName,
      lastName,
      email,
      contactNumber,
      password, 
    };

    // Send request to backend to update profile
    fetch("http://localhost:4000/users/edit", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.code === "USER-UPDATED") {
          Swal.fire({
            title: "Profile Updated",
            text: result.message,
            icon: "success",
          });
          
          // Update the user context with the new user data
          setUser({
            id: result.user._id,
            firstName: result.user.firstName,
            middleName: result.user.middleName,
            lastName: result.user.lastName,
            email: result.user.email,
            contactNumber: result.user.contactNumber,
            isAdmin: result.user.isAdmin,
          });

          // Update local state with the new profile values
          setFirstName(result.user.firstName);
          setMiddleName(result.user.middleName);
          setLastName(result.user.lastName);
          setEmail(result.user.email);
          setContactNumber(result.user.contactNumber);
          setPassword(""); 
          setConfirmPassword(""); 
        } else {
          Swal.fire({
            title: "Update Failed",
            text: result.message || "Something went wrong.",
            icon: "error",
          });
        }
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to update profile.",
          icon: "error",
        });
      });
  }

  // If user is not logged in, redirect to login page
  if (user.id === null) {
    return <Navigate to="/login" />;
  }

  return (
    <Container fluid className="vh-100">
      <Row>
        <Col className="vh-100 bg-warning col-6 d-flex flex-column align-items-center justify-content-center text-center">
          <h1 className="display-5 fw-bold">Update Your Profile</h1>
          <p className="display-6">Make sure your details are up to date!</p>
        </Col>

        <Col className="vh-100 col-6">
          <Container fluid className="p-5 d-flex flex-column align-items-center justify-content-center vh-100">
            <Form className="w-100 p-5 shadow rounded-3 border-bottom border-3 border-warning" onSubmit={updateProfile}>
              <h1 className="display-5 fw-bold mb-5">Edit Profile</h1>

           
              <Form.Group className="mb-3">
                <Form.Control type="text" placeholder="First Name" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control type="text" placeholder="Middle Name" value={middleName} onChange={(e) => setMiddleName(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control type="text" placeholder="Last Name" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control type="text" placeholder="Contact Number" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control type="password" placeholder="New Password (leave empty to keep current)" value={password} onChange={(e) => setPassword(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Button variant="warning" className="w-100 rounded-pill" type="submit">
                  Update Profile
                </Button>
              </Form.Group>
            </Form>

         
            <Container className="mt-5">
              <h2>Your Updated Profile</h2>
              <div className="card w-100 p-4 shadow-sm rounded-3">
                <h5><strong>First Name:</strong> {firstName}</h5>
                <h5><strong>Middle Name:</strong> {middleName}</h5>
                <h5><strong>Last Name:</strong> {lastName}</h5>
                <h5><strong>Email:</strong> {email}</h5>
                <h5><strong>Contact Number:</strong> {contactNumber}</h5>
              </div>
            </Container>
          </Container>
        </Col>
      </Row>
    </Container>
  );
}
