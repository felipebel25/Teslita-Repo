import { useContext, useState } from "react"
import { useRouter } from "next/router"
import { Box, Divider, Drawer, IconButton, Input, InputAdornment, List, ListItem, ListItemIcon, ListItemText, ListSubheader } from "@mui/material"
import { UiContext } from "context"

import { AccountCircleOutlined, AdminPanelSettings, CategoryOutlined, ConfirmationNumberOutlined, EscalatorWarningOutlined, FemaleOutlined, LoginOutlined, MaleOutlined, SearchOutlined, VpnKeyOutlined } from "@mui/icons-material"


export const SideMenu = () => {
    const { push } = useRouter()
    const { isMenuOpen, toggleSideMenu } = useContext(UiContext)
    const [searchTerm, setSearchTerm] = useState('');

    const onSearchTerm = () => {
        if (searchTerm.trim().length === 0) return;
        navigateTo(`/search/${searchTerm}`)
    }

    const navigateTo = (url: string) => {
        push(url)
        toggleSideMenu()
    }
    return (
        <Drawer
            open={isMenuOpen}
            onClose={toggleSideMenu}
            anchor='right'
            sx={{ backdropFilter: 'blur(4px)', transition: 'all 0.5s ease-out' }}
        >
            <Box sx={{ width: 250, paddingTop: 5 }}>

                <List>
                    <ListItem>
                        <Input
                            autoFocus
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            type='text'
                            placeholder="Buscar..."
                            onKeyPress={(e) => e.key === "Enter" ? onSearchTerm() : ""}
                            sx={{ display: { xs: 'flex', md: "none" } }}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={onSearchTerm}
                                    >
                                        <SearchOutlined />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon>
                            <AccountCircleOutlined />
                        </ListItemIcon>
                        <ListItemText primary={'Perfil'} />
                    </ListItem>

                    <ListItem button>
                        <ListItemIcon>
                            <ConfirmationNumberOutlined />
                        </ListItemIcon>
                        <ListItemText primary={'Mis Ordenes'} />
                    </ListItem>


                    <ListItem button sx={{ display: { xs: '', sm: 'none' } }}>
                        <ListItemIcon>
                            <MaleOutlined />
                        </ListItemIcon>
                        <ListItemText onClick={() => navigateTo('/category/men')} primary={'Hombres'} />
                    </ListItem>

                    <ListItem button sx={{ display: { xs: '', sm: 'none' } }}>
                        <ListItemIcon>
                            <FemaleOutlined />
                        </ListItemIcon>
                        <ListItemText onClick={() => navigateTo('/category/women')} primary={'Mujeres'} />
                    </ListItem>

                    <ListItem button sx={{ display: { xs: '', sm: 'none' } }}>
                        <ListItemIcon>
                            <EscalatorWarningOutlined />
                        </ListItemIcon>
                        <ListItemText onClick={() => navigateTo('/category/kid')} primary={'Ni??os'} />
                    </ListItem>

                    <ListItem button>
                        <ListItemIcon>
                            <VpnKeyOutlined />
                        </ListItemIcon>
                        <ListItemText primary={'Ingresar'} />
                    </ListItem>

                    <ListItem button>
                        <ListItemIcon>
                            <LoginOutlined />
                        </ListItemIcon>
                        <ListItemText primary={'Salir'} />
                    </ListItem>

                    {/* Admin */}
                    <Divider />
                    <ListSubheader>Admin Panel</ListSubheader>

                    <ListItem button>
                        <ListItemIcon>
                            <CategoryOutlined />
                        </ListItemIcon>
                        <ListItemText primary={'Productos'} />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon>
                            <ConfirmationNumberOutlined />
                        </ListItemIcon>
                        <ListItemText primary={'Ordenes'} />
                    </ListItem>

                    <ListItem button>
                        <ListItemIcon>
                            <AdminPanelSettings />
                        </ListItemIcon>
                        <ListItemText primary={'Usuarios'} />
                    </ListItem>
                </List>
            </Box>
        </Drawer>
    )
}