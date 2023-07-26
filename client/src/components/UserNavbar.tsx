import { NavLink, useNavigate } from "react-router-dom";
import { User } from "../types";
import { Avatar, Dropdown, Nav, Navbar } from 'rsuite'

interface Props {
    user: User,
    onLogout: () => void,
    isAdmin?: boolean
}

export default function UserNavbar(props: Props) {
    const navigate = useNavigate();
    return (
        <Navbar>
            <Navbar.Brand>
                Store
            </Navbar.Brand>
            <Nav>
                <Nav.Item as={NavLink} to='/'>Home</Nav.Item>
            </Nav>
            <Nav>
                <Nav.Item as={NavLink} to='/shop'>Shop</Nav.Item>
            </Nav>
            <Nav pullRight>
                <Nav.Item as={NavLink} to='/cart'>Cart</Nav.Item>
                <Dropdown title={props.user.firstName + ' ' + props.user.lastName}>
                    <Dropdown.Item onClick={() => {
                        props.onLogout();
                        navigate('/');
                    }}>Logout</Dropdown.Item>
                </Dropdown>
            </Nav>
        </Navbar>
    )
}