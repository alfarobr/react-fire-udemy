import { Button } from "@mui/material";
import { logout } from "../config/firebase";

const Dashboard = () => {
    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <h1>Dashboard (ruta protegida)</h1>
            <Button onClick={handleLogout} variant="contained">
                Logout
            </Button>
        </>
    );
};

export default Dashboard;
