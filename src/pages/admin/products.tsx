import useSWR from 'swr'
import { Box, Button, CardMedia, Grid } from "@mui/material"
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid"
import { AdminLayout } from "@/components/layouts"

import { IProduct } from "@/interfaces"
import { AddOutlined, CategoryOutlined } from "@mui/icons-material"
import Link from 'next/link'

const columns: GridColDef[] = [
    {
        field: 'img',
        headerName: "Foto",
        renderCell: ({ row }: GridRenderCellParams<IProduct>) => {
            return (
                <a href={`/product/${row.slug}`} target='_blank' rel='noreferrer'>
                    <CardMedia
                        alt={row.title}
                        component='img'
                        className='fadeIn'
                        image={row.img}
                    />
                </a >
            )
        }
    },
    {
        field: 'title',
        headerName: "Title",
        width: 250,
        renderCell: ({ row }: GridRenderCellParams<IProduct>) => {
            return (
                <Link href={`/admin/products/${row.slug}`} passHref>{row.title}</Link>
            )
        }

    },
    { field: 'gender', headerName: "Genero" },
    { field: 'type', headerName: "Tipo" },
    { field: 'inStock', headerName: "Inventario" },
    { field: 'price', headerName: "Precio" },
    { field: 'sizes', headerName: "Tallas", width: 250 },
]


const ProductsPage = () => {
    const { data, error } = useSWR<IProduct[]>('/api/admin/products')
    if (!data && !error) return (<></>);

    const rows = data!.map((product) => ({
        id: product._id,
        img: product.images[0],
        title: product.title,
        gender: product.gender,
        type: product.type,
        inStock: product.inStock,
        price: product.price,
        sizes: product.sizes.join(', '),
        slug: product.slug
    }))
    return (
        <AdminLayout
            title={`Products (${data?.length})`}
            subtitle={"Mantenimiento de Productos"}
            icon={<CategoryOutlined />}
        >
            <Box display='flex' justifyContent='flex-end' sx={{ mb: 2 }}>
                <Button
                    startIcon={<AddOutlined />}
                    color='secondary'
                    href='/admin/products/new'
                >
                    Crear Producto
                </Button>
            </Box>
            <Grid container className="fadeIn">
                <Grid item xs={12} sx={{ height: 650, width: "100%" }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                    />
                </Grid>

            </Grid>
        </AdminLayout>

    )
}

export default ProductsPage;