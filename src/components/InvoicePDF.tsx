// src/components/InvoicePDF.tsx
import { Document, Page, Text, View, StyleSheet, pdf, Font } from '@react-pdf/renderer';

// Police optionnelle (facultatif mais joli)
Font.register({
    family: 'Roboto',
    src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf'
});

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Roboto',
        fontSize: 11,
        color: '#2c3e50',
        backgroundColor: '#ffffff'
    },
    header: {
        marginBottom: 35,
        borderBottom: '3px solid #E53935',
        paddingBottom: 20,
        backgroundColor: '#fef5f5',
        padding: 20,
        marginLeft: -40,
        marginRight: -40,
        marginTop: -40,
        paddingTop: 15
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#E53935',
        textAlign: 'center',
        letterSpacing: 2
    },
    subtitle: {
        fontSize: 13,
        textAlign: 'center',
        marginTop: 10,
        color: '#7f8c8d',
        textTransform: 'uppercase',
        letterSpacing: 1
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
        gap: 20
    },
    infoBox: {
        flex: 1,
        padding: 15,
        backgroundColor: '#f8f9fa',
        borderRadius: 4,
        border: '1px solid #e9ecef'
    },
    infoTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#E53935',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 8,
        alignItems: 'flex-start'
    },
    infoLabel: {
        fontSize: 10,
        color: '#7f8c8d',
        width: '40%',
        fontWeight: 'bold'
    },
    infoValue: {
        fontSize: 10,
        color: '#2c3e50',
        width: '60%',
        flexWrap: 'wrap'
    },
    section: { marginBottom: 25 },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 15,
        paddingBottom: 8,
        borderBottom: '2px solid #ecf0f1'
    },
    table: {
        marginTop: 10,
        border: '1px solid #e9ecef',
        borderRadius: 4
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#E53935',
        padding: 12,
        fontWeight: 'bold',
        color: '#ffffff'
    },
    tableRow: {
        flexDirection: 'row',
        padding: 12,
        borderBottom: '1px solid #e9ecef',
        backgroundColor: '#ffffff'
    },
    tableRowAlt: {
        flexDirection: 'row',
        padding: 12,
        borderBottom: '1px solid #e9ecef',
        backgroundColor: '#f8f9fa'
    },
    colDesc: {
        width: '45%',
        fontSize: 10,
        color: '#2c3e50'
    },
    colQty: {
        width: '15%',
        textAlign: 'center',
        fontSize: 10,
        color: '#2c3e50'
    },
    colPrice: {
        width: '20%',
        textAlign: 'right',
        fontSize: 10,
        color: '#2c3e50'
    },
    colTotal: {
        width: '20%',
        textAlign: 'right',
        fontSize: 10,
        fontWeight: 'bold',
        color: '#E53935'
    },
    colTotalAlt: {
        width: '20%',
        textAlign: 'right',
        fontSize: 10,
        fontWeight: 'bold',
        color: '#2c3e50'
    },
    totalSection: {
        marginTop: 30,
        alignItems: 'flex-end',
        paddingTop: 20,
        borderTop: '2px solid #ecf0f1'
    },
    totalLine: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 280,
        marginBottom: 10,
        paddingVertical: 6,
        paddingHorizontal: 15
    },
    totalLabel: {
        fontSize: 11,
        color: '#7f8c8d'
    },
    totalValue: {
        fontSize: 11,
        color: '#2c3e50',
        fontWeight: 'bold'
    },
    shippingLine: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 280,
        marginBottom: 15,
        paddingVertical: 6,
        paddingHorizontal: 15,
        borderBottom: '1px solid #ecf0f1'
    },
    grandTotalBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 280,
        backgroundColor: '#E53935',
        padding: 15,
        marginTop: 10,
        borderRadius: 4
    },
    grandTotalLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#ffffff',
        textTransform: 'uppercase',
        letterSpacing: 0.5
    },
    grandTotalValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff'
    },
    footer: {
        marginTop: 60,
        textAlign: 'center',
        color: '#95a5a6',
        fontSize: 9,
        paddingTop: 20,
        borderTop: '1px solid #ecf0f1'
    },
    footerBold: {
        fontWeight: 'bold',
        color: '#7f8c8d'
    }
});

interface Order {
    _id: string;
    items: { productId: { name: string; price: number }; quantity: number }[];
    totalAmount: number;
    status: string;
    createdAt: string;
    shippingAddress: { address: string; phone: string; name: string };
}

interface InvoicePDFProps {
    order: Order;
    user: { name: string; email: string };
}

