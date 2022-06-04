import React, { useContext } from "react";
import { Alert, Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { USER_ROLE } from "../../constants/user";
import { UserContext } from "../../context/UserContext/UserContext";
import AuthGuard from "./AuthGuard";

export default function AdminGuard({ children }) {
    const navigate = useNavigate();
    const { user } = useContext(UserContext)
    if (!user.id)
        return <AuthGuard>{children}</AuthGuard>

    const navigateHome = () => navigate('/');

    return user.id && USER_ROLE[user.role] === USER_ROLE.ADMIN
        ? children
        : (
            <Modal.Dialog>
                <Alert variant="danger">
                    <Modal.Header>
                        <Modal.Title>Permission denied</Modal.Title>
                    </Modal.Header>
                </Alert>

                <Modal.Body>
                    <p>You don't have permission to access this page.</p>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={navigateHome}>Close</Button>
                </Modal.Footer>
            </Modal.Dialog>
        )
}