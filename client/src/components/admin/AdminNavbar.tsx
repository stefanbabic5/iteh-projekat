import { Dropdown, Nav, Navbar } from "rsuite";
import { User } from "../../types";
import { NavLink, useNavigate } from "react-router-dom";

interface Props {
    user: User,
    onLogout: () => void
}

export default function AdminNavbar(props: Props) {
    const navigate = useNavigate();
    return (
        <Navbar>
            <Navbar.Brand>
                Store admin
            </Navbar.Brand>
            <Nav>
                <Nav.Item as={NavLink} to='/'>Order monitoring</Nav.Item>
                <Nav.Item as={NavLink} to='/item-group'>Item groups</Nav.Item>
                <Nav.Item as={NavLink} to='/item'>Items</Nav.Item>
                <Nav.Item as={NavLink} to='/statistics'>Statistics</Nav.Item>
            </Nav>
            <Nav pullRight>
                <Dropdown title={'Admin: ' + props.user.firstName + ' ' + props.user.lastName}>
                    <Dropdown.Item onClick={() => {
                        props.onLogout();
                        navigate('/');
                    }}>Logout</Dropdown.Item>
                </Dropdown>
            </Nav>
        </Navbar>
    )
}