const InvoicePDF = ({ order, user }: InvoicePDFProps) => {
    // Calculate subtotal with proper null checks
    const calculateSubtotal = () => {
        return order.items.reduce((sum, item) => {
            const price = item.productId?.price || 0;
            const quantity = item.quantity || 0;
            return sum + (price * quantity);
        }, 0);
    };

    const subtotal = calculateSubtotal();
    const shippingCost = 7;
    const grandTotal = subtotal + shippingCost;

    // Format price with proper null checks
    const formatPrice = (price: number | undefined | null): string => {
        return (price || 0).toFixed(2);
    };

    // Format status in French
    const getStatusLabel = (status: string): string => {
        const statusMap: { [key: string]: string } = {
            'delivered': 'Livrée',
            'confirmed': 'Confirmée',
            'pending': 'En attente',
            'processing': 'En cours',
            'shipped': 'Expédiée'
        };
        return statusMap[status] || 'En attente';
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* En-tête */}
                <View style={styles.header}>
                    <Text style={styles.title}>NEMEZ</Text>
                    <Text style={styles.subtitle}>Facture Officielle</Text>
                </View>

                {/* Infos client & commande en deux colonnes */}
                <View style={styles.infoContainer}>
                    <View style={styles.infoBox}>
                        <Text style={styles.infoTitle}>Informations Client</Text>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Nom:</Text>
                            <Text style={styles.infoValue}>{user.name || 'N/A'}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Email:</Text>
                            <Text style={styles.infoValue}>{user.email || 'N/A'}</Text>
                        </View>
                        {order.shippingAddress && (
                            <>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Téléphone:</Text>
                                    <Text style={styles.infoValue}>{order.shippingAddress.phone || 'N/A'}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Adresse:</Text>
                                    <Text style={styles.infoValue}>{order.shippingAddress.address || 'N/A'}</Text>
                                </View>
                            </>
                        )}
                    </View>

                    <View style={styles.infoBox}>
                        <Text style={styles.infoTitle}>Détails Commande</Text>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>N° Commande:</Text>
                            <Text style={styles.infoValue}>#{order._id.slice(-8).toUpperCase()}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Date:</Text>
                            <Text style={styles.infoValue}>
                                {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Statut:</Text>
                            <Text style={styles.infoValue}>{getStatusLabel(order.status)}</Text>
                        </View>
                    </View>
                </View>

                {/* Tableau des produits */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Articles Commandés</Text>
                    <View style={styles.table}>
                        <View style={styles.tableHeader}>
                            <Text style={styles.colDesc}>Produit</Text>
                            <Text style={styles.colQty}>Qté</Text>
                            <Text style={styles.colPrice}>Prix</Text>
                            <Text style={styles.colTotalAlt}>Total</Text>
                        </View>
                        {order.items.map((item, i) => {
                            const price = item.productId?.price || 0;
                            const quantity = item.quantity || 0;
                            const total = price * quantity;

                            return (
                                <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                                    <Text style={styles.colDesc}>{item.productId?.name || 'Produit inconnu'}</Text>
                                    <Text style={styles.colQty}>{quantity}</Text>
                                    <Text style={styles.colPrice}>{formatPrice(price)} TND</Text>
                                    <Text style={styles.colTotal}>{formatPrice(total)} TND</Text>
                                </View>
                            );
                        })}
                    </View>
                </View>

                {/* Total */}
                <View style={styles.totalSection}>
                    <View style={styles.totalLine}>
                        <Text style={styles.totalLabel}>Sous-total:</Text>
                        <Text style={styles.totalValue}>{formatPrice(subtotal)} TND</Text>
                    </View>
                    <View style={styles.shippingLine}>
                        <Text style={styles.totalLabel}>Frais de livraison:</Text>
                        <Text style={styles.totalValue}>{formatPrice(shippingCost)} TND</Text>
                    </View>
                    <View style={styles.grandTotalBox}>
                        <Text style={styles.grandTotalLabel}>Total à Payer</Text>
                        <Text style={styles.grandTotalValue}>{formatPrice(grandTotal)} TND</Text>
                    </View>
                </View>

                <Text style={styles.footer}>
                    Merci pour votre confiance{'\n'}
                    <Text style={styles.footerBold}>NEMEZ</Text> • contact@nemeztunisie.com • www.nemeztunisie.com
                </Text>
            </Page>
        </Document>
    );
};

export const generateInvoicePDF = async (order: Order, user: any) => {
    const blob = await pdf(<InvoicePDF order={order} user={user} />).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Facture_NEMEZ_${order._id.slice(-8)}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
